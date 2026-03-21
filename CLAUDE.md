# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CMRP Character Sheet — a web-based RPG character sheet creator. Players can create/edit character sheets, download as PDF, save/load sheets, and click elements to roll dice.

## Tech Stack

- **Framework:** SvelteKit (Svelte 5 with runes mode enabled)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Package Manager:** Bun (not npm/pnpm/yarn)
- **Build Tool:** Vite 7

## Commands

- `bun install` — install dependencies
- `bun run dev` — start dev server
- `bun run build` — production build
- `bun run preview` — preview production build
- `bun run check` — type-check with svelte-check
- `bun run test` — run unit tests (vitest)
- `bun run test:watch` — run tests in watch mode

## Testing Policy

When adding or modifying a feature, **always** write or update unit tests to cover the changes. Before considering work complete, run `bun run test` and confirm all tests pass — both new and existing. Do not submit changes that break existing tests.

## Code Quality Philosophy

This project prioritizes clean code and well-designed data structures. When implementing a new feature, actively look for opportunities to refactor, generalize, or introduce abstractions that improve the codebase — don't just bolt new code onto existing patterns if a better structure exists. The application will grow significantly in complexity, so investing in good abstractions now pays off. Prefer generic, reusable solutions over one-off implementations. If you see a way to make existing code more maintainable while working on a feature, do the refactor.

## Architecture

- SvelteKit file-based routing in `src/routes/`
- Svelte 5 runes mode is enforced for all non-node_modules files (see `svelte.config.js` `vitePlugin.dynamicCompileOptions`)
- Global CSS entry point: `src/app.css` (imports Tailwind), loaded via `+layout.svelte`
- Shared library code goes in `src/lib/` (aliased as `$lib`)
- Tailwind is configured as a Vite plugin in `vite.config.ts`, not via PostCSS

## Game System (CMRP)

### Core Concepts

- **Situation** — the system's term for "class". Chosen first during character creation. Determines which Traits and Retainers a character has access to.
- **Traits** — similar to ability scores in other systems. Each trait's value is a **die size** (d4, d6, d8, d10, d12, d14, d16, d18, d20). Each die size has flavour text (cosmetic, not functional): d4 "A bit too really...", d6 "Quite", d8 "Rather", d10 "A Bit", d12 "Neither really", d14 "A Bit", d16 "Rather", d18 "Quite", d20 "A bit too really...". Each Situation provides a **dice pool** — a set of dice equal to the maximum number of trait slots. The player distributes these dice across their traits. If they choose an optional retainer (reducing their trait count), they pick a subset of the pool. Alternatively, a player may opt to **roll** for each trait, in which case they enter values freely. Some Situations have `mustRoll: true` (with an empty `dicePool`), meaning the player **must** roll for each trait and there is no pool to distribute (e.g., Enchanter). The 18 Traits are: Animal Husbandry, Argumentation, Authority, Bardistry, Chastity, Decorum, Druidry, Glibness, Heartiness, Lorefulness, Luck, Nimbleness, Purpose, Sorcery, Strategy, Subtlety, Valour, Wisdom in the Ways of Science.
- **Retainers** — companions/followers that occupy a slot instead of a Trait. No numeric value; will have their own properties in the future. The Retainer types are: Acolyte, Apprentice, Herald, Homunculus, Jester, Manservant (with coconuts), Minstrel, Poet, Scribe, Squire, Torchbearer, Valet/Handmaid.
- **Class** — a character's social standing: Upper, Middle, or Lower. Each Situation defines which classes the player may pick from (e.g., a Knight must be Upper class). Some Situations restrict to a single class; others allow a choice. Some Situations define **class-required traits** via `classRequiredTraits` — additional traits that become required based on the chosen class (e.g., Cleric requires Decorum if Upper, Chastity if Middle). Changing class rebuilds the required slots and resets player choices.
- **Situation Choices** — some Situations offer named choices via `SituationChoiceDef` that add required traits. Each choice has a set of options, and each option can specify `requiredTraits` that become locked-in slots when selected. Changing a choice rebuilds required slots and resets player picks (same behavior as changing class). Example: the Troubadour chooses a Muse (Calliope, Clio, etc.), each granting a different trait (Argumentation, Lorefulness, etc.). Stored in `CharacterData.choiceSelections` as `Record<string, string>` (choice ID → option ID).
- **Death Status** — a 6-step health track from healthiest to deadest: Mr. Neutron, "Fine, Fine", Getting Better, Not Dead Yet, Virtually Dead, No More. Each Situation defines a `startingDeathStatus` that determines where the character begins on the track.
- **Loony Status** — a 6-step sanity track from sanest to maddest: Reginald Maudling, Sensible, Daft, Barmy, Crackers, Coconuts. Each Situation defines a `startingLoonyStatus` that determines where the character begins on the track.
- **Currencies** — 10 possible currency types a character can possess: Acorns, Cheese, Eggs, Gemstones, Gold, Lupins, Naughty Pictures, Plague-Dead Bodies, Upper-Class Twit Trading Cards, Whizzo Butter. Each currency is tracked as a simple numeric amount. Stored as `Partial<Record<Currency, number>>` — only currencies with positive amounts are present. Each Situation defines a `startingCurrency` with a currency type and a `DiceExpression` the player rolls to determine their starting amount (e.g., Knight rolls 1d30 Gold). The starting currency is highlighted on the sheet with the roll instruction displayed; the player rolls and enters the result manually.
- **Accoutrements** — equipment/items attached to a Trait or Retainer. Every filled slot (both traits and retainers, whether required or player-chosen) gets one free accoutrement pick at character creation; additional accoutrements can be acquired during play for any slot. Accoutrements are defined **per-slot** (not per-situation) — any situation with Valour uses the same Valour accoutrement list; retainer accoutrements are keyed by retainer ID the same way. `AccoutrementDef.slotId` holds the trait or retainer ID it belongs to. Lookups use `ACCOUTREMENTS_BY_SLOT` (keyed by slot ID) and `getAvailableAccoutrements(slotId, hasRetainer)`. They provide simple modifiers (+/- to trait rolls), conditional modifiers (display-only text like "+1 vs Monstrosities"), and special effects. Some have prerequisites (e.g., requires a retainer). **Important:** accoutrement modifiers are **roll modifiers**, not die-size modifiers. A +1 to Valour means the roll is 1d12+1, not 1d13. They are tracked via `rollModifiers` (a derived `Record<string, number>` in character state), completely separate from the main `modifiers` stack which affects die sizes. A slot can hold multiple accoutrements — stored as `Record<string, string[]>` (slot ID → array of accoutrement IDs, where index 0 is the primary pick). Some accoutrements have `grantsExtra` which unlocks a bonus accoutrement slot (e.g., Cloth Sack grants one extra non-pointy accoutrement from any slot). The `pointy?: boolean` tag on `AccoutrementDef` is used for filtering bonus picks — pointy accoutrements will be tagged once all trait accoutrements are defined. Use `getExtraAccoutrementOptions(primaryAccId, hasRetainer)` to get valid bonus picks. Changing the primary accoutrement automatically clears any bonus picks that depended on it.

