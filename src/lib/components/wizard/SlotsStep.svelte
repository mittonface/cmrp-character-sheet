<script lang="ts">
  import { SITUATION_MAP, TRAIT_MAP, RETAINER_MAP } from '$lib/situations';
  import type { createCharacter } from '$lib/character.svelte';
  import type { CharacterSlot } from '$lib/types';
  import TraitTooltip from '$lib/components/TraitTooltip.svelte';

  type Character = ReturnType<typeof createCharacter>;

  let {
    character,
    onadvance,
  }: { character: Character; onadvance: () => void } = $props();

  let situation = $derived(SITUATION_MAP.get(character.situationId));

  const SLOT_NUMERALS = ['I', 'II', 'III', 'IV', 'V'];

  function slotLabel(slot: CharacterSlot): string {
    if (slot.type === 'trait') {
      return TRAIT_MAP.get(slot.traitId)?.label ?? slot.traitId;
    }
    return RETAINER_MAP.get(slot.retainerId)?.label ?? slot.retainerId;
  }

  function addTrait(traitId: string) {
    character.addSlot({ type: 'trait', traitId, required: false });
  }

  function addRetainer(retainerId: string) {
    character.addSlot({
      type: 'retainer',
      retainerId,
      required: false,
      name: '',
    });
  }

  /** Which slot index is being hovered for the "drop" preview */
  let hoveredPickable = $state<string | null>(null);

  // --- Indifferent trait rolling ---
  let rollingIndifferent = $state(false);

  /** Randomly select indifferent traits with a cycling animation */
  function rollIndifferentTraits() {
    const def = character.indifferentTraitsDef;
    if (!def || def.type !== 'select') return;

    rollingIndifferent = true;

    // Clear existing selections first
    for (const id of [...character.indifferentTraits]) {
      character.removeIndifferentTrait(id);
    }

    const steps = 5 + Math.floor(Math.random() * 3);
    let step = 0;

    const interval = setInterval(() => {
      // Clear previous cycle's picks
      for (const id of [...character.indifferentTraits]) {
        character.removeIndifferentTrait(id);
      }

      // Pick N random traits from the full pickable pool
      const pool = character.pickableIndifferentTraits;
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const count = Math.min(def.count, shuffled.length);
      for (let i = 0; i < count; i++) {
        character.addIndifferentTrait(shuffled[i].id);
      }

      step++;
      if (step >= steps) {
        clearInterval(interval);
        rollingIndifferent = false;
      }
    }, 100);
  }
</script>

