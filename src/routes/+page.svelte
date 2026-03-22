<script lang="ts">
  import { createCharacter } from '$lib/character.svelte';
  import { TRAIT_MAP } from '$lib/situations';
  import {
    CURRENCIES,
    CURRENCY_LABELS,
    DIE_SIZES,
    DEATH_STATUSES,
    DEATH_STATUS_LABELS,
    LOONY_STATUSES,
    LOONY_STATUS_LABELS,
    type Currency,
    type DieSize,
  } from '$lib/types';
  import { formatModifier } from '$lib/modifiers';
  import { formatDiceExpression } from '$lib/dice';
  import {
    loadCharacter,
    saveCharacter,
    clearSavedCharacter,
  } from '$lib/persistence';
  import SituationStep from '$lib/components/wizard/SituationStep.svelte';
  import ClassStep from '$lib/components/wizard/ClassStep.svelte';
  import SlotsStep from '$lib/components/wizard/SlotsStep.svelte';
  import AccoutrementStep from '$lib/components/wizard/AccoutrementStep.svelte';
  import WizardBreadcrumbs from '$lib/components/wizard/WizardBreadcrumbs.svelte';

  let character = $state(createCharacter(loadCharacter()));

  // Auto-save to localStorage whenever character state changes
  $effect(() => {
    saveCharacter(character.serialize());
  });

  type WizardStep = 'situation' | 'class' | 'slots' | 'accoutrements' | 'rest';
  const initialData = loadCharacter();
  let currentStep = $state<WizardStep>(
    initialData?.situation
      ? initialData.socialClass
        ? initialData.slots && initialData.slots.length === 5
          ? initialData.accoutrements &&
            Object.keys(initialData.accoutrements).length > 0
            ? 'rest'
            : 'accoutrements'
          : 'slots'
        : 'class'
      : 'situation',
  );

  function advanceFromSituation() {
    // If only one class, it's auto-set — skip to class step anyway so they see their station
    currentStep = 'class';
  }

  function advanceFromClass() {
    currentStep = 'slots';
  }

  function advanceFromSlots() {
    currentStep = 'accoutrements';
  }

  function advanceFromAccoutrements() {
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
</script>

<WizardBreadcrumbs
  current={currentStep}
  onnavigate={navigateTo}
  onstartover={startOver}
/>

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
{:else if currentStep === 'accoutrements'}
  <div class="min-h-dvh py-12">
    <AccoutrementStep {character} onadvance={advanceFromAccoutrements} />
  </div>
{:else}
  <!-- Existing character sheet (rest of steps — will be wizardified incrementally) -->
  <div class="parchment-bg mx-auto min-h-dvh max-w-2xl p-8">
    <h1 class="font-display mb-6 text-3xl font-bold text-crimson">
      CMRP Character Sheet
    </h1>

    <!-- Name -->
    <div class="mb-4">
      <label
        class="font-heading mb-1 block text-sm font-medium text-ink"
        for="name">Character Name</label
      >
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
          <h2 class="font-heading mb-2 text-sm font-medium text-ink">
            Death Status
          </h2>
          <div class="flex gap-1">
            {#each DEATH_STATUSES as status}
              <button
                class="flex-1 cursor-pointer rounded px-2 py-1.5 text-center text-xs font-medium transition-colors {status ===
                character.deathStatus
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
          <h2 class="font-heading mb-2 text-sm font-medium text-ink">
            Loony Status
          </h2>
          <div class="flex gap-1">
            {#each LOONY_STATUSES as status}
              <button
                class="flex-1 cursor-pointer rounded px-2 py-1.5 text-center text-xs font-medium transition-colors {status ===
                character.loonyStatus
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
              {character.indifferentTraits
                .map((id) => TRAIT_MAP.get(id)?.label ?? id)
                .join(', ')}
            </p>
          {:else}
            <h2 class="font-heading mb-2 text-sm font-medium text-ink">
              Indifferent Traits
            </h2>
            {#if character.indifferentTraits.length > 0}
              <div class="mb-2 flex flex-wrap gap-2">
                {#each character.indifferentTraits as traitId}
                  <span
                    class="inline-flex items-center gap-1 rounded bg-parchment-200 px-2 py-1 text-sm text-ink"
                  >
                    {TRAIT_MAP.get(traitId)?.label ?? traitId}
                    <button
                      class="cursor-pointer text-crimson hover:text-crimson-light"
                      onclick={() => character.removeIndifferentTrait(traitId)}
                      >&times;</button
                    >
                  </span>
                {/each}
              </div>
            {/if}
            {#if character.indifferentTraitsNeeded > 0 && character.slotsComplete}
              <div
                class="rounded border border-dashed border-parchment-300 p-3"
              >
                <p class="mb-2 text-sm text-ink-faint">
                  Choose {character.indifferentTraitsNeeded} trait{character.indifferentTraitsNeeded >
                  1
                    ? 's'
                    : ''} to be indifferent to:
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
              <p class="text-xs text-ink-faint">
                Fill all slots first to choose indifferent traits.
              </p>
            {/if}
          {/if}
        </div>
      {/if}

      <!-- Trait Values -->
      {#if character.traitSlots.length > 0}
        <div class="mb-6">
          <h2 class="font-heading mb-3 text-xl font-semibold text-ink">
            Trait Dice
          </h2>

          {#if character.mustRoll}
            <div
              class="mb-4 rounded border border-crimson/20 bg-crimson/5 px-4 py-3"
            >
              <p class="text-sm text-crimson">
                <span class="font-heading font-medium"
                  >Roll for each trait.</span
                >
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
                    — choose {character.traitCount} of {character.dicePool
                      .length}
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
                <label
                  class="font-heading w-48 text-sm font-medium text-ink"
                  for="trait-{slot.traitId}"
                >
                  {TRAIT_MAP.get(slot.traitId)?.label}
                </label>
                <select
                  id="trait-{slot.traitId}"
                  value={character.traitValues[slot.traitId] ?? ''}
                  onchange={(e) => {
                    const select = e.target as HTMLSelectElement;
                    character.setTraitValue(
                      slot.traitId,
                      Number(select.value) as DieSize,
                    );
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
                  <span
                    class="text-sm {mod > 0
                      ? 'text-green-700'
                      : 'text-crimson'}"
                  >
                    {formatModifier(mod)}
                  </span>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Currencies -->
      <div class="mb-6">
        <h2 class="font-heading mb-3 text-xl font-semibold text-ink">
          Currencies
        </h2>
        <div class="grid grid-cols-2 gap-2">
          {#each CURRENCIES as currency}
            {@const isStarting =
              character.startingCurrency?.currency === currency}
            <div
              class="flex items-center gap-2 rounded px-1 py-0.5 {isStarting
                ? 'bg-gold/15 ring-1 ring-gold/40'
                : ''}"
            >
              <label
                class="w-48 text-sm font-medium {isStarting
                  ? 'text-gold-dark'
                  : 'text-ink'}"
                for="currency-{currency}"
              >
                {CURRENCY_LABELS[currency]}
                {#if isStarting && character.startingCurrency}
                  <span class="text-xs text-gold-dark/70"
                    >(roll {formatDiceExpression(
                      character.startingCurrency.roll,
                    )})</span
                  >
                {/if}
              </label>
              <input
                id="currency-{currency}"
                type="number"
                min="0"
                value={character.currencies[currency] ?? 0}
                onchange={(e) => {
                  const input = e.target as HTMLInputElement;
                  character.setCurrency(
                    currency,
                    Math.max(0, parseInt(input.value) || 0),
                  );
                }}
                class="w-20 rounded border bg-parchment-50 px-2 py-1 text-center font-body text-ink focus:border-gold focus:outline-none {isStarting
                  ? 'border-gold/40'
                  : 'border-parchment-300'}"
              />
            </div>
          {/each}
        </div>
      </div>

      <!-- Debug -->
      <details class="mt-8">
        <summary class="font-heading cursor-pointer text-sm text-ink-faint"
          >Debug: Character Data</summary
        >
        <pre
          class="mt-2 overflow-auto rounded bg-parchment-200/50 p-3 text-xs text-ink">{JSON.stringify(
            character.serialize(),
            null,
            2,
          )}</pre>
      </details>
    {/if}
  </div>
{/if}
