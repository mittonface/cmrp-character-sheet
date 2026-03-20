<script lang="ts">
	import { createCharacter } from '$lib/character.svelte';
	import { SITUATIONS, TRAIT_MAP, RETAINER_MAP } from '$lib/situations';
	import { getAvailableAccoutrements, ACCOUTREMENT_MAP } from '$lib/accoutrements';
	import { DIE_SIZES, SOCIAL_CLASSES, type CharacterSlot, type DieSize, type SocialClass } from '$lib/types';
	import { formatModifier } from '$lib/modifiers';

	let character = createCharacter();

	function handleSituationChange(e: Event) {
		const select = e.target as HTMLSelectElement;
		character.setSituation(select.value);
	}

	function addTrait(traitId: string) {
		character.addSlot({ type: 'trait', traitId, required: false });
	}

	function addRetainer(retainerId: string) {
		character.addSlot({ type: 'retainer', retainerId, required: false, name: '' });
	}

	function slotLabel(slot: CharacterSlot): string {
		if (slot.type === 'trait') {
			return TRAIT_MAP.get(slot.traitId)?.label ?? slot.traitId;
		}
		return RETAINER_MAP.get(slot.retainerId)?.label ?? slot.retainerId;
	}
</script>

<div class="mx-auto max-w-2xl p-8">
	<h1 class="mb-6 text-3xl font-bold">CMRP Character Sheet</h1>

	<!-- Name -->
	<div class="mb-4">
		<label class="mb-1 block text-sm font-medium" for="name">Character Name</label>
		<input
			id="name"
			type="text"
			bind:value={character.name}
			class="w-full rounded border border-gray-300 px-3 py-2"
			placeholder="Enter character name"
		/>
	</div>

	<!-- Situation -->
	<div class="mb-6">
		<label class="mb-1 block text-sm font-medium" for="situation">Situation</label>
		<select
			id="situation"
			class="w-full rounded border border-gray-300 px-3 py-2"
			value={character.situationId}
			onchange={handleSituationChange}
		>
			<option value="">— Choose a Situation —</option>
			{#each SITUATIONS as situation}
				<option value={situation.id}>{situation.label}</option>
			{/each}
		</select>
	</div>

	{#if character.situationId}
		<!-- Class -->
		{#if character.availableClasses.length > 0}
			<div class="mb-6">
				<label class="mb-1 block text-sm font-medium" for="social-class">Class</label>
				{#if character.availableClasses.length === 1}
					<p class="rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm">
						{character.availableClasses[0].charAt(0).toUpperCase() + character.availableClasses[0].slice(1)}
						<span class="text-xs text-gray-400">(required by situation)</span>
					</p>
				{:else}
					<select
						id="social-class"
						value={character.socialClass}
						onchange={(e) => {
							const select = e.target as HTMLSelectElement;
							character.setSocialClass(select.value as SocialClass | '');
						}}
						class="w-full rounded border border-gray-300 px-3 py-2"
					>
						<option value="">— Choose a Class —</option>
						{#each character.availableClasses as cls}
							<option value={cls}>{cls.charAt(0).toUpperCase() + cls.slice(1)}</option>
						{/each}
					</select>
				{/if}
			</div>
		{/if}

		<!-- Indifferent Trait -->
		{#if character.indifferentTrait}
			{@const traitLabel = TRAIT_MAP.get(character.indifferentTrait)?.label ?? character.indifferentTrait}
			<div class="mb-6">
				<p class="text-sm">
					<span class="font-medium">Indifferent to:</span>
					{traitLabel}
				</p>
			</div>
		{/if}

		<!-- Slots -->
		<div class="mb-6">
			<h2 class="mb-3 text-xl font-semibold">
				Slots ({character.slots.length}/5)
			</h2>

			<!-- Current slots -->
			<div class="mb-4 space-y-2">
				{#each character.slots as slot, i}
					<div class="flex items-center gap-3 rounded border px-3 py-2">
						<span
							class="rounded px-2 py-0.5 text-xs font-medium {slot.type === 'trait'
								? 'bg-blue-100 text-blue-800'
								: 'bg-amber-100 text-amber-800'}"
						>
							{slot.type === 'trait' ? 'Trait' : 'Retainer'}
						</span>
						<span class="font-medium">{slotLabel(slot)}</span>
						{#if slot.type === 'retainer'}
							<input
								type="text"
								bind:value={slot.name}
								class="flex-1 rounded border border-gray-200 px-2 py-1 text-sm"
								placeholder="Name your {slotLabel(slot).toLowerCase()}..."
							/>
						{:else}
							<span class="flex-1"></span>
						{/if}
						{#if slot.required}
							<span class="text-xs text-gray-400">Required</span>
						{:else}
							<button
								class="text-sm text-red-500 hover:text-red-700"
								onclick={() => character.removeSlot(i)}
							>
								Remove
							</button>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Add slots -->
			{#if character.remainingChoices > 0}
				<div class="rounded border border-dashed border-gray-300 p-4">
					<p class="mb-3 text-sm text-gray-600">
						Choose {character.remainingChoices} more {character.remainingChoices === 1
							? 'slot'
							: 'slots'}:
					</p>

					{#if character.pickableTraits.length > 0}
						<div class="mb-3">
							<p class="mb-1 text-xs font-medium text-gray-500">Traits</p>
							<div class="flex flex-wrap gap-2">
								{#each character.pickableTraits as trait}
									<button
										class="rounded bg-blue-50 px-3 py-1 text-sm text-blue-700 hover:bg-blue-100"
										onclick={() => addTrait(trait.id)}
									>
										{trait.label}
									</button>
								{/each}
							</div>
						</div>
					{/if}

					{#if character.pickableRetainers.length > 0}
						<div>
							<p class="mb-1 text-xs font-medium text-gray-500">Retainers</p>
							<div class="flex flex-wrap gap-2">
								{#each character.pickableRetainers as retainer}
									<button
										class="rounded bg-amber-50 px-3 py-1 text-sm text-amber-700 hover:bg-amber-100"
										onclick={() => addRetainer(retainer.id)}
									>
										{retainer.label}
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Trait Values -->
		{#if character.traitSlots.length > 0}
			<div class="mb-6">
				<h2 class="mb-3 text-xl font-semibold">Trait Dice</h2>

				{#if character.dicePool.length > 0}
					<div class="mb-4 rounded border border-indigo-200 bg-indigo-50 px-4 py-3">
						<p class="text-sm text-indigo-800">
							<span class="font-medium">Dice pool:</span>
							{character.dicePool.map((d) => `d${d}`).join(', ')}
							{#if character.traitCount < character.dicePool.length}
								<span class="text-indigo-600">
									— choose {character.traitCount} of {character.dicePool.length}
								</span>
							{/if}
						</p>
						<p class="mt-1 text-xs text-indigo-500">
							Assign one die to each trait, or roll freely.
						</p>
					</div>
				{/if}

				<div class="space-y-2">
					{#each character.traitSlots as slot}
						<div class="flex items-center gap-3">
							<label class="w-48 text-sm font-medium" for="trait-{slot.traitId}">
								{TRAIT_MAP.get(slot.traitId)?.label}
							</label>
							<select
								id="trait-{slot.traitId}"
								value={character.traitValues[slot.traitId] ?? ''}
								onchange={(e) => {
									const select = e.target as HTMLSelectElement;
									character.setTraitValue(slot.traitId, Number(select.value) as DieSize);
								}}
								class="w-24 rounded border border-gray-300 px-2 py-1 text-center"
							>
								<option value="">—</option>
								{#each DIE_SIZES as size}
									<option value={size}>d{size}</option>
								{/each}
							</select>
							{#if character.rollModifiers[slot.traitId]}
								{@const mod = character.rollModifiers[slot.traitId]}
								<span class="text-sm {mod > 0 ? 'text-green-600' : 'text-red-600'}">
									{formatModifier(mod)}
								</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Accoutrements (for required traits) -->
		{#if character.traitSlots.some((s) => character.requiredTraitIds.has(s.traitId))}
			<div class="mb-6">
				<h2 class="mb-3 text-xl font-semibold">Accoutrements</h2>
				<div class="space-y-4">
					{#each character.traitSlots.filter((s) => character.requiredTraitIds.has(s.traitId)) as slot}
						{@const traitLabel = TRAIT_MAP.get(slot.traitId)?.label ?? slot.traitId}
						{@const available = getAvailableAccoutrements(slot.traitId, character.hasRetainer)}
						{@const selectedId = character.accoutrements[slot.traitId]}
						{@const selected = selectedId ? ACCOUTREMENT_MAP.get(selectedId) : undefined}
						<div class="rounded border border-gray-200 p-3">
							<label class="mb-2 block text-sm font-medium" for="acc-{slot.traitId}">
								{traitLabel} Accoutrement
							</label>
							{#if available.length > 0}
								<select
									id="acc-{slot.traitId}"
									value={selectedId ?? ''}
									onchange={(e) => {
										const select = e.target as HTMLSelectElement;
										character.setAccoutrement(slot.traitId, select.value);
									}}
									class="w-full rounded border border-gray-300 px-3 py-2"
								>
									<option value="">— None —</option>
									{#each available as acc}
										<option value={acc.id}>{acc.label}</option>
									{/each}
								</select>

								{#if selected}
									<div class="mt-2 space-y-1">
										{#if selected.modifiers.length > 0}
											<div class="flex flex-wrap gap-2">
												{#each selected.modifiers as mod}
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
										{#if selected.conditionalModifiers}
											{#each selected.conditionalModifiers as cond}
												<p class="text-xs italic text-gray-600">{cond.description}</p>
											{/each}
										{/if}
										{#if selected.specialEffects}
											{#each selected.specialEffects as effect}
												<p class="text-xs font-medium text-purple-700">{effect}</p>
											{/each}
										{/if}
									</div>
								{/if}
							{:else}
								<p class="text-sm text-gray-400">No accoutrements available for this trait.</p>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Debug: serialized state -->
		<details class="mt-8">
			<summary class="cursor-pointer text-sm text-gray-500">Debug: Character Data</summary>
			<pre class="mt-2 overflow-auto rounded bg-gray-100 p-3 text-xs">{JSON.stringify(character.serialize(), null, 2)}</pre>
		</details>
	{/if}
</div>
