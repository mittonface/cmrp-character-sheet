<script lang="ts">
	import { createCharacter } from '$lib/character.svelte';
	import { TRAIT_MAP, RETAINER_MAP } from '$lib/situations';
	import {
		getAvailableAccoutrements,
		getRetainerAvailableAccoutrements,
		getExtraAccoutrementOptions,
		ACCOUTREMENT_MAP
	} from '$lib/accoutrements';
	import {
		CURRENCIES,
		CURRENCY_LABELS,
		DIE_SIZES,
		DEATH_STATUSES,
		DEATH_STATUS_LABELS,
		LOONY_STATUSES,
		LOONY_STATUS_LABELS,
		type CharacterSlot,
		type Currency,
		type DieSize
	} from '$lib/types';
	import { formatModifier } from '$lib/modifiers';
	import { formatDiceExpression } from '$lib/dice';
	import { loadCharacter, saveCharacter, clearSavedCharacter } from '$lib/persistence';
	import SituationStep from '$lib/components/wizard/SituationStep.svelte';
	import ClassStep from '$lib/components/wizard/ClassStep.svelte';
	import SlotsStep from '$lib/components/wizard/SlotsStep.svelte';
	import WizardBreadcrumbs from '$lib/components/wizard/WizardBreadcrumbs.svelte';

	let character = $state(createCharacter(loadCharacter()));

	// Auto-save to localStorage whenever character state changes
	$effect(() => {
		saveCharacter(character.serialize());
	});

	type WizardStep = 'situation' | 'class' | 'slots' | 'rest';
	const initialData = loadCharacter();
	let currentStep = $state<WizardStep>(
		initialData?.situation
			? initialData.socialClass
				? initialData.slots && initialData.slots.length === 5
					? 'rest'
					: 'slots'
				: 'class'
			: 'situation'
	);

	function advanceFromSituation() {
		// If only one class, it's auto-set — skip to class step anyway so they see their station
		currentStep = 'class';
	}

	function advanceFromClass() {
		currentStep = 'slots';
	}

	function advanceFromSlots() {
		currentStep = 'rest';
	}

	function navigateTo(stepId: string) {
		currentStep = stepId as WizardStep;
	}

	function startOver() {
		clearSavedCharacter();
		character = createCharacter();
		currentStep = 'situation';
	}

	function slotLabel(slot: CharacterSlot): string {
		if (slot.type === 'trait') {
			return TRAIT_MAP.get(slot.traitId)?.label ?? slot.traitId;
		}
		return RETAINER_MAP.get(slot.retainerId)?.label ?? slot.retainerId;
	}
</script>

<WizardBreadcrumbs current={currentStep} onnavigate={navigateTo} onstartover={startOver} />

