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
- **Traits** — similar to ability scores in other systems. Each trait's value is a **die size** (d4, d6, d8, d10, d12, d14, d16, d18, d20). Each Situation provides a **dice pool** — a set of dice equal to the maximum number of trait slots. The player distributes these dice across their traits. If they choose an optional retainer (reducing their trait count), they pick a subset of the pool. Alternatively, a player may opt to **roll** for each trait, in which case they enter values freely. The 18 Traits are: Animal Husbandry, Argumentation, Authority, Bardistry, Chastity, Decorum, Druidry, Glibness, Heartiness, Lorefulness, Luck, Nimbleness, Purpose, Sorcery, Strategy, Subtlety, Valour, Wisdom in the Ways of Science.
- **Retainers** — companions/followers that occupy a slot instead of a Trait. No numeric value; will have their own properties in the future. The Retainer types are: Acolyte, Apprentice, Herald, Homunculus, Jester, Manservant (with coconuts), Minstrel, Poet, Scribe, Squire, Torchbearer, Valet/Handmaid.
- **Class** — a character's social standing: Upper, Middle, or Lower. Each Situation defines which classes the player may pick from (e.g., a Knight must be Upper class). Some Situations restrict to a single class; others allow a choice.
- **Death Status** — a 6-step health track from healthiest to deadest: Mr. Neutron, "Fine, Fine", Getting Better, Not Dead Yet, Virtually Dead, No More. Each Situation defines a `startingDeathStatus` that determines where the character begins on the track.
- **Loony Status** — a 6-step sanity track from sanest to maddest: Reginald Maudling, Sensible, Daft, Barmy, Crackers, Coconuts. Each Situation defines a `startingLoonyStatus` that determines where the character begins on the track.
- **Currencies** — 10 possible currency types a character can possess: Acorns, Cheese, Eggs, Gemstones, Gold, Lupins, Naughty Pictures, Plague-Dead Bodies, Upper-Class Twit Trading Cards, Whizzo Butter. Each currency is tracked as a simple numeric amount. Stored as `Partial<Record<Currency, number>>` — only currencies with positive amounts are present.
- **Accoutrements** — equipment/items attached to a Trait. Each required trait gets one free accoutrement pick at character creation. Accoutrements are defined **per-trait** (not per-situation) — any situation with Valour uses the same Valour accoutrement list. They provide simple modifiers (+/- to trait rolls), conditional modifiers (display-only text like "+1 vs Monstrosities"), and special effects. Some have prerequisites (e.g., requires a retainer). **Important:** accoutrement modifiers are **roll modifiers**, not die-size modifiers. A +1 to Valour means the roll is 1d12+1, not 1d13. They are tracked via `rollModifiers` (a derived `Record<string, number>` in character state), completely separate from the main `modifiers` stack which affects die sizes.

### Character Slots

Every character has exactly **5 slots**. Each slot holds either a Trait or a Retainer.

- The Situation **locks in** some slots (required Traits and/or required Retainers).
- The player **fills remaining slots** by choosing from the Traits and Retainers allowed by their Situation.
- A Situation defines: required traits, available traits to pick from, required retainers, whether retainers are allowed, and which retainer types are available.

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
