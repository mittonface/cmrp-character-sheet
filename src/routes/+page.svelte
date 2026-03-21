<script lang="ts">
	import { createCharacter } from '$lib/character.svelte';
	import { SITUATIONS, TRAIT_MAP, RETAINER_MAP } from '$lib/situations';
	import { getAvailableAccoutrements, getExtraAccoutrementOptions, ACCOUTREMENT_MAP } from '$lib/accoutrements';
	import { CURRENCIES, CURRENCY_LABELS, DIE_SIZES, SOCIAL_CLASSES, DEATH_STATUSES, DEATH_STATUS_LABELS, LOONY_STATUSES, LOONY_STATUS_LABELS, type CharacterSlot, type Currency, type DieSize, type SocialClass } from '$lib/types';
	import { formatModifier } from '$lib/modifiers';
	import { formatDiceExpression } from '$lib/dice';

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

		<!-- Situation Choices (e.g. Muse) -->
		{#each character.situationChoices as choice}
			<div class="mb-6">
				<label class="mb-1 block text-sm font-medium" for="choice-{choice.id}">{choice.label}</label>
				<select
					id="choice-{choice.id}"
					value={character.choiceSelections[choice.id] ?? ''}
					onchange={(e) => {
						const select = e.target as HTMLSelectElement;
						character.setChoice(choice.id, select.value);
					}}
					class="w-full rounded border border-gray-300 px-3 py-2"
				>
					<option value="">— Choose a {choice.label} —</option>
					{#each choice.options as option}
						<option value={option.id}>{option.label}</option>
					{/each}
				</select>
			</div>
		{/each}

		<!-- Death Status -->
		{#if character.deathStatus}
			<div class="mb-6">
				<h2 class="mb-2 text-sm font-medium">Death Status</h2>
				<div class="flex gap-1">
					{#each DEATH_STATUSES as status}
						<button
							class="flex-1 rounded px-2 py-1.5 text-center text-xs font-medium {status === character.deathStatus
								? 'bg-indigo-600 text-white'
								: 'bg-gray-100 text-gray-400 hover:bg-gray-200'}"
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
				<h2 class="mb-2 text-sm font-medium">Loony Status</h2>
				<div class="flex gap-1">
					{#each LOONY_STATUSES as status}
						<button
							class="flex-1 rounded px-2 py-1.5 text-center text-xs font-medium {status === character.loonyStatus
								? 'bg-purple-600 text-white'
								: 'bg-gray-100 text-gray-400 hover:bg-gray-200'}"
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
					<p class="text-sm">
						<span class="font-medium">Indifferent to:</span>
						{character.indifferentTraits.map((id) => TRAIT_MAP.get(id)?.label ?? id).join(', ')}
					</p>
				{:else}
					<h2 class="mb-2 text-sm font-medium">Indifferent Traits</h2>
					{#if character.indifferentTraits.length > 0}
						<div class="mb-2 flex flex-wrap gap-2">
							{#each character.indifferentTraits as traitId}
								<span class="inline-flex items-center gap-1 rounded bg-gray-200 px-2 py-1 text-sm">
									{TRAIT_MAP.get(traitId)?.label ?? traitId}
									<button
										class="text-red-500 hover:text-red-700"
										onclick={() => character.removeIndifferentTrait(traitId)}
									>&times;</button>
								</span>
							{/each}
						</div>
					{/if}
					{#if character.indifferentTraitsNeeded > 0 && character.slotsComplete}
						<div class="rounded border border-dashed border-gray-300 p-3">
							<p class="mb-2 text-sm text-gray-600">
								Choose {character.indifferentTraitsNeeded} trait{character.indifferentTraitsNeeded > 1 ? 's' : ''} to be indifferent to:
							</p>
							<div class="flex flex-wrap gap-2">
								{#each character.pickableIndifferentTraits as trait}
									<button
										class="rounded bg-gray-50 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
										onclick={() => character.addIndifferentTrait(trait.id)}
									>
										{trait.label}
									</button>
								{/each}
							</div>
						</div>
					{:else if !character.slotsComplete && character.indifferentTraitsNeeded > 0}
						<p class="text-xs text-gray-400">Fill all slots first to choose indifferent traits.</p>
					{/if}
				{/if}
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

				{#if character.mustRoll}
				<div class="mb-4 rounded border border-indigo-200 bg-indigo-50 px-4 py-3">
					<p class="text-sm text-indigo-800">
						<span class="font-medium">Roll for each trait.</span>
					</p>
					<p class="mt-1 text-xs text-indigo-500">
						Enter the rolled die size for each trait.
					</p>
				</div>
			{:else if character.dicePool.length > 0}
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

		<!-- Accoutrements (for all filled slots — traits and retainers) -->
		{#if character.slots.length > 0}
			<div class="mb-6">
				<h2 class="mb-3 text-xl font-semibold">Accoutrements</h2>
				<div class="space-y-4">
					{#each character.slots as slot}
						{@const slotId = slot.type === 'trait' ? slot.traitId : slot.retainerId}
						{@const label = slotLabel(slot)}
						{@const available = getAvailableAccoutrements(slotId, character.hasRetainer)}
						{@const accIds = character.accoutrements[slotId] ?? []}
						{@const primaryId = accIds[0]}
						{@const primary = primaryId ? ACCOUTREMENT_MAP.get(primaryId) : undefined}
						<div class="rounded border border-gray-200 p-3">
							<label class="mb-2 block text-sm font-medium" for="acc-{slotId}">
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
									class="w-full rounded border border-gray-300 px-3 py-2"
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
												<p class="text-xs italic text-gray-600">{cond.description}</p>
											{/each}
										{/if}
										{#if accDef.specialEffects}
											{#each accDef.specialEffects as effect}
												<p class="text-xs font-medium text-purple-700">{effect}</p>
											{/each}
										{/if}
									</div>

									<!-- Bonus accoutrement slot (e.g. from Cloth Sack) -->
									{#if accDef.grantsExtra}
										{@const extraOptions = getExtraAccoutrementOptions(accDef.id, character.hasRetainer)}
										{@const bonusId = accIds[1]}
										{@const bonus = bonusId ? ACCOUTREMENT_MAP.get(bonusId) : undefined}
										<div class="mt-3 rounded border border-dashed border-purple-300 bg-purple-50 p-2">
											<label class="mb-1 block text-xs font-medium text-purple-700" for="acc-{slotId}-bonus">
												Bonus Accoutrement (from {accDef.label})
											</label>
											<select
												id="acc-{slotId}-bonus"
												value={bonusId ?? ''}
												onchange={(e) => {
													const select = e.target as HTMLSelectElement;
													character.setAccoutrement(slotId, select.value, 1);
												}}
												class="w-full rounded border border-purple-300 px-3 py-2 text-sm"
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
															<p class="text-xs italic text-gray-600">{cond.description}</p>
														{/each}
													{/if}
													{#if bonus.specialEffects}
														{#each bonus.specialEffects as effect}
															<p class="text-xs font-medium text-purple-700">{effect}</p>
														{/each}
													{/if}
												</div>
											{/if}
										</div>
									{/if}
								{/if}
							{:else}
								<p class="text-sm text-gray-400">No accoutrements available for this slot.</p>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Currencies -->
		<div class="mb-6">
			<h2 class="mb-3 text-xl font-semibold">Currencies</h2>
			<div class="grid grid-cols-2 gap-2">
				{#each CURRENCIES as currency}
					{@const isStarting = character.startingCurrency?.currency === currency}
					<div class="flex items-center gap-2 rounded px-1 py-0.5" class:bg-amber-100={isStarting} class:ring-1={isStarting} class:ring-amber-400={isStarting}>
						<label class="w-48 text-sm font-medium" class:text-amber-800={isStarting} for="currency-{currency}">
							{CURRENCY_LABELS[currency]}
							{#if isStarting && character.startingCurrency}
								<span class="text-xs text-amber-600">(roll {formatDiceExpression(character.startingCurrency.roll)})</span>
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
							class="w-20 rounded border px-2 py-1 text-center"
							class:border-amber-400={isStarting}
							class:border-gray-300={!isStarting}
						/>
					</div>
				{/each}
			</div>
		</div>

		<!-- Debug: serialized state -->
		<details class="mt-8">
			<summary class="cursor-pointer text-sm text-gray-500">Debug: Character Data</summary>
			<pre class="mt-2 overflow-auto rounded bg-gray-100 p-3 text-xs">{JSON.stringify(character.serialize(), null, 2)}</pre>
		</details>
	{/if}
</div>
