<script lang="ts">
	import { TRAIT_MAP, RETAINER_MAP } from '$lib/situations';
	import {
		getAvailableAccoutrements,
		getRetainerAvailableAccoutrements,
		getExtraAccoutrementOptions,
		ACCOUTREMENT_MAP
	} from '$lib/accoutrements';
	import { formatModifier } from '$lib/modifiers';
	import type { createCharacter } from '$lib/character.svelte';
	import type { CharacterSlot, AccoutrementDef } from '$lib/types';

	type Character = ReturnType<typeof createCharacter>;

	let { character, onadvance }: { character: Character; onadvance: () => void } = $props();

	function slotLabel(slot: CharacterSlot): string {
		if (slot.type === 'trait') {
			return TRAIT_MAP.get(slot.traitId)?.label ?? slot.traitId;
		}
		return RETAINER_MAP.get(slot.retainerId)?.label ?? slot.retainerId;
	}

	function slotId(slot: CharacterSlot): string {
		return slot.type === 'trait' ? slot.traitId : slot.retainerId;
	}

	/** Count how many slots have at least one accoutrement selected */
	let filledCount = $derived(
		character.slots.filter((slot) => {
			const id = slotId(slot);
			// Retainers with 0 accoutrement slots count as "filled" (nothing to pick)
			if (slot.type === 'retainer') {
				const def = RETAINER_MAP.get(slot.retainerId);
				if (!def || def.accoutrementSlots === 0) return true;
			}
			const accIds = character.accoutrements[id];
			return accIds && accIds.length > 0;
		}).length
	);

	let totalPickable = $derived(
		character.slots.filter((slot) => {
			if (slot.type === 'retainer') {
				const def = RETAINER_MAP.get(slot.retainerId);
				return def && def.accoutrementSlots > 0;
			}
			return true;
		}).length
	);

	let allFilled = $derived(filledCount === character.slots.length);

	const SLOT_NUMERALS = ['I', 'II', 'III', 'IV', 'V'];

	/** Track which slot card is expanded for selection */
	let expandedSlot = $state<string | null>(null);

	function toggleSlot(id: string) {
		expandedSlot = expandedSlot === id ? null : id;
	}

	/** Group accoutrements by their slotId (trait) */
	function groupByTrait(accs: AccoutrementDef[]): { traitId: string; traitLabel: string; items: AccoutrementDef[] }[] {
		const map = new Map<string, AccoutrementDef[]>();
		for (const acc of accs) {
			const list = map.get(acc.slotId) ?? [];
			list.push(acc);
			map.set(acc.slotId, list);
		}
		return [...map.entries()].map(([traitId, items]) => ({
			traitId,
			traitLabel: TRAIT_MAP.get(traitId)?.label ?? traitId,
			items
		}));
	}

	/** Toggle a retainer accoutrement: deselect if already picked, otherwise add at next free index */
	function toggleRetainerAccoutrement(sid: string, accId: string, maxSlots: number) {
		const accIds = character.accoutrements[sid] ?? [];
		const existingIndex = accIds.indexOf(accId);
		if (existingIndex >= 0) {
			// Deselect
			character.setAccoutrement(sid, '', existingIndex);
		} else if (accIds.length < maxSlots) {
			// Add at next available index
			character.setAccoutrement(sid, accId, accIds.length);
		}
	}

	/** Pick a random element from an array */
	function pickRandom<T>(arr: T[]): T {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	/** Track which slots are currently "rolling" for animation */
	let rollingSlots = $state<Set<string>>(new Set());

	/** Randomly select accoutrements for a single slot */
	function randomizeSlot(slot: CharacterSlot) {
		const sid = slotId(slot);
		const isRetainer = slot.type === 'retainer';

		if (isRetainer) {
			const def = RETAINER_MAP.get(slot.retainerId);
			if (!def || def.accoutrementSlots === 0) return;
			if (!def.accoutrementTypes) return;

			const available = getRetainerAvailableAccoutrements(def.accoutrementTypes, character.hasRetainer);
			if (available.length === 0) return;

			// Clear existing picks first
			const existing = character.accoutrements[sid] ?? [];
			for (let i = existing.length - 1; i >= 0; i--) {
				character.setAccoutrement(sid, '', i);
			}

			// Pick random accoutrements up to slot limit
			const shuffled = [...available].sort(() => Math.random() - 0.5);
			const count = Math.min(def.accoutrementSlots, shuffled.length);
			for (let i = 0; i < count; i++) {
				character.setAccoutrement(sid, shuffled[i].id, i);
			}
		} else {
			const available = getAvailableAccoutrements(sid, character.hasRetainer);
			if (available.length === 0) return;

			// Pick a random primary accoutrement
			const primary = pickRandom(available);
			character.setAccoutrement(sid, primary.id);

			// If it grants a bonus, pick a random bonus too
			if (primary.grantsExtra) {
				const extraOptions = getExtraAccoutrementOptions(primary.id, character.hasRetainer);
				if (extraOptions.length > 0) {
					const bonus = pickRandom(extraOptions);
					character.setAccoutrement(sid, bonus.id, 1);
				}
			}
		}
	}

	/** Animate a slot roll with a brief cycling effect, then land on the real pick */
	function rollSlot(slot: CharacterSlot) {
		const sid = slotId(slot);
		rollingSlots = new Set([...rollingSlots, sid]);

		// Brief animation: cycle through random picks visually
		const steps = 4 + Math.floor(Math.random() * 3);
		let step = 0;
		const interval = setInterval(() => {
			randomizeSlot(slot);
			step++;
			if (step >= steps) {
				clearInterval(interval);
				randomizeSlot(slot);
				rollingSlots = new Set([...rollingSlots].filter((id) => id !== sid));
			}
		}, 80);
	}

	/** Roll for all unfilled pickable slots with staggered timing */
	function rollAll() {
		const pickableSlots = character.slots.filter((slot) => {
			const sid = slotId(slot);
			if (slot.type === 'retainer') {
				const def = RETAINER_MAP.get(slot.retainerId);
				if (!def || def.accoutrementSlots === 0) return false;
			}
			const accIds = character.accoutrements[sid] ?? [];
			return accIds.length === 0;
		});

		if (pickableSlots.length === 0) {
			// If all filled, re-roll everything pickable
			const allPickable = character.slots.filter((slot) => {
				if (slot.type === 'retainer') {
					const def = RETAINER_MAP.get(slot.retainerId);
					return def && def.accoutrementSlots > 0;
				}
				return true;
			});
			allPickable.forEach((slot, i) => {
				setTimeout(() => rollSlot(slot), i * 150);
			});
		} else {
			pickableSlots.forEach((slot, i) => {
				setTimeout(() => rollSlot(slot), i * 150);
			});
		}
	}
</script>

<div class="mx-auto max-w-4xl px-4">
	<!-- Header -->
	<div class="mb-10 text-center">
		<h1 class="font-display mb-3 text-4xl font-bold tracking-wide text-gold-light md:text-5xl">
			CMRP
		</h1>
		<p class="font-heading text-lg tracking-widest text-parchment-300 uppercase">
			Character Creation
		</p>
		<div class="mx-auto mt-4 flex items-center justify-center gap-3">
			<span class="h-px flex-1 max-w-16 bg-gold-dark/40"></span>
			<span class="font-heading text-sm tracking-widest text-gold/60"
				>IV. Outfit Your Person</span
			>
			<span class="h-px flex-1 max-w-16 bg-gold-dark/40"></span>
		</div>
	</div>

	<!-- Flavour intro -->
	<p class="mx-auto mb-10 max-w-lg text-center leading-relaxed text-parchment-300">
		Each slot in your ledger comes with one <span class="font-heading font-semibold text-gold">accoutrement</span>
		— a piece of equipment, companion, or curiosity that modifies your rolls.
		Roll the dice to determine what fate provides, or choose manually below.
	</p>

	<!-- Roll All button — prominent, this is the primary action -->
	<div class="mx-auto mb-8 max-w-2xl text-center">
		<button
			class="group/roll font-heading inline-flex cursor-pointer items-center gap-3 rounded-sm border-2 border-gold bg-gold/10 px-7 py-3 text-base font-bold tracking-wider text-gold uppercase transition-all duration-300 hover:bg-gold/20 hover:shadow-[0_0_24px_rgba(184,152,68,0.25)]"
			onclick={rollAll}
		>
			<svg
				class="h-5 w-5 transition-transform duration-300 group-hover/roll:rotate-[30deg]"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<rect x="3" y="3" width="18" height="18" rx="3" />
				<circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
				<circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
				<circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
				<circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
				<circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
			</svg>
			{allFilled ? 'Re-roll All' : 'Roll All'}
		</button>
	</div>

	<!-- Progress indicator -->
	<div class="mx-auto mb-8 max-w-lg">
		<div class="flex items-center justify-between text-sm">
			<span class="font-heading tracking-wide text-parchment-300/60">
				{filledCount} of {character.slots.length} slots outfitted
			</span>
			{#if !allFilled}
				<span class="font-heading text-xs tracking-wide text-gold/50">
					{totalPickable - (filledCount - (character.slots.length - totalPickable))} remaining
				</span>
			{/if}
		</div>
		<div class="mt-2 h-1 overflow-hidden rounded-full bg-parchment-300/15">
			<div
				class="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold transition-all duration-500"
				style="width: {(filledCount / character.slots.length) * 100}%"
			></div>
		</div>
	</div>

	<!-- Slot Cards -->
	<div class="mx-auto max-w-2xl space-y-4">
		{#each character.slots as slot, i}
			{@const sid = slotId(slot)}
			{@const label = slotLabel(slot)}
			{@const accIds = character.accoutrements[sid] ?? []}
			{@const isRetainer = slot.type === 'retainer'}
			{@const retainerDef = isRetainer ? RETAINER_MAP.get(slot.retainerId) : undefined}
			{@const retainerSlotCount = retainerDef?.accoutrementSlots ?? 0}
			{@const canCarry = isRetainer ? retainerSlotCount > 0 : true}
			{@const hasPick = accIds.length > 0}
			{@const isExpanded = expandedSlot === sid}

			<div
				class="group relative rounded-sm border-2 transition-all duration-300
					{hasPick
					? 'parchment-bg border-gold/40'
					: canCarry
						? 'parchment-bg border-parchment-300/50'
						: 'border-parchment-300/20 bg-parchment-50/20'}"
			>
				<!-- Card Header — expand button + roll button side by side -->
				<div class="flex w-full items-stretch">
					<!-- Clickable expand area -->
					<button
						class="flex flex-1 cursor-pointer items-center gap-0 text-left transition-colors duration-200
							{canCarry ? 'hover:bg-gold/5' : 'cursor-default'}"
						onclick={() => canCarry && toggleSlot(sid)}
						disabled={!canCarry}
					>
						<!-- Slot numeral -->
						<div
							class="flex w-12 shrink-0 items-center justify-center self-stretch border-r sm:w-14
								{hasPick
								? 'border-gold/20 bg-gold/8'
								: canCarry
									? 'border-parchment-300/30 bg-parchment-200/20'
									: 'border-parchment-300/10 bg-parchment-200/5'}"
						>
							<span
								class="font-display text-lg font-bold
									{hasPick ? 'text-gold/60' : canCarry ? 'text-ink/20' : 'text-parchment-300/20'}"
							>
								{SLOT_NUMERALS[i]}
							</span>
						</div>

						<!-- Slot info -->
						<div class="flex min-h-[3.5rem] flex-1 items-center gap-3 px-4 py-2.5">
							<!-- Type badge -->
							<span
								class="font-heading shrink-0 rounded-sm px-2 py-0.5 text-xs font-medium
									{isRetainer
									? 'bg-gold/15 text-gold-dark'
									: 'bg-crimson/10 text-crimson'}"
							>
								{isRetainer ? 'Retainer' : 'Trait'}
							</span>

							<!-- Slot name -->
							<span class="font-heading text-sm font-semibold tracking-wide text-ink">
								{label}
							</span>

							<span class="flex-1"></span>

							<!-- Status -->
							{#if !canCarry}
								<span class="font-heading text-xs tracking-wide text-ink-faint/40">
									No accoutrement slots
								</span>
							{:else if hasPick}
								<span class="flex flex-wrap items-center gap-1.5">
									{#each accIds as accId, ai}
										{#if ai > 0}
											<span class="text-gold-dark/30">&middot;</span>
										{/if}
										<span class="font-heading inline-block rounded-sm bg-gold/10 px-1.5 py-0.5 text-xs tracking-wide text-gold-dark/80">
											{ACCOUTREMENT_MAP.get(accId)?.label ?? accId}
										</span>
									{/each}
								</span>
							{:else}
								<span class="font-heading text-xs tracking-wide text-crimson/50">
									Not yet outfitted
								</span>
							{/if}

							<!-- Expand chevron -->
							{#if canCarry}
								<svg
									class="h-4 w-4 text-ink-faint/40 transition-transform duration-200
										{isExpanded ? 'rotate-180' : ''}"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<polyline points="6 9 12 15 18 9" />
								</svg>
							{/if}
						</div>
					</button>

					<!-- Per-slot roll button — sibling of the expand button, not nested -->
					{#if canCarry}
						{@const isRolling = rollingSlots.has(sid)}
						<button
							class="flex w-11 shrink-0 cursor-pointer items-center justify-center border-l transition-all duration-200
								{isRolling
								? 'border-gold/40 bg-gold/15 text-gold'
								: 'border-parchment-300/20 text-ink-faint/40 hover:bg-gold/8 hover:text-gold/70'}"
							onclick={() => rollSlot(slot)}
							title="Roll randomly"
						>
							<svg
								class="h-4 w-4 {isRolling ? 'roll-spinning' : ''}"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<rect x="3" y="3" width="18" height="18" rx="3" />
								<circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
								<circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
							</svg>
						</button>
					{/if}
				</div>

				<!-- Expanded Selection Area -->
				{#if isExpanded && canCarry}
					<div class="border-t border-parchment-300/30 px-4 py-5 sm:px-6">
						{#if slot.type === 'trait'}
							<!-- TRAIT ACCOUTREMENT SELECTION -->
							{@const available = getAvailableAccoutrements(sid, character.hasRetainer)}
							{@const primaryId = accIds[0]}
							{@const primary = primaryId ? ACCOUTREMENT_MAP.get(primaryId) : undefined}

							{#if available.length > 0}
								<label
									class="font-heading mb-3 block text-xs font-medium tracking-widest text-ink-faint/70 uppercase"
									for="acc-{sid}"
								>
									Choose Accoutrement
								</label>

								<!-- Accoutrement grid buttons -->
								<div class="grid gap-2 sm:grid-cols-2">
									{#each available as acc (acc.id)}
										{@const isSelected = primaryId === acc.id}
										<button
											class="group/acc cursor-pointer rounded-sm border px-3 py-2.5 text-left transition-all duration-200
												{isSelected
												? 'border-gold bg-gold/12 shadow-[0_0_10px_rgba(184,152,68,0.15)]'
												: 'border-parchment-300/40 hover:border-gold-dark/40 hover:bg-gold/5'}"
											onclick={() => character.setAccoutrement(sid, isSelected ? '' : acc.id)}
										>
											<span class="flex items-center gap-1.5">
												<span
													class="font-heading text-sm font-semibold tracking-wide
														{isSelected ? 'text-gold-dark' : 'text-ink group-hover/acc:text-ink'}"
												>
													{acc.label}
												</span>
												{#if acc.specialEffects}
													<span class="tooltip-wrap relative">
														<svg class="h-3.5 w-3.5 shrink-0 text-crimson/50" viewBox="0 0 24 24" fill="currentColor">
															<path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/>
														</svg>
														<span class="tooltip-text">
															{#each acc.specialEffects as effect}
																<span class="block">{effect}</span>
															{/each}
														</span>
													</span>
												{/if}
											</span>

											<!-- Modifier tags -->
											{#if acc.modifiers.length > 0 || acc.conditionalModifiers}
												<div class="mt-1.5 flex flex-wrap gap-1">
													{#each acc.modifiers as mod}
														<span
															class="rounded px-1.5 py-0.5 text-xs font-medium
																{mod.value > 0
																? 'bg-green-800/20 text-green-700'
																: 'bg-red-900/15 text-crimson'}"
														>
															{formatModifier(mod.value)} {TRAIT_MAP.get(mod.target)?.label ?? mod.target}
														</span>
													{/each}
													{#if acc.conditionalModifiers}
														{#each acc.conditionalModifiers as cond}
															<span class="rounded bg-green-800/20 px-1.5 py-0.5 text-xs font-medium text-green-700">
																{cond.description}
															</span>
														{/each}
													{/if}
												</div>
											{/if}

											{#if acc.pointy}
												<span class="mt-1 inline-block text-xs text-ink-faint/40">Pointy</span>
											{/if}

											{#if acc.requires?.retainer}
												<span class="mt-1 inline-block text-xs text-gold-dark/50">Requires retainer</span>
											{/if}

											{#if acc.grantsExtra}
												<span class="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-gold-dark/70">
													<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
														<circle cx="12" cy="12" r="10" />
														<line x1="12" y1="8" x2="12" y2="16" />
														<line x1="8" y1="12" x2="16" y2="12" />
													</svg>
													Grants bonus pick
												</span>
											{/if}
										</button>
									{/each}
								</div>

								<!-- Bonus accoutrement from grantsExtra -->
								{#if primary?.grantsExtra}
									{@const extraOptions = getExtraAccoutrementOptions(primary.id, character.hasRetainer)}
									{@const bonusId = accIds[1]}

									<div class="mt-4 rounded-sm border-2 border-dashed border-gold/30 bg-gold/5 p-4">
										<label
											class="font-heading mb-3 block text-xs font-medium tracking-widest text-gold-dark uppercase"
											for="acc-{sid}-bonus"
										>
											Bonus Accoutrement
											<span class="font-body text-xs font-normal normal-case tracking-normal text-gold-dark/60">
												— granted by {primary.label}
												{#if primary.grantsExtra.excludePointy}
													(non-pointy only)
												{/if}
											</span>
										</label>

										<div class="grid gap-2 sm:grid-cols-2">
											{#each extraOptions as acc (acc.id)}
												{@const isBonusSelected = bonusId === acc.id}
												<button
													class="group/bonus cursor-pointer rounded-sm border px-3 py-2 text-left transition-all duration-200
														{isBonusSelected
														? 'border-gold bg-gold/15 shadow-[0_0_8px_rgba(184,152,68,0.12)]'
														: 'border-gold/20 hover:border-gold/40 hover:bg-gold/8'}"
													onclick={() => character.setAccoutrement(sid, isBonusSelected ? '' : acc.id, 1)}
												>
													<span
														class="font-heading block text-sm font-semibold
															{isBonusSelected ? 'text-gold-dark' : 'text-ink/80'}"
													>
														{acc.label}
													</span>
													<span class="text-xs text-ink-faint/50">
														{TRAIT_MAP.get(acc.slotId)?.label ?? acc.slotId}
													</span>

													{#if acc.modifiers.length > 0}
														<div class="mt-1 flex flex-wrap gap-1">
															{#each acc.modifiers as mod}
																<span
																	class="rounded px-1.5 py-0.5 text-xs font-medium
																		{mod.value > 0
																		? 'bg-green-800/20 text-green-700'
																		: 'bg-red-900/15 text-crimson'}"
																>
																	{formatModifier(mod.value)} {TRAIT_MAP.get(mod.target)?.label ?? mod.target}
																</span>
															{/each}
														</div>
													{/if}
												</button>
											{/each}
										</div>
									</div>
								{/if}
							{:else}
								<p class="text-sm text-ink-faint/50">No accoutrements available for this trait.</p>
							{/if}
						{:else}
							<!-- RETAINER ACCOUTREMENT SELECTION — grouped by trait, toggle to select -->
							{#if retainerDef?.accoutrementTypes}
								{@const available = getRetainerAvailableAccoutrements(retainerDef.accoutrementTypes, character.hasRetainer)}

								{#if available.length > 0}
									{@const groups = groupByTrait(available)}
									{@const pickedSet = new Set(accIds)}
									{@const isFull = accIds.length >= retainerSlotCount}

									<p class="font-heading mb-3 text-xs font-medium tracking-widest text-ink-faint/70 uppercase">
										Choose {retainerSlotCount} accoutrement{retainerSlotCount > 1 ? 's' : ''}
										<span class="font-body normal-case tracking-normal text-ink-faint/50">
											— {accIds.length}/{retainerSlotCount} selected
										</span>
									</p>

									<div class="space-y-4">
										{#each groups as group (group.traitId)}
											<div>
												<div class="mb-1.5 flex items-center gap-2">
													<span class="font-heading text-xs font-medium tracking-wide text-crimson/60">
														{group.traitLabel}
													</span>
													<span class="h-px flex-1 bg-parchment-300/20"></span>
												</div>
												<div class="grid gap-2 sm:grid-cols-2">
													{#each group.items as acc (acc.id)}
														{@const isSelected = pickedSet.has(acc.id)}
														{@const isDisabled = !isSelected && isFull}
														<button
															class="group/racc cursor-pointer rounded-sm border px-3 py-2.5 text-left transition-all duration-200
																{isSelected
																? 'border-gold bg-gold/12 shadow-[0_0_10px_rgba(184,152,68,0.15)]'
																: isDisabled
																	? 'cursor-not-allowed border-parchment-300/20 opacity-40'
																	: 'border-parchment-300/40 hover:border-gold-dark/40 hover:bg-gold/5'}"
															onclick={() => !isDisabled && toggleRetainerAccoutrement(sid, acc.id, retainerSlotCount)}
															disabled={isDisabled}
														>
															<span class="flex items-center gap-1.5">
																<span
																	class="font-heading text-sm font-semibold tracking-wide
																		{isSelected ? 'text-gold-dark' : 'text-ink group-hover/racc:text-ink'}"
																>
																	{acc.label}
																</span>
																{#if acc.specialEffects}
																	<span class="tooltip-wrap relative">
																		<svg class="h-3.5 w-3.5 shrink-0 text-crimson/50" viewBox="0 0 24 24" fill="currentColor">
																			<path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/>
																		</svg>
																		<span class="tooltip-text">
																			{#each acc.specialEffects as effect}
																				<span class="block">{effect}</span>
																			{/each}
																		</span>
																	</span>
																{/if}
															</span>

															{#if acc.modifiers.length > 0 || acc.conditionalModifiers}
																<div class="mt-1.5 flex flex-wrap gap-1">
																	{#each acc.modifiers as mod}
																		<span
																			class="rounded px-1.5 py-0.5 text-xs font-medium
																				{mod.value > 0
																				? 'bg-green-800/20 text-green-700'
																				: 'bg-red-900/15 text-crimson'}"
																		>
																			{formatModifier(mod.value)} {TRAIT_MAP.get(mod.target)?.label ?? mod.target}
																		</span>
																	{/each}
																	{#if acc.conditionalModifiers}
																		{#each acc.conditionalModifiers as cond}
																			<span class="rounded bg-green-800/20 px-1.5 py-0.5 text-xs font-medium text-green-700">
																				{cond.description}
																			</span>
																		{/each}
																	{/if}
																</div>
															{/if}
														</button>
													{/each}
												</div>
											</div>
										{/each}
									</div>
								{:else}
									<p class="text-sm text-ink-faint/50">No accoutrements available for this retainer.</p>
								{/if}
							{/if}
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Continue -->
	<div class="mx-auto mt-10 max-w-lg text-center">
		{#if allFilled}
			<div class="mb-6">
				<span class="font-display text-2xl text-gold/70">&#10033;</span>
				<p class="font-heading mt-1 text-sm tracking-wide text-parchment-300/70">
					Your person is fully outfitted. Onward!
				</p>
			</div>
		{:else}
			<p class="mb-4 text-sm text-parchment-300/50">
				You may continue without outfitting every slot, but each slot is entitled to one free pick.
			</p>
		{/if}
		<button
			class="font-heading cursor-pointer rounded-sm border-2 border-gold bg-gold px-10 py-3 text-lg font-semibold tracking-wider text-realm uppercase transition-all duration-200 hover:bg-gold-light hover:shadow-[0_0_24px_rgba(184,152,68,0.4)]"
			onclick={onadvance}
		>
			Continue
		</button>
	</div>
</div>

<style>
	.tooltip-wrap .tooltip-text {
		visibility: hidden;
		opacity: 0;
		position: absolute;
		bottom: calc(100% + 6px);
		left: 50%;
		transform: translateX(-50%);
		width: max-content;
		max-width: 260px;
		padding: 6px 10px;
		border-radius: 4px;
		background: var(--color-realm);
		border: 1px solid oklch(0.65 0.06 85 / 0.4);
		color: var(--color-parchment-200);
		font-size: 0.75rem;
		line-height: 1.4;
		font-family: var(--font-body);
		pointer-events: none;
		transition: opacity 0.15s, visibility 0.15s;
		z-index: 50;
	}

	.tooltip-wrap:hover .tooltip-text {
		visibility: visible;
		opacity: 1;
	}

	/* Dice roll animation */
	@keyframes dice-tumble {
		0% { transform: rotate(0deg); }
		25% { transform: rotate(90deg); }
		50% { transform: rotate(180deg); }
		75% { transform: rotate(270deg); }
		100% { transform: rotate(360deg); }
	}

	:global(.roll-spinning) {
		animation: dice-tumble 0.32s linear infinite;
	}
</style>
