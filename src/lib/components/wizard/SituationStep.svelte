<script lang="ts">
  import { SITUATIONS, TRAIT_MAP, RETAINER_MAP } from '$lib/situations';
  import type { createCharacter } from '$lib/character.svelte';

  type Character = ReturnType<typeof createCharacter>;

  let {
    character,
    onadvance,
  }: { character: Character; onadvance: () => void } = $props();

  const sortedSituations = [...SITUATIONS].sort((a, b) =>
    a.label.localeCompare(b.label),
  );

  let selected = $derived(
    SITUATIONS.find((s) => s.id === character.situationId),
  );

  function selectSituation(id: string) {
    character.setSituation(id);
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
        >I. Choose Your Situation</span
      >
      <span class="h-px flex-1 max-w-16 bg-gold-dark/40"></span>
    </div>
  </div>

  <!-- Situation Cards Grid -->
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each sortedSituations as situation (situation.id)}
      {@const isSelected = character.situationId === situation.id}
      <button
        class="parchment-bg group relative cursor-pointer rounded-sm border-2 p-4 text-left transition-all duration-200
					{isSelected
          ? 'border-gold shadow-[0_0_20px_rgba(184,152,68,0.3),inset_0_0_0_1px_rgba(184,152,68,0.4)] scale-[1.02]'
          : 'border-parchment-300/60 hover:border-gold-dark/60 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]'}"
        onclick={() => selectSituation(situation.id)}
      >
        <!-- Selected indicator -->
        {#if isSelected}
          <div
            class="absolute -top-px -right-px rounded-bl-sm rounded-tr-sm bg-gold px-2.5 py-0.5"
          >
            <span
              class="font-heading text-xs font-semibold tracking-wider text-realm uppercase"
            >
              Selected
            </span>
          </div>
        {/if}

        <!-- Situation Name -->
        <h3
          class="font-heading mb-2 text-xl font-semibold text-crimson {isSelected
            ? 'text-crimson-dark'
            : ''}"
        >
          {situation.label}
        </h3>

        <!-- Required traits & retainers -->
        <div class="flex flex-wrap gap-1">
          {#each situation.requiredTraits as traitId}
            <span
              class="rounded-sm bg-ink/6 px-1.5 py-0.5 text-xs text-ink-light"
            >
              {TRAIT_MAP.get(traitId)?.label}
            </span>
          {/each}
          {#each situation.requiredRetainers as retainerId}
            <span
              class="rounded-sm bg-gold/10 px-1.5 py-0.5 text-xs text-gold-dark"
            >
              {RETAINER_MAP.get(retainerId)?.label}
            </span>
          {/each}
          {#if 5 - situation.requiredTraits.length - situation.requiredRetainers.length > 0}
            <span
              class="rounded-sm bg-parchment-300/30 px-1.5 py-0.5 text-xs text-ink-faint"
            >
              +{5 -
                situation.requiredTraits.length -
                situation.requiredRetainers.length} more
            </span>
          {/if}
        </div>

        <!-- Indifferent traits -->
        <div class="mt-2 flex flex-wrap items-center gap-1.5">
          <span
            class="font-heading text-[0.65rem] tracking-wide text-crimson/50 uppercase"
            >Indifferent to</span
          >
          {#if situation.indifferentTraits.type === 'fixed'}
            {#each situation.indifferentTraits.traitIds as traitId}
              <span
                class="rounded-sm bg-crimson/8 px-1.5 py-0.5 text-xs text-ink-light/70 line-through decoration-crimson/40"
              >
                {TRAIT_MAP.get(traitId)?.label}
              </span>
            {/each}
          {:else}
            <span
              class="rounded-sm border border-dashed border-crimson/30 px-1.5 py-0.5 text-xs text-ink-light/70"
            >
              choose {situation.indifferentTraits.count}
            </span>
          {/if}
        </div>
      </button>
    {/each}
  </div>

  <!-- Selected Situation Description -->
  {#if selected}
    <div
      class="parchment-bg mx-auto mt-8 max-w-2xl rounded-sm border-2 border-gold/40 p-6"
    >
      <h3 class="font-heading mb-3 text-2xl font-semibold text-crimson">
        {selected.label}
      </h3>
      {#if selected.description}
        <p class="leading-relaxed text-ink-light">
          {selected.description}
        </p>
      {/if}
      <div class="mt-6 text-center">
        <button
          class="font-heading cursor-pointer rounded-sm border-2 border-gold bg-gold px-10 py-3 text-lg font-semibold tracking-wider text-realm uppercase transition-all duration-200 hover:bg-gold-light hover:shadow-[0_0_24px_rgba(184,152,68,0.4)]"
          onclick={onadvance}
        >
          Continue
        </button>
      </div>
    </div>
  {/if}
</div>
