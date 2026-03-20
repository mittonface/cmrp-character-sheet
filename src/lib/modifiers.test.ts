import { describe, it, expect } from 'vitest';
import { applyModifiers, removeBySource, getModifiersForTarget, formatModifier } from './modifiers';
import type { Modifier } from './types';

describe('applyModifiers', () => {
	it('returns a copy of base values when no modifiers exist', () => {
		const base = { valour: 10, chastity: 8 };
		const result = applyModifiers(base, []);
		expect(result).toEqual({ valour: 10, chastity: 8 });
		expect(result).not.toBe(base);
	});

	it('applies add modifiers', () => {
		const base = { valour: 10 };
		const mods: Modifier[] = [
			{ source: 'item:sword', target: 'valour', operation: 'add', value: 2 }
		];
		expect(applyModifiers(base, mods)).toEqual({ valour: 12 });
	});

	it('applies multiple add modifiers to the same target', () => {
		const base = { valour: 10 };
		const mods: Modifier[] = [
			{ source: 'item:sword', target: 'valour', operation: 'add', value: 2 },
			{ source: 'item:shield', target: 'valour', operation: 'add', value: 1 }
		];
		expect(applyModifiers(base, mods)).toEqual({ valour: 13 });
	});

	it('applies set operations before add', () => {
		const base = { valour: 10 };
		const mods: Modifier[] = [
			{ source: 'item:sword', target: 'valour', operation: 'add', value: 3 },
			{ source: 'curse:weakness', target: 'valour', operation: 'set', value: 5 }
		];
		// set to 5, then add 3 = 8
		expect(applyModifiers(base, mods)).toEqual({ valour: 8 });
	});

	it('applies multiply after add', () => {
		const base = { valour: 10 };
		const mods: Modifier[] = [
			{ source: 'item:sword', target: 'valour', operation: 'add', value: 2 },
			{ source: 'buff:double', target: 'valour', operation: 'multiply', value: 2 }
		];
		// 10 + 2 = 12, then 12 * 2 = 24
		expect(applyModifiers(base, mods)).toEqual({ valour: 24 });
	});

	it('applies min (clamp to minimum) after multiply', () => {
		const base = { valour: 2 };
		const mods: Modifier[] = [
			{ source: 'floor', target: 'valour', operation: 'min', value: 5 }
		];
		// Math.max(2, 5) = 5
		expect(applyModifiers(base, mods)).toEqual({ valour: 5 });
	});

	it('min does not raise a value already above the minimum', () => {
		const base = { valour: 10 };
		const mods: Modifier[] = [
			{ source: 'floor', target: 'valour', operation: 'min', value: 5 }
		];
		expect(applyModifiers(base, mods)).toEqual({ valour: 10 });
	});

	it('applies max (clamp to maximum) after min', () => {
		const base = { valour: 100 };
		const mods: Modifier[] = [
			{ source: 'cap', target: 'valour', operation: 'max', value: 20 }
		];
		// Math.min(100, 20) = 20
		expect(applyModifiers(base, mods)).toEqual({ valour: 20 });
	});

	it('applies full operation chain: set → add → multiply → min → max', () => {
		const base = { valour: 99 };
		const mods: Modifier[] = [
			{ source: 's', target: 'valour', operation: 'set', value: 10 },
			{ source: 'a', target: 'valour', operation: 'add', value: 5 },
			{ source: 'm', target: 'valour', operation: 'multiply', value: 2 },
			{ source: 'floor', target: 'valour', operation: 'min', value: 1 },
			{ source: 'cap', target: 'valour', operation: 'max', value: 25 }
		];
		// set 10, add 5 = 15, multiply 2 = 30, min(30,1) = 30, max(30,25) = 25
		expect(applyModifiers(base, mods)).toEqual({ valour: 25 });
	});

	it('respects priority ordering within the same operation type', () => {
		const base = { valour: 0 };
		const mods: Modifier[] = [
			{ source: 'b', target: 'valour', operation: 'set', value: 20, priority: 10 },
			{ source: 'a', target: 'valour', operation: 'set', value: 5, priority: 1 }
		];
		// priority 1 first (set 5), then priority 10 (set 20) — last set wins
		expect(applyModifiers(base, mods)).toEqual({ valour: 20 });
	});

	it('handles modifiers targeting keys not in base values', () => {
		const base = {};
		const mods: Modifier[] = [
			{ source: 'item', target: 'valour', operation: 'add', value: 3 }
		];
		// base value defaults to 0 for missing numeric targets
		expect(applyModifiers(base, mods)).toEqual({ valour: 3 });
	});

	it('handles string base values by treating them as 0', () => {
		const base = { name: 'Sir Lancelot' };
		const mods: Modifier[] = [
			{ source: 'x', target: 'name', operation: 'add', value: 5 }
		];
		// string values start at 0 for computation
		expect(applyModifiers(base, mods)).toEqual({ name: 5 });
	});

	it('handles multiple targets independently', () => {
		const base = { valour: 10, chastity: 8 };
		const mods: Modifier[] = [
			{ source: 'a', target: 'valour', operation: 'add', value: 2 },
			{ source: 'b', target: 'chastity', operation: 'add', value: -1 }
		];
		expect(applyModifiers(base, mods)).toEqual({ valour: 12, chastity: 7 });
	});

	it('does not mutate the base values object', () => {
		const base = { valour: 10 };
		const mods: Modifier[] = [
			{ source: 'a', target: 'valour', operation: 'add', value: 5 }
		];
		applyModifiers(base, mods);
		expect(base.valour).toBe(10);
	});
});

