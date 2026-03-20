import { describe, it, expect } from 'vitest';
import {
	ALL_TRAITS,
	ALL_RETAINERS,
	SITUATIONS,
	TRAIT_MAP,
	RETAINER_MAP,
	SITUATION_MAP,
	getRequiredSlots,
	getFreeSlotCount,
	getPickableTraits,
	getPickableRetainers,
	getAvailableClasses
} from './situations';
import { SLOT_COUNT, SOCIAL_CLASSES, DEATH_STATUSES, LOONY_STATUSES, CURRENCIES } from './types';
import type { CharacterSlot } from './types';

describe('data integrity', () => {
	it('has 18 traits', () => {
		expect(ALL_TRAITS).toHaveLength(18);
	});

	it('has 12 retainers', () => {
		expect(ALL_RETAINERS).toHaveLength(12);
	});

	it('all traits have unique IDs', () => {
		const ids = ALL_TRAITS.map((t) => t.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('all retainers have unique IDs', () => {
		const ids = ALL_RETAINERS.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('TRAIT_MAP contains all traits', () => {
		expect(TRAIT_MAP.size).toBe(ALL_TRAITS.length);
		for (const trait of ALL_TRAITS) {
			expect(TRAIT_MAP.get(trait.id)).toBe(trait);
		}
	});

	it('RETAINER_MAP contains all retainers', () => {
		expect(RETAINER_MAP.size).toBe(ALL_RETAINERS.length);
		for (const retainer of ALL_RETAINERS) {
			expect(RETAINER_MAP.get(retainer.id)).toBe(retainer);
		}
	});

	it('situation required traits reference valid trait IDs', () => {
		for (const sit of SITUATIONS) {
			for (const traitId of sit.requiredTraits) {
				expect(TRAIT_MAP.has(traitId)).toBe(true);
			}
		}
	});

	it('situation available traits reference valid trait IDs', () => {
		for (const sit of SITUATIONS) {
			for (const traitId of sit.availableTraits) {
				expect(TRAIT_MAP.has(traitId)).toBe(true);
			}
		}
	});

	it('situation required retainers reference valid retainer IDs', () => {
		for (const sit of SITUATIONS) {
			for (const retainerId of sit.requiredRetainers) {
				expect(RETAINER_MAP.has(retainerId)).toBe(true);
			}
		}
	});

	it('situation available retainers reference valid retainer IDs', () => {
		for (const sit of SITUATIONS) {
			if (sit.availableRetainers) {
				for (const retainerId of sit.availableRetainers) {
					expect(RETAINER_MAP.has(retainerId)).toBe(true);
				}
			}
		}
	});

	it('situation required traits do not overlap with available traits', () => {
		for (const sit of SITUATIONS) {
			const required = new Set(sit.requiredTraits);
			for (const traitId of sit.availableTraits) {
				expect(required.has(traitId)).toBe(false);
			}
		}
	});

	it('situation required + available slots do not exceed SLOT_COUNT', () => {
		for (const sit of SITUATIONS) {
			const requiredCount = sit.requiredTraits.length + sit.requiredRetainers.length;
			expect(requiredCount).toBeLessThanOrEqual(SLOT_COUNT);
		}
	});

	it('situation indifferentTraits references valid trait IDs', () => {
		for (const sit of SITUATIONS) {
			const def = sit.indifferentTraits;
			if (def.type === 'fixed') {
				for (const traitId of def.traitIds) {
					expect(TRAIT_MAP.has(traitId)).toBe(true);
				}
			}
			if (def.type === 'select') {
				expect(def.count).toBeGreaterThan(0);
				if (def.exclude) {
					for (const traitId of def.exclude) {
						expect(TRAIT_MAP.has(traitId)).toBe(true);
					}
				}
			}
		}
	});

	it('situation availableClasses only contain valid social classes', () => {
		const validClasses = new Set<string>(SOCIAL_CLASSES);
		for (const sit of SITUATIONS) {
			for (const cls of sit.availableClasses) {
				expect(validClasses.has(cls)).toBe(true);
			}
		}
	});

	it('situation availableClasses is non-empty', () => {
		for (const sit of SITUATIONS) {
			expect(sit.availableClasses.length).toBeGreaterThan(0);
		}
	});

	it('situation startingDeathStatus is a valid death status', () => {
		const validStatuses = new Set<string>(DEATH_STATUSES);
		for (const sit of SITUATIONS) {
			expect(validStatuses.has(sit.startingDeathStatus)).toBe(true);
		}
	});

	it('situation startingLoonyStatus is a valid loony status', () => {
		const validStatuses = new Set<string>(LOONY_STATUSES);
		for (const sit of SITUATIONS) {
			expect(validStatuses.has(sit.startingLoonyStatus)).toBe(true);
		}
	});

	it('situation startingCurrency references a valid currency with a valid roll', () => {
		const validCurrencies = new Set<string>(CURRENCIES);
		for (const sit of SITUATIONS) {
			expect(validCurrencies.has(sit.startingCurrency.currency)).toBe(true);
			expect(sit.startingCurrency.roll.count).toBeGreaterThan(0);
			expect(sit.startingCurrency.roll.sides).toBeGreaterThan(0);
		}
	});

	it('dice pool length matches max trait slots', () => {
		for (const sit of SITUATIONS) {
			// dicePool length = max number of trait slots (total slots minus required retainers)
			const maxTraitSlots = SLOT_COUNT - sit.requiredRetainers.length;
			expect(sit.dicePool).toHaveLength(maxTraitSlots);
		}
	});
});

describe('Knight situation', () => {
	const knight = SITUATION_MAP.get('knight')!;

	it('exists in the situation map', () => {
		expect(knight).toBeDefined();
	});

	it('requires valour and chastity', () => {
		expect(knight.requiredTraits).toEqual(['valour', 'chastity']);
	});

	it('requires manservant retainer', () => {
		expect(knight.requiredRetainers).toEqual(['manservant']);
	});

	it('allows retainers', () => {
		expect(knight.allowRetainers).toBe(true);
	});

	it('has squire and minstrel as available retainers', () => {
		expect(knight.availableRetainers).toEqual(['squire', 'minstrel']);
	});

	it('has a dice pool of [18, 12, 12, 6]', () => {
		expect(knight.dicePool).toEqual([18, 12, 12, 6]);
	});

	it('only allows upper class', () => {
		expect(knight.availableClasses).toEqual(['upper']);
	});

	it('is indifferent to subtlety', () => {
		expect(knight.indifferentTraits).toEqual({ type: 'fixed', traitIds: ['subtlety'] });
	});

	it('starts on Mr. Neutron death status', () => {
		expect(knight.startingDeathStatus).toBe('mr_neutron');
	});

	it('starts on Reginald Maudling loony status', () => {
		expect(knight.startingLoonyStatus).toBe('daft');
	});

	it('starts with gold (1d30)', () => {
		expect(knight.startingCurrency).toEqual({ currency: 'gold', roll: { count: 1, sides: 30 } });
	});
});

describe('Churl situation', () => {
	const churl = SITUATION_MAP.get('churl')!;

	it('exists in the situation map', () => {
		expect(churl).toBeDefined();
	});

	it('requires animal husbandry', () => {
		expect(churl.requiredTraits).toEqual(['animal_husbandry']);
	});

	it('has no required retainers', () => {
		expect(churl.requiredRetainers).toEqual([]);
	});

	it('does not allow retainers', () => {
		expect(churl.allowRetainers).toBe(false);
	});

	it('has a dice pool of [12, 12, 10, 10, 8]', () => {
		expect(churl.dicePool).toEqual([12, 12, 10, 10, 8]);
	});

	it('only allows lower class', () => {
		expect(churl.availableClasses).toEqual(['lower']);
	});

	it('allows selecting 2 indifferent traits excluding luck', () => {
		expect(churl.indifferentTraits).toEqual({ type: 'select', count: 2, exclude: ['luck'] });
	});

	it('has 12 available traits to choose from', () => {
		expect(churl.availableTraits).toHaveLength(12);
	});

	it('starts on Getting Better death status', () => {
		expect(churl.startingDeathStatus).toBe('getting_better');
	});

	it('starts on Sensible loony status', () => {
		expect(churl.startingLoonyStatus).toBe('sensible');
	});

	it('starts with plague-dead bodies (1d30)', () => {
		expect(churl.startingCurrency).toEqual({
			currency: 'plague_dead_bodies',
			roll: { count: 1, sides: 30 }
		});
	});
});

describe('getRequiredSlots', () => {
	it('returns required trait and retainer slots for knight', () => {
		const slots = getRequiredSlots('knight');
		expect(slots).toHaveLength(3); // 2 required traits + 1 required retainer

		const traitSlots = slots.filter((s) => s.type === 'trait');
		expect(traitSlots).toHaveLength(2);
		expect(traitSlots[0]).toEqual({ type: 'trait', traitId: 'valour', required: true });
		expect(traitSlots[1]).toEqual({ type: 'trait', traitId: 'chastity', required: true });

		const retainerSlots = slots.filter((s) => s.type === 'retainer');
		expect(retainerSlots).toHaveLength(1);
		expect(retainerSlots[0]).toEqual({
			type: 'retainer',
			retainerId: 'manservant',
			required: true,
			name: ''
		});
	});

	it('returns empty array for unknown situation', () => {
		expect(getRequiredSlots('nonexistent')).toEqual([]);
	});
});

describe('getFreeSlotCount', () => {
	it('returns 2 for knight (5 - 3 required)', () => {
		expect(getFreeSlotCount('knight')).toBe(2);
	});

	it('returns SLOT_COUNT for unknown situation', () => {
		expect(getFreeSlotCount('nonexistent')).toBe(SLOT_COUNT);
	});
});

describe('getPickableTraits', () => {
	it('returns all available traits for knight when no free slots filled', () => {
		const requiredSlots = getRequiredSlots('knight');
		const pickable = getPickableTraits('knight', requiredSlots);
		expect(pickable).toHaveLength(7); // knight has 7 available traits
	});

	it('excludes already-picked traits', () => {
		const slots: CharacterSlot[] = [
			...getRequiredSlots('knight'),
			{ type: 'trait', traitId: 'strategy', required: false }
		];
		const pickable = getPickableTraits('knight', slots);
		expect(pickable.find((t) => t.id === 'strategy')).toBeUndefined();
		expect(pickable).toHaveLength(6);
	});

	it('returns empty for unknown situation', () => {
		expect(getPickableTraits('nonexistent', [])).toEqual([]);
	});

	it('excludes required traits from pickable list', () => {
		const pickable = getPickableTraits('knight', getRequiredSlots('knight'));
		const pickableIds = pickable.map((t) => t.id);
		expect(pickableIds).not.toContain('valour');
		expect(pickableIds).not.toContain('chastity');
	});
});

describe('getAvailableClasses', () => {
	it('returns available classes for knight', () => {
		expect(getAvailableClasses('knight')).toEqual(['upper']);
	});

	it('returns empty for unknown situation', () => {
		expect(getAvailableClasses('nonexistent')).toEqual([]);
	});
});

describe('getPickableRetainers', () => {
	it('returns available retainers for knight excluding already-picked', () => {
		const requiredSlots = getRequiredSlots('knight');
		const pickable = getPickableRetainers('knight', requiredSlots);
		// manservant is required (already in slots), so only squire and minstrel
		expect(pickable).toHaveLength(2);
		expect(pickable.map((r) => r.id)).toEqual(['squire', 'minstrel']);
	});

	it('excludes already-picked retainers', () => {
		const slots: CharacterSlot[] = [
			...getRequiredSlots('knight'),
			{ type: 'retainer', retainerId: 'squire', required: false, name: '' }
		];
		const pickable = getPickableRetainers('knight', slots);
		expect(pickable).toHaveLength(1);
		expect(pickable[0].id).toBe('minstrel');
	});

	it('returns empty for unknown situation', () => {
		expect(getPickableRetainers('nonexistent', [])).toEqual([]);
	});
});
