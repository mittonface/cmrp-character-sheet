import type { Modifier } from './types';

/**
 * Effect registry — pure data mapping choices to modifiers.
 *
 * Each key is a choice value (e.g. a situation ID).
 * Each value is the list of modifiers that choice applies.
 *
 * TODO: Populate with real game effects as the system is fleshed out.
 */

export const situationEffects: Record<string, Modifier[]> = {
  // Placeholder — situations may grant modifiers to traits or other fields
};

/** All effect registries keyed by selection category */
export const effectRegistries: Record<string, Record<string, Modifier[]>> = {
  situation: situationEffects,
};

/**
 * Given a category and a choice, return the modifiers for that choice.
 * Returns empty array if the category or choice doesn't exist.
 */
export function getEffects(category: string, choice: string): Modifier[] {
  return effectRegistries[category]?.[choice] ?? [];
}

/**
 * Get available options for a given category.
 */
export function getOptions(category: string): string[] {
  return Object.keys(effectRegistries[category] ?? {});
}