describe('removeBySource', () => {
	const mods: Modifier[] = [
		{ source: 'situation:knight', target: 'valour', operation: 'add', value: 1 },
		{ source: 'situation:wizard', target: 'sorcery', operation: 'add', value: 2 },
		{ source: 'item:sword', target: 'valour', operation: 'add', value: 3 },
		{ source: 'accoutrement:valour:shield', target: 'valour', operation: 'add', value: 1 }
	];

	it('removes modifiers matching the source prefix', () => {
		const result = removeBySource(mods, 'situation:');
		expect(result).toHaveLength(2);
		expect(result.every((m) => !m.source.startsWith('situation:'))).toBe(true);
	});

	it('removes modifiers with an exact source match', () => {
		const result = removeBySource(mods, 'item:sword');
		expect(result).toHaveLength(3);
	});

	it('returns all modifiers when no prefix matches', () => {
		const result = removeBySource(mods, 'nonexistent:');
		expect(result).toHaveLength(4);
	});

	it('returns empty array from empty input', () => {
		expect(removeBySource([], 'anything')).toEqual([]);
	});

	it('removes by specific accoutrement prefix', () => {
		const result = removeBySource(mods, 'accoutrement:valour:');
		expect(result).toHaveLength(3);
		expect(result.find((m) => m.source.startsWith('accoutrement:valour:'))).toBeUndefined();
	});
});

describe('getModifiersForTarget', () => {
	const mods: Modifier[] = [
		{ source: 'a', target: 'valour', operation: 'add', value: 1 },
		{ source: 'b', target: 'chastity', operation: 'add', value: 2 },
		{ source: 'c', target: 'valour', operation: 'set', value: 5 }
	];

	it('returns only modifiers targeting the given field', () => {
		const result = getModifiersForTarget(mods, 'valour');
		expect(result).toHaveLength(2);
		expect(result.every((m) => m.target === 'valour')).toBe(true);
	});

	it('returns empty array for unknown target', () => {
		expect(getModifiersForTarget(mods, 'sorcery')).toEqual([]);
	});
});

describe('formatModifier', () => {
	it('formats positive values with a plus sign', () => {
		expect(formatModifier(2)).toBe('+2');
	});

	it('formats negative values with a minus sign', () => {
		expect(formatModifier(-1)).toBe('-1');
	});

	it('formats zero as +0', () => {
		expect(formatModifier(0)).toBe('+0');
	});
});
