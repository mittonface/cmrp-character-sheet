<script lang="ts">
  import { SITUATION_MAP, TRAIT_MAP } from '$lib/situations';
  import type { createCharacter } from '$lib/character.svelte';
  import type { SocialClass } from '$lib/types';

  type Character = ReturnType<typeof createCharacter>;

  let {
    character,
    onadvance,
  }: { character: Character; onadvance: () => void } = $props();

  let situation = $derived(SITUATION_MAP.get(character.situationId));
  let singleClass = $derived(character.availableClasses.length === 1);

  /** Get the traits that become required when a specific class is chosen */
  function classTraits(cls: SocialClass): string[] {
    return situation?.classRequiredTraits?.[cls] ?? [];
  }

  const CLASS_META: Record<
    SocialClass,
    { title: string; motto: string; sigil: string }
  > = {
    upper: {
      title: 'Upper Class',
      motto: 'Terribly important, frightfully well-bred',
      sigil: '♛',
    },
    middle: {
      title: 'Middle Class',
      motto: 'Not quite posh, not quite peasant',
      sigil: '⚜',
    },
    lower: {
      title: 'Lower Class',
      motto: 'Mud-farming is an honest living',
      sigil: '⚒',
    },
  };

  function selectClass(cls: SocialClass) {
    character.setSocialClass(cls);
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
        >II. Declare Your Class</span
      >
      <span class="h-px flex-1 max-w-16 bg-gold-dark/40"></span>
    </div>
  </div>

  <!-- Situation context -->
  {#if situation}
    <p class="mb-8 text-center text-parchment-300">
      {#if singleClass}
        As a <span class="font-heading font-semibold text-crimson"
          >{situation.label}</span
        >, your class is already determined.
      {:else}
        As a <span class="font-heading font-semibold text-crimson"
          >{situation.label}</span
        >, you may claim standing among the following classes.
      {/if}
    </p>
  {/if}

  <!-- Class Cards -->
  <div
    class="mx-auto grid max-w-3xl gap-5 {singleClass
      ? 'max-w-md'
      : 'sm:grid-cols-' + character.availableClasses.length}"
  >
    {#each character.availableClasses as cls (cls)}
      {@const meta = CLASS_META[cls]}
      {@const isSelected = character.socialClass === cls}
      {@const extraTraits = classTraits(cls)}
      <button
        class="group relative cursor-pointer rounded-sm border-2 p-6 text-left transition-all duration-300
					{isSelected
          ? 'parchment-bg border-gold shadow-[0_0_28px_rgba(184,152,68,0.35),inset_0_0_0_1px_rgba(184,152,68,0.4)] scale-[1.03]'
          : 'parchment-bg border-parchment-300/60 hover:border-gold-dark/60 hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)]'}
					{singleClass ? 'pointer-events-none' : ''}"
        onclick={() => selectClass(cls)}
      >
        <!-- Selected badge -->
        {#if isSelected && !singleClass}
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

        <!-- Sigil -->
        <div
          class="mb-3 text-center text-4xl leading-none
					{isSelected
            ? 'text-gold'
            : 'text-ink/20 group-hover:text-ink/40'} transition-colors duration-300"
        >
          {meta.sigil}
        </div>

        <!-- Class Name -->
        <h3
          class="font-heading mb-1 text-center text-2xl font-bold tracking-wide
					{isSelected ? 'text-crimson-dark' : 'text-crimson'}"
        >
          {meta.title}
        </h3>

        <!-- Motto -->
        <p class="mb-4 text-center text-sm italic text-ink-faint">
          "{meta.motto}"
        </p>

        <!-- Class-required traits (if any) -->
        {#if extraTraits.length > 0}
          <div class="border-t border-parchment-300/50 pt-3">
            <p
              class="font-heading mb-1.5 text-center text-xs font-medium tracking-wide text-ink-faint uppercase"
            >
              Required Traits
            </p>
            <div class="flex flex-wrap justify-center gap-1.5">
              {#each extraTraits as traitId}
                <span
                  class="rounded-sm bg-ink/6 px-2 py-0.5 text-xs text-ink-light"
                >
                  {TRAIT_MAP.get(traitId)?.label ?? traitId}
                </span>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Single-class indicator -->
        {#if singleClass}
          <div class="mt-3 text-center">
            <span class="font-heading text-xs tracking-wide text-gold-dark/70">
              Determined by your Situation
            </span>
          </div>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Continue -->
  {#if character.socialClass}
    <div class="mt-8 text-center">
      <button
        class="font-heading cursor-pointer rounded-sm border-2 border-gold bg-gold px-10 py-3 text-lg font-semibold tracking-wider text-realm uppercase transition-all duration-200 hover:bg-gold-light hover:shadow-[0_0_24px_rgba(184,152,68,0.4)]"
        onclick={onadvance}
      >
        Continue
      </button>
    </div>
  {/if}
</div>