{#if currentStep === 'situation'}
	<div class="min-h-dvh py-12">
		<SituationStep {character} onadvance={advanceFromSituation} />
	</div>
{:else if currentStep === 'class'}
	<div class="min-h-dvh py-12">
		<ClassStep {character} onadvance={advanceFromClass} />
	</div>
{:else if currentStep === 'slots'}
	<div class="min-h-dvh py-12">
		<SlotsStep {character} onadvance={advanceFromSlots} />
	</div>
{:else}
	<!-- Existing character sheet (rest of steps — will be wizardified incrementally) -->
	<div class="parchment-bg mx-auto min-h-dvh max-w-2xl p-8">

		<h1 class="font-display mb-6 text-3xl font-bold text-crimson">CMRP Character Sheet</h1>

		<!-- Name -->
		<div class="mb-4">
			<label class="font-heading mb-1 block text-sm font-medium text-ink" for="name">Character Name</label>
			<input
				id="name"
				type="text"
				bind:value={character.name}
				class="w-full rounded border border-parchment-300 bg-parchment-50 px-3 py-2 font-body text-ink placeholder:text-ink-faint/50 focus:border-gold focus:outline-none"
				placeholder="Enter character name"
			/>
		</div>

		{#if character.situationId}
			<!-- Death Status -->
			{#if character.deathStatus}
				<div class="mb-6">
					<h2 class="font-heading mb-2 text-sm font-medium text-ink">Death Status</h2>
					<div class="flex gap-1">
						{#each DEATH_STATUSES as status}
							<button
								class="flex-1 cursor-pointer rounded px-2 py-1.5 text-center text-xs font-medium transition-colors {status === character.deathStatus
									? 'bg-crimson text-parchment-50'
									: 'bg-parchment-200/50 text-ink-faint hover:bg-parchment-200'}"
								onclick={() => character.setDeathStatus(status)}
							>
								{DEATH_STATUS_LABELS[status]}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Loony Status -->
			{#if character.loonyStatus}
				<div class="mb-6">
					<h2 class="font-heading mb-2 text-sm font-medium text-ink">Loony Status</h2>
					<div class="flex gap-1">
						{#each LOONY_STATUSES as status}
							<button
								class="flex-1 cursor-pointer rounded px-2 py-1.5 text-center text-xs font-medium transition-colors {status === character.loonyStatus
									? 'bg-crimson-dark text-parchment-50'
									: 'bg-parchment-200/50 text-ink-faint hover:bg-parchment-200'}"
								onclick={() => character.setLoonyStatus(status)}
							>
								{LOONY_STATUS_LABELS[status]}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Indifferent Traits -->
			{#if character.indifferentTraitsDef}
				<div class="mb-6">
					{#if character.indifferentTraitsDef.type === 'fixed'}
						<p class="text-sm text-ink">
							<span class="font-heading font-medium">Indifferent to:</span>
							{character.indifferentTraits.map((id) => TRAIT_MAP.get(id)?.label ?? id).join(', ')}
						</p>
					{:else}
						<h2 class="font-heading mb-2 text-sm font-medium text-ink">Indifferent Traits</h2>
						{#if character.indifferentTraits.length > 0}
							<div class="mb-2 flex flex-wrap gap-2">
								{#each character.indifferentTraits as traitId}
									<span class="inline-flex items-center gap-1 rounded bg-parchment-200 px-2 py-1 text-sm text-ink">
										{TRAIT_MAP.get(traitId)?.label ?? traitId}
										<button
											class="cursor-pointer text-crimson hover:text-crimson-light"
											onclick={() => character.removeIndifferentTrait(traitId)}
										>&times;</button>
									</span>
								{/each}
							</div>
						{/if}
						{#if character.indifferentTraitsNeeded > 0 && character.slotsComplete}
							<div class="rounded border border-dashed border-parchment-300 p-3">
								<p class="mb-2 text-sm text-ink-faint">
									Choose {character.indifferentTraitsNeeded} trait{character.indifferentTraitsNeeded > 1 ? 's' : ''} to be indifferent to:
								</p>
								<div class="flex flex-wrap gap-2">
									{#each character.pickableIndifferentTraits as trait}
										<button
											class="cursor-pointer rounded bg-parchment-50 px-3 py-1 text-sm text-ink-light hover:bg-parchment-200"
											onclick={() => character.addIndifferentTrait(trait.id)}
										>
											{trait.label}
										</button>
									{/each}
								</div>
							</div>
						{:else if !character.slotsComplete && character.indifferentTraitsNeeded > 0}
							<p class="text-xs text-ink-faint">Fill all slots first to choose indifferent traits.</p>
						{/if}
					{/if}
				</div>
			{/if}

			<!-- Trait Values -->
			{#if character.traitSlots.length > 0}
				<div class="mb-6">
					<h2 class="font-heading mb-3 text-xl font-semibold text-ink">Trait Dice</h2>

					{#if character.mustRoll}
						<div class="mb-4 rounded border border-crimson/20 bg-crimson/5 px-4 py-3">
							<p class="text-sm text-crimson">
								<span class="font-heading font-medium">Roll for each trait.</span>
							</p>
							<p class="mt-1 text-xs text-crimson/70">
								Enter the rolled die size for each trait.
							</p>
						</div>
					{:else if character.dicePool.length > 0}
						<div class="mb-4 rounded border border-gold/30 bg-gold/8 px-4 py-3">
							<p class="text-sm text-ink">
								<span class="font-heading font-medium">Dice pool:</span>
								{character.dicePool.map((d) => `d${d}`).join(', ')}
								{#if character.traitCount < character.dicePool.length}
									<span class="text-gold-dark">
										— choose {character.traitCount} of {character.dicePool.length}
									</span>
								{/if}
							</p>
							<p class="mt-1 text-xs text-ink-faint">
								Assign one die to each trait, or roll freely.
							</p>
						</div>
					{/if}

					<div class="space-y-2">
						{#each character.traitSlots as slot}
							<div class="flex items-center gap-3">
								<label class="font-heading w-48 text-sm font-medium text-ink" for="trait-{slot.traitId}">
									{TRAIT_MAP.get(slot.traitId)?.label}
								</label>
								<select
									id="trait-{slot.traitId}"
									value={character.traitValues[slot.traitId] ?? ''}
									onchange={(e) => {
										const select = e.target as HTMLSelectElement;
										character.setTraitValue(slot.traitId, Number(select.value) as DieSize);
									}}
									class="w-24 rounded border border-parchment-300 bg-parchment-50 px-2 py-1 text-center font-body text-ink focus:border-gold focus:outline-none"
								>
									<option value="">—</option>
									{#each DIE_SIZES as size}
										<option value={size}>d{size}</option>
									{/each}
								</select>
								{#if character.rollModifiers[slot.traitId]}
									{@const mod = character.rollModifiers[slot.traitId]}
									<span class="text-sm {mod > 0 ? 'text-green-700' : 'text-crimson'}">
										{formatModifier(mod)}
									</span>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Accoutrements -->
			{#if character.slots.length > 0}
				<div class="mb-6">
					<h2 class="font-heading mb-3 text-xl font-semibold text-ink">Accoutrements</h2>
					<div class="space-y-4">
						{#each character.slots as slot}
							{@const slotId = slot.type === 'trait' ? slot.traitId : slot.retainerId}
							{@const label = slotLabel(slot)}
							{@const accIds = character.accoutrements[slotId] ?? []}
							<div class="rounded border border-parchment-300 bg-parchment-50 p-3">
								{#if slot.type === 'trait'}
									{@const available = getAvailableAccoutrements(slotId, character.hasRetainer)}
									{@const primaryId = accIds[0]}
									{@const primary = primaryId ? ACCOUTREMENT_MAP.get(primaryId) : undefined}
									<label class="font-heading mb-2 block text-sm font-medium text-ink" for="acc-{slotId}">
										{label} Accoutrement
									</label>
									{#if available.length > 0}
										<select
											id="acc-{slotId}"
											value={primaryId ?? ''}
											onchange={(e) => {
												const select = e.target as HTMLSelectElement;
												character.setAccoutrement(slotId, select.value);
											}}
											class="w-full rounded border border-parchment-300 bg-parchment-50 px-3 py-2 font-body text-ink focus:border-gold focus:outline-none"
										>
											<option value="">— None —</option>
											{#each available as acc}
												<option value={acc.id}>{acc.label}</option>
											{/each}
										</select>

										{#if primary}
											{@const accDef = primary}
											<div class="mt-2 space-y-1">
												{#if accDef.modifiers.length > 0}
													<div class="flex flex-wrap gap-2">
														{#each accDef.modifiers as mod}
															<span
																class="rounded px-2 py-0.5 text-xs font-medium {mod.value > 0
																	? 'bg-green-100 text-green-800'
																	: 'bg-red-100 text-red-800'}"
															>
																{formatModifier(mod.value)} {TRAIT_MAP.get(mod.target)?.label ?? mod.target}
															</span>
														{/each}
													</div>
												{/if}
												{#if accDef.conditionalModifiers}
													{#each accDef.conditionalModifiers as cond}
														<p class="text-xs italic text-ink-faint">{cond.description}</p>
													{/each}
												{/if}
												{#if accDef.specialEffects}
													{#each accDef.specialEffects as effect}
														<p class="text-xs font-medium text-crimson">{effect}</p>
													{/each}
												{/if}
											</div>

											{#if accDef.grantsExtra}
												{@const extraOptions = getExtraAccoutrementOptions(accDef.id, character.hasRetainer)}
												{@const bonusId = accIds[1]}
												{@const bonus = bonusId ? ACCOUTREMENT_MAP.get(bonusId) : undefined}
												<div class="mt-3 rounded border border-dashed border-gold/40 bg-gold/5 p-2">
													<label class="font-heading mb-1 block text-xs font-medium text-gold-dark" for="acc-{slotId}-bonus">
														Bonus Accoutrement (from {accDef.label})
													</label>
													<select
														id="acc-{slotId}-bonus"
														value={bonusId ?? ''}
														onchange={(e) => {
															const select = e.target as HTMLSelectElement;
															character.setAccoutrement(slotId, select.value, 1);
														}}
														class="w-full rounded border border-gold/30 bg-parchment-50 px-3 py-2 text-sm font-body text-ink focus:border-gold focus:outline-none"
													>
														<option value="">— None —</option>
														{#each extraOptions as acc}
															<option value={acc.id}>{acc.label} ({acc.slotId})</option>
														{/each}
													</select>

													{#if bonus}
														<div class="mt-1 space-y-1">
															{#if bonus.modifiers.length > 0}
																<div class="flex flex-wrap gap-2">
																	{#each bonus.modifiers as mod}
																		<span
																			class="rounded px-2 py-0.5 text-xs font-medium {mod.value > 0
																				? 'bg-green-100 text-green-800'
																				: 'bg-red-100 text-red-800'}"
																		>
																			{formatModifier(mod.value)} {TRAIT_MAP.get(mod.target)?.label ?? mod.target}
																		</span>
																	{/each}
																</div>
															{/if}
															{#if bonus.conditionalModifiers}
																{#each bonus.conditionalModifiers as cond}
																	<p class="text-xs italic text-ink-faint">{cond.description}</p>
																{/each}
															{/if}
															{#if bonus.specialEffects}
																{#each bonus.specialEffects as effect}
																	<p class="text-xs font-medium text-crimson">{effect}</p>
																{/each}
															{/if}
														</div>
													{/if}
												</div>
											{/if}
										{/if}
									{:else}
										<p class="text-sm text-ink-faint">No accoutrements available for this slot.</p>
									{/if}
								{:else}
									{@const retainerDef = RETAINER_MAP.get(slot.retainerId)}
									{@const retainerSlotCount = retainerDef?.accoutrementSlots ?? 0}
									<p class="font-heading mb-2 text-sm font-medium text-ink">
										{label} Accoutrements
										{#if retainerSlotCount > 0}
											<span class="text-xs text-ink-faint">({accIds.length}/{retainerSlotCount})</span>
										{/if}
									</p>
									{#if retainerSlotCount === 0}
										<p class="text-sm text-ink-faint">This retainer cannot carry accoutrements.</p>
									{:else if retainerDef?.accoutrementTypes}
										{@const available = getRetainerAvailableAccoutrements(retainerDef.accoutrementTypes, character.hasRetainer)}
										{#if available.length > 0}
											<div class="space-y-3">
												{#each { length: retainerSlotCount } as _, pickIndex}
													{@const pickId = accIds[pickIndex]}
													{@const pickDef = pickId ? ACCOUTREMENT_MAP.get(pickId) : undefined}
													{@const alreadyPicked = new Set(accIds.filter((_, j) => j !== pickIndex))}
													<div>
														<select
															id="acc-{slotId}-{pickIndex}"
															value={pickId ?? ''}
															onchange={(e) => {
																const select = e.target as HTMLSelectElement;
																character.setAccoutrement(slotId, select.value, pickIndex);
															}}
															class="w-full rounded border border-parchment-300 bg-parchment-50 px-3 py-2 font-body text-ink focus:border-gold focus:outline-none"
														>
															<option value="">— None —</option>
															{#each available.filter((a) => !alreadyPicked.has(a.id)) as acc}
																<option value={acc.id}>
																	{acc.label}
																	({TRAIT_MAP.get(acc.slotId)?.label ?? acc.slotId})
																</option>
															{/each}
														</select>

														{#if pickDef}
															<div class="mt-1 space-y-1">
																{#if pickDef.modifiers.length > 0}
																	<div class="flex flex-wrap gap-2">
																		{#each pickDef.modifiers as mod}
																			<span
																				class="rounded px-2 py-0.5 text-xs font-medium {mod.value > 0
																					? 'bg-green-100 text-green-800'
																					: 'bg-red-100 text-red-800'}"
																			>
																				{formatModifier(mod.value)} {TRAIT_MAP.get(mod.target)?.label ?? mod.target}
																			</span>
																		{/each}
																	</div>
																{/if}
																{#if pickDef.conditionalModifiers}
																	{#each pickDef.conditionalModifiers as cond}
																		<p class="text-xs italic text-ink-faint">{cond.description}</p>
																	{/each}
																{/if}
																{#if pickDef.specialEffects}
																	{#each pickDef.specialEffects as effect}
																		<p class="text-xs font-medium text-crimson">{effect}</p>
																	{/each}
																{/if}
															</div>
														{/if}
													</div>
												{/each}
											</div>
										{:else}
											<p class="text-sm text-ink-faint">No accoutrements available for this retainer.</p>
										{/if}
									{/if}
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Currencies -->
			<div class="mb-6">
				<h2 class="font-heading mb-3 text-xl font-semibold text-ink">Currencies</h2>
				<div class="grid grid-cols-2 gap-2">
					{#each CURRENCIES as currency}
						{@const isStarting = character.startingCurrency?.currency === currency}
						<div class="flex items-center gap-2 rounded px-1 py-0.5 {isStarting ? 'bg-gold/15 ring-1 ring-gold/40' : ''}">
							<label class="w-48 text-sm font-medium {isStarting ? 'text-gold-dark' : 'text-ink'}" for="currency-{currency}">
								{CURRENCY_LABELS[currency]}
								{#if isStarting && character.startingCurrency}
									<span class="text-xs text-gold-dark/70">(roll {formatDiceExpression(character.startingCurrency.roll)})</span>
								{/if}
							</label>
							<input
								id="currency-{currency}"
								type="number"
								min="0"
								value={character.currencies[currency] ?? 0}
								onchange={(e) => {
									const input = e.target as HTMLInputElement;
									character.setCurrency(currency, Math.max(0, parseInt(input.value) || 0));
								}}
								class="w-20 rounded border bg-parchment-50 px-2 py-1 text-center font-body text-ink focus:border-gold focus:outline-none {isStarting ? 'border-gold/40' : 'border-parchment-300'}"
							/>
						</div>
					{/each}
				</div>
			</div>

			<!-- Debug -->
			<details class="mt-8">
				<summary class="font-heading cursor-pointer text-sm text-ink-faint">Debug: Character Data</summary>
				<pre class="mt-2 overflow-auto rounded bg-parchment-200/50 p-3 text-xs text-ink">{JSON.stringify(character.serialize(), null, 2)}</pre>
			</details>
		{/if}
	</div>
{/if}
