import type { Modifier } from './types';

/**
 * Apply a list of modifiers to a base values map, returning final computed values.
 *
 * Application order:
 *  1. 'set' operations (priority-sorted) — override base value
 *  2. 'add' operations — sum onto current value
 *  3. 'multiply' operations — scale current value
 *  4. 'min' operations — clamp to minimum
 *  5. 'max' operations — clamp to maximum
 */
export function applyModifiers(
	baseValues: Record<string, number | string>,
	modifiers: Modifier[]
): Record<string, number | string> {
	const result: Record<string, number | string> = { ...baseValues };

	// Group modifiers by target
	const byTarget = new Map<string, Modifier[]>();
	for (const mod of modifiers) {
		const list = byTarget.get(mod.target) ?? [];
		list.push(mod);
		byTarget.set(mod.target, list);
	}

	for (const [target, mods] of byTarget) {
		let value = typeof result[target] === 'number' ? (result[target] as number) : 0;

		// Sort by priority (lower first), stable within same priority
		const sorted = [...mods].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

		for (const mod of sorted.filter((m) => m.operation === 'set')) {
			value = mod.value;
		}
		for (const mod of sorted.filter((m) => m.operation === 'add')) {
			value += mod.value;
		}
		for (const mod of sorted.filter((m) => m.operation === 'multiply')) {
			value *= mod.value;
		}
		for (const mod of sorted.filter((m) => m.operation === 'min')) {
			value = Math.max(value, mod.value);
		}
		for (const mod of sorted.filter((m) => m.operation === 'max')) {
			value = Math.min(value, mod.value);
		}

		result[target] = value;
	}

	return result;
}

/** Remove all modifiers whose source starts with the given prefix */
export function removeBySource(modifiers: Modifier[], sourcePrefix: string): Modifier[] {
	return modifiers.filter((m) => !m.source.startsWith(sourcePrefix));
}

/** Get all modifiers affecting a specific target */
export function getModifiersForTarget(modifiers: Modifier[], target: string): Modifier[] {
	return modifiers.filter((m) => m.target === target);
}

/** Format a modifier value as a signed string: +2, -1, etc. */
export function formatModifier(value: number): string {
	return value >= 0 ? `+${value}` : `${value}`;
}