### Character Slots

Every character has exactly **5 slots**. Each slot holds either a Trait or a Retainer.

- The Situation **locks in** some slots (required Traits and/or required Retainers).
- The player **fills remaining slots** by choosing from the Traits and Retainers allowed by their Situation.
- A Situation defines: required traits, available traits to pick from, required retainers, whether retainers are allowed, which retainer types are available, optionally class-required traits (`classRequiredTraits`) that add required trait slots based on social class choice, and optionally situation choices (`choices`) that add required traits based on player selection (e.g. muse).
- **Indifferent Traits** — each Situation specifies traits the character is indifferent to, via `IndifferentTraitsDef`. Two variants: `{ type: 'fixed', traitIds: [...] }` for Situations with predetermined indifferent traits (e.g., Knight is always indifferent to Subtlety), and `{ type: 'select', count: N, exclude?: [...] }` for Situations where the player chooses N indifferent traits from their unchosen available traits (e.g., Churl picks 2, excluding Luck). Selections are only available once all 5 slots are filled.

### Design Patterns

- **Modifier stack** — effects (from Situations, items, etc.) are `Modifier` objects with source, target, operation, and value. Modifiers are added/removed by source prefix, applied in priority order (set → add → multiply → min → max).
- **Reactive derivation** — base values are `$state`, computed values are `$derived`. Changing a Situation or trait value automatically cascades through the dependency graph via Svelte 5 runes.
- **Effect registry** — pure data maps (e.g. `situationEffects`) that associate choices with their modifier lists. Keeps game logic declarative and out of component code.
- **Schema-driven fields** — `FieldDef` type allows rendering fields generically based on their definition.

### Key Files

- `src/lib/types.ts` — core type definitions (Modifier, SituationDef, TraitDef, RetainerDef, CharacterSlot, etc.)
- `src/lib/situations.ts` — Trait/Retainer/Situation data and lookup helpers
- `src/lib/accoutrements.ts` — Accoutrement definitions and lookup helpers
- `src/lib/modifiers.ts` — modifier engine (applyModifiers, removeBySource, etc.)
- `src/lib/effects.ts` — effect registry mapping choices to modifiers
- `src/lib/dice.ts` — dice rolling engine
- `src/lib/character.svelte.ts` — reactive character state factory (createCharacter)
