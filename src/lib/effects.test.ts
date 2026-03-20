import { describe, it, expect } from 'vitest';
import { getEffects, getOptions, situationEffects, effectRegistries } from './effects';

describe('getEffects', () => {
	it('returns empty array for unknown category', () => {
		expect(getEffects('nonexistent', 'anything')).toEqual([]);
	});

	it('returns empty array for unknown choice in existing category', () => {
		expect(getEffects('situation', 'nonexistent')).toEqual([]);
	});

	it('returns empty array for situation category (currently has no effects)', () => {
		expect(getEffects('situation', 'knight')).toEqual([]);
	});
});

describe('getOptions', () => {
	it('returns empty array for unknown category', () => {
		expect(getOptions('nonexistent')).toEqual([]);
	});

	it('returns keys of the situation registry', () => {
		const options = getOptions('situation');
		expect(options).toEqual(Object.keys(situationEffects));
	});
});

describe('effectRegistries', () => {
	it('has a situation registry', () => {
		expect(effectRegistries).toHaveProperty('situation');
	});
});