<div class="mx-auto max-w-4xl px-4">
  <!-- Header -->
  <div class="mb-10 text-center">
    <h1
      class="font-display mb-3 text-4xl font-bold tracking-wide text-gold-light md:text-5xl"
    >
      CMRP
    </h1>
    <p
      class="font-heading text-lg tracking-widest text-parchment-300 uppercase"
    >
      Character Creation
    </p>
    <div class="mx-auto mt-4 flex items-center justify-center gap-3">
      <span class="h-px flex-1 max-w-16 bg-gold-dark/40"></span>
      <span class="font-heading text-sm tracking-widest text-gold/60"
        >III. Fill Your Ledger</span
      >
      <span class="h-px flex-1 max-w-16 bg-gold-dark/40"></span>
    </div>
  </div>

  <!-- Situation context -->
  {#if situation}
    <p class="mb-8 text-center text-parchment-300">
      As a <span class="font-heading font-semibold text-crimson"
        >{situation.label}</span
      >,
      {#if character.freeSlotCount === 0}
        your five slots are prescribed by tradition.
      {:else}
        {5 - character.freeSlotCount} of your five slots are prescribed — choose
        {character.freeSlotCount} more to complete your ledger.
      {/if}
    </p>
  {/if}

  <!-- Situation Choices (e.g. Muse) — must be made before slot selection -->
  {#if character.situationChoices.length > 0}
    <div class="mx-auto mb-10 max-w-lg">
      {#each character.situationChoices as choice}
        {@const selectedId = character.choiceSelections[choice.id] ?? ''}
        <div
          class="parchment-bg rounded-sm border-2 p-5 transition-colors duration-300
					{selectedId
            ? 'border-gold/50'
            : 'border-crimson/40 shadow-[0_0_16px_rgba(122,26,26,0.15)]'}"
        >
          <label
            class="font-heading mb-3 block text-center text-lg font-semibold tracking-wide text-crimson"
            for="choice-{choice.id}"
          >
            Choose Your {choice.label}
          </label>
          <div class="grid gap-2 sm:grid-cols-3">
            {#each choice.options as option}
              {@const isChosen = selectedId === option.id}
              <button
                class="group cursor-pointer rounded-sm border px-3 py-2 text-center transition-all duration-200
									{isChosen
                  ? 'border-gold bg-gold/12 shadow-[0_0_10px_rgba(184,152,68,0.2)]'
                  : 'border-parchment-300/50 hover:border-gold-dark/50 hover:bg-gold/5'}"
                onclick={() => character.setChoice(choice.id, option.id)}
              >
                <span
                  class="font-heading text-sm font-semibold {isChosen
                    ? 'text-gold-dark'
                    : 'text-ink-light group-hover:text-ink'}"
                >
                  {option.label}
                </span>
                {#if option.requiredTraits && option.requiredTraits.length > 0}
                  <span class="mt-0.5 block text-xs text-ink-faint">
                    +{option.requiredTraits
                      .map((id) => TRAIT_MAP.get(id)?.label ?? id)
                      .join(', ')}
                  </span>
                {/if}
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- The Five Slots — the Grand Ledger -->
  <div class="mx-auto max-w-2xl">
    <div class="relative space-y-3">
      <!-- Decorative left border line -->
      <div
        class="absolute top-3 bottom-3 left-6 hidden w-px bg-gradient-to-b from-transparent via-gold/25 to-transparent sm:block"
      ></div>

      {#each { length: 5 } as _, i}
        {@const slot = character.slots[i]}
        {@const isFilled = !!slot}
        {@const isRequired = slot?.required ?? false}

        <div
          class="group relative flex items-stretch gap-0 rounded-sm border-2 transition-all duration-300
						{isFilled
            ? isRequired
              ? 'parchment-bg border-parchment-300/80'
              : 'parchment-bg border-gold/50 shadow-[0_0_12px_rgba(184,152,68,0.12)]'
            : 'border-dashed border-parchment-300/40 bg-parchment-50/30'}"
        >
          <!-- Slot Numeral -->
          <div
            class="flex w-12 shrink-0 items-center justify-center border-r sm:w-14
							{isFilled
              ? isRequired
                ? 'border-parchment-300/40 bg-parchment-200/30'
                : 'border-gold/20 bg-gold/8'
              : 'border-parchment-300/20 bg-parchment-200/10'}"
          >
            <span
              class="font-display text-lg font-bold
								{isFilled
                ? isRequired
                  ? 'text-ink/25'
                  : 'text-gold/50'
                : 'text-parchment-300/30'}"
            >
              {SLOT_NUMERALS[i]}
            </span>
          </div>

          <!-- Slot Content -->
          <div
            class="flex min-h-[3.5rem] flex-1 items-center gap-3 px-4 py-2.5"
          >
            {#if isFilled}
              <!-- Type badge -->
              <span
                class="font-heading shrink-0 rounded-sm px-2 py-0.5 text-xs font-medium
									{slot.type === 'trait'
                  ? 'bg-crimson/10 text-crimson'
                  : 'bg-gold/15 text-gold-dark'}"
              >
                {slot.type === 'trait' ? 'Trait' : 'Retainer'}
              </span>

              <!-- Name -->
              {#if slot.type === 'trait'}
                {@const traitDef = TRAIT_MAP.get(slot.traitId)}
                {#if traitDef}
                  <TraitTooltip description={traitDef.description}>
                    <span
                      class="font-heading text-sm font-semibold tracking-wide text-ink underline decoration-ink/20 decoration-dotted underline-offset-4"
                    >
                      {traitDef.label}
                    </span>
                  </TraitTooltip>
                {/if}
              {:else}
                <span
                  class="font-heading text-sm font-semibold tracking-wide text-ink"
                >
                  {slotLabel(slot)}
                </span>
              {/if}

              <span class="flex-1"></span>

              <!-- Required / Remove -->
              {#if isRequired}
                <span
                  class="font-heading flex items-center gap-1 text-xs tracking-wide text-ink-faint/60"
                >
                  <svg
                    class="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Required
                </span>
              {:else}
                <button
                  class="cursor-pointer rounded-sm px-2 py-0.5 text-xs text-crimson/60 transition-all duration-200 hover:bg-crimson/8 hover:text-crimson"
                  onclick={() => character.removeSlot(i)}
                >
                  Remove
                </button>
              {/if}
            {:else}
              <!-- Empty slot -->
              <span
                class="font-heading text-sm italic tracking-wide text-parchment-300/50"
              >
                {character.remainingChoices > 0
                  ? 'Awaiting your choice...'
                  : '—'}
              </span>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <!-- Slot Counter -->
    <div class="mt-4 text-center">
      <span class="font-heading text-sm tracking-wide text-parchment-300/60">
        {character.slots.length} of 5 slots filled
      </span>
      {#if character.remainingChoices > 0}
        <span class="font-heading text-sm text-gold/60">
          — {character.remainingChoices} remaining
        </span>
      {/if}
    </div>
  </div>

  <!-- Available Picks -->
  {#if character.remainingChoices > 0}
    <div class="mx-auto mt-10 max-w-2xl">
      <div class="parchment-bg rounded-sm border-2 border-parchment-300/50 p-6">
        <h3
          class="font-heading mb-5 text-center text-lg font-semibold tracking-wide text-ink"
        >
          Choose {character.remainingChoices === 1
            ? 'Your Final Slot'
            : `${character.remainingChoices} More Slots`}
        </h3>

        <!-- Available Traits -->
        {#if character.pickableTraits.length > 0}
          <div class="mb-5">
            <div class="mb-2.5 flex items-center gap-2">
              <span class="h-px flex-1 bg-crimson/15"></span>
              <span
                class="font-heading text-xs font-medium tracking-widest text-crimson/60 uppercase"
                >Traits</span
              >
              <span class="h-px flex-1 bg-crimson/15"></span>
            </div>
            <div class="flex flex-wrap justify-center gap-2">
              {#each character.pickableTraits as trait (trait.id)}
                {@const isHovered = hoveredPickable === trait.id}
                <TraitTooltip description={trait.description}>
                  <button
                    class="cursor-pointer rounded-sm border border-crimson/20 px-3.5 py-2 text-sm transition-all duration-200
											{isHovered
                      ? 'border-crimson/50 bg-crimson/12 shadow-[0_0_10px_rgba(122,26,26,0.15)]'
                      : 'bg-crimson/5 hover:border-crimson/40 hover:bg-crimson/10'}"
                    onmouseenter={() => (hoveredPickable = trait.id)}
                    onmouseleave={() => (hoveredPickable = null)}
                    onclick={() => addTrait(trait.id)}
                  >
                    <span
                      class="font-heading font-medium tracking-wide {isHovered
                        ? 'text-crimson-dark'
                        : 'text-crimson'}"
                    >
                      {trait.label}
                    </span>
                  </button>
                </TraitTooltip>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Available Retainers -->
        {#if character.pickableRetainers.length > 0}
          <div>
            <div class="mb-2.5 flex items-center gap-2">
              <span class="h-px flex-1 bg-gold/20"></span>
              <span
                class="font-heading text-xs font-medium tracking-widest text-gold-dark/60 uppercase"
                >Retainers</span
              >
              <span class="h-px flex-1 bg-gold/20"></span>
            </div>
            <div class="flex flex-wrap justify-center gap-2">
              {#each character.pickableRetainers as retainer (retainer.id)}
                {@const isHovered = hoveredPickable === retainer.id}
                <button
                  class="cursor-pointer rounded-sm border border-gold/25 px-3.5 py-2 text-sm transition-all duration-200
										{isHovered
                    ? 'border-gold/60 bg-gold/15 shadow-[0_0_10px_rgba(184,152,68,0.2)]'
                    : 'bg-gold/8 hover:border-gold/45 hover:bg-gold/12'}"
                  onmouseenter={() => (hoveredPickable = retainer.id)}
                  onmouseleave={() => (hoveredPickable = null)}
                  onclick={() => addRetainer(retainer.id)}
                >
                  <span
                    class="font-heading font-medium tracking-wide {isHovered
                      ? 'text-gold-dark'
                      : 'text-gold-dark/80'}"
                  >
                    {retainer.label}
                  </span>
                  <span class="ml-1 text-xs text-ink-faint/60">
                    ({retainer.accoutrementSlots} acc. slot{retainer.accoutrementSlots !==
                    1
                      ? 's'
                      : ''})
                  </span>
                </button>
              {/each}
            </div>
            <p class="mt-2 text-center text-xs text-ink-faint/50">
              Choosing a retainer uses a slot that could hold a trait
            </p>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- All slots filled -->
  {#if character.slotsComplete}
    <!-- Indifferent Trait Selection (Churl: roll for N traits) -->
    {#if character.indifferentTraitsDef?.type === 'select'}
      <div class="mx-auto mt-10 max-w-md">
        <div
          class="parchment-bg rounded-sm border-2 p-6 text-center transition-colors duration-300
          {character.indifferentTraitsComplete
            ? 'border-gold/50'
            : 'border-crimson/40 shadow-[0_0_16px_rgba(122,26,26,0.15)]'}"
        >
          <h3
            class="font-heading mb-1 text-lg font-semibold tracking-wide text-crimson"
          >
            Indifferent Traits
          </h3>
          <p
            class="mx-auto mb-5 max-w-xs text-sm leading-relaxed text-ink-faint"
          >
            As a Churl, {character.indifferentTraitsDef.count} traits are randomly
            deemed beneath your concern. Roll to find out which.
          </p>

          <!-- Roll button -->
          <div class="mb-5">
            <button
              class="group/roll font-heading inline-flex cursor-pointer items-center gap-2.5 rounded-sm border-2 border-gold bg-gold/10 px-6 py-2.5 text-sm font-bold tracking-wider text-gold uppercase transition-all duration-300 hover:bg-gold/20 hover:shadow-[0_0_24px_rgba(184,152,68,0.25)]"
              onclick={rollIndifferentTraits}
            >
              <svg
                class="h-4.5 w-4.5 transition-transform duration-300 group-hover/roll:rotate-[30deg] {rollingIndifferent
                  ? 'roll-spinning'
                  : ''}"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="1.5"
                  fill="currentColor"
                  stroke="none"
                />
                <circle
                  cx="15.5"
                  cy="8.5"
                  r="1.5"
                  fill="currentColor"
                  stroke="none"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="1.5"
                  fill="currentColor"
                  stroke="none"
                />
                <circle
                  cx="8.5"
                  cy="15.5"
                  r="1.5"
                  fill="currentColor"
                  stroke="none"
                />
                <circle
                  cx="15.5"
                  cy="15.5"
                  r="1.5"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              {character.indifferentTraitsComplete ? 'Re-roll' : 'Roll'}
            </button>
          </div>

          <!-- Result display -->
          {#if character.indifferentTraits.length > 0}
            <div class="flex flex-wrap justify-center gap-2">
              {#each character.indifferentTraits as traitId}
                {@const traitDef = TRAIT_MAP.get(traitId)}
                {#if traitDef}
                  <TraitTooltip description={traitDef.description}>
                    <span
                      class="inline-flex items-center rounded-sm border border-crimson/30 bg-crimson/8 px-3 py-1.5"
                    >
                      <span
                        class="font-heading text-sm font-medium tracking-wide text-crimson line-through decoration-crimson/40"
                      >
                        {traitDef.label}
                      </span>
                    </span>
                  </TraitTooltip>
                {/if}
              {/each}
            </div>
          {:else}
            <p class="text-xs italic text-parchment-300/60">
              No traits dismissed yet — roll to find out.
            </p>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Success message + continue -->
    {#if character.indifferentTraitsComplete}
      <div class="mx-auto mt-10 max-w-lg text-center">
        <div class="mb-6">
          <span class="font-display text-2xl text-gold/70">&#10033;</span>
          <p
            class="font-heading mt-1 text-sm tracking-wide text-parchment-300/70"
          >
            Your ledger is complete. All five slots are filled.
          </p>
        </div>
        <button
          class="font-heading cursor-pointer rounded-sm border-2 border-gold bg-gold px-10 py-3 text-lg font-semibold tracking-wider text-realm uppercase transition-all duration-200 hover:bg-gold-light hover:shadow-[0_0_24px_rgba(184,152,68,0.4)]"
          onclick={onadvance}
        >
          Continue
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  @keyframes dice-tumble {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(90deg);
    }
    50% {
      transform: rotate(180deg);
    }
    75% {
      transform: rotate(270deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  :global(.roll-spinning) {
    animation: dice-tumble 0.32s linear infinite;
  }
</style>
