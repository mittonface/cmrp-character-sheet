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

	it('has 26 retainers', () => {
		expect(ALL_RETAINERS).toHaveLength(26);
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
			const baseRequired = sit.requiredTraits.length + sit.requiredRetainers.length;
			expect(baseRequired).toBeLessThanOrEqual(SLOT_COUNT);

			// Also check with class-required traits
			if (sit.classRequiredTraits) {
				for (const traits of Object.values(sit.classRequiredTraits)) {
					const totalRequired = baseRequired + (traits?.length ?? 0);
					expect(totalRequired).toBeLessThanOrEqual(SLOT_COUNT);
				}
			}
		}
	});

	it('situation classRequiredTraits reference valid trait IDs and classes', () => {
		const validClasses = new Set<string>(SOCIAL_CLASSES);
		for (const sit of SITUATIONS) {
			if (sit.classRequiredTraits) {
				for (const [cls, traits] of Object.entries(sit.classRequiredTraits)) {
					expect(validClasses.has(cls)).toBe(true);
					for (const traitId of traits!) {
						expect(TRAIT_MAP.has(traitId)).toBe(true);
					}
				}
			}
		}
	});

	it('situation classRequiredTraits do not overlap with requiredTraits or availableTraits', () => {
		for (const sit of SITUATIONS) {
			if (sit.classRequiredTraits) {
				const required = new Set(sit.requiredTraits);
				const available = new Set(sit.availableTraits);
				for (const traits of Object.values(sit.classRequiredTraits)) {
					for (const traitId of traits!) {
						expect(required.has(traitId)).toBe(false);
						expect(available.has(traitId)).toBe(false);
					}
				}
			}
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

	it('dice pool length matches max trait slots (unless mustRoll)', () => {
		for (const sit of SITUATIONS) {
			if (sit.mustRoll) {
				expect(sit.dicePool).toHaveLength(0);
			} else {
				// dicePool length = max number of trait slots (total slots minus required retainers)
				const maxTraitSlots = SLOT_COUNT - sit.requiredRetainers.length;
				expect(sit.dicePool).toHaveLength(maxTraitSlots);
			}
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

describe('Eremite situation', () => {
	const eremite = SITUATION_MAP.get('eremite')!;

	it('exists in the situation map', () => {
		expect(eremite).toBeDefined();
	});

	it('requires lorefulness and heartiness', () => {
		expect(eremite.requiredTraits).toEqual(['lorefulness', 'heartiness']);
	});

	it('has no required retainers', () => {
		expect(eremite.requiredRetainers).toEqual([]);
	});

	it('does not allow retainers', () => {
		expect(eremite.allowRetainers).toBe(false);
	});

	it('has a dice pool of [16, 14, 12, 12, 6]', () => {
		expect(eremite.dicePool).toEqual([16, 14, 12, 12, 6]);
	});

	it('only allows lower class', () => {
		expect(eremite.availableClasses).toEqual(['lower']);
	});

	it('is indifferent to decorum', () => {
		expect(eremite.indifferentTraits).toEqual({ type: 'fixed', traitIds: ['decorum'] });
	});

	it('has 6 available traits to choose from', () => {
		expect(eremite.availableTraits).toHaveLength(6);
		expect(eremite.availableTraits).toEqual([
			'animal_husbandry',
			'argumentation',
			'druidry',
			'luck',
			'nimbleness',
			'subtlety'
		]);
	});

	it('starts on Mr. Neutron death status', () => {
		expect(eremite.startingDeathStatus).toBe('mr_neutron');
	});

	it('starts on Reginald Maudling loony status', () => {
		expect(eremite.startingLoonyStatus).toBe('reginald_maudling');
	});

	it('starts with acorns (1d30)', () => {
		expect(eremite.startingCurrency).toEqual({
			currency: 'acorns',
			roll: { count: 1, sides: 30 }
		});
	});
});

describe('Cleric situation', () => {
	const cleric = SITUATION_MAP.get('cleric')!;

	it('exists in the situation map', () => {
		expect(cleric).toBeDefined();
	});

	it('requires purpose and lorefulness', () => {
		expect(cleric.requiredTraits).toEqual(['purpose', 'lorefulness']);
	});

	it('has no required retainers', () => {
		expect(cleric.requiredRetainers).toEqual([]);
	});

	it('allows retainers', () => {
		expect(cleric.allowRetainers).toBe(true);
	});

	it('has acolyte and scribe as available retainers', () => {
		expect(cleric.availableRetainers).toEqual(['acolyte', 'scribe']);
	});

	it('has a dice pool of [16, 14, 12, 10, 6]', () => {
		expect(cleric.dicePool).toEqual([16, 14, 12, 10, 6]);
	});

	it('allows upper and middle class', () => {
		expect(cleric.availableClasses).toEqual(['upper', 'middle']);
	});

	it('requires decorum for upper class and chastity for middle class', () => {
		expect(cleric.classRequiredTraits).toEqual({
			upper: ['decorum'],
			middle: ['chastity']
		});
	});

	it('has 4 available traits to choose from', () => {
		expect(cleric.availableTraits).toHaveLength(4);
		expect(cleric.availableTraits).toEqual(['argumentation', 'glibness', 'luck', 'valour']);
	});

	it('is indifferent to Wisdom in the Ways of Science', () => {
		expect(cleric.indifferentTraits).toEqual({
			type: 'fixed',
			traitIds: ['wisdom_in_the_ways_of_science']
		});
	});

	it('starts on Fine, Fine death status', () => {
		expect(cleric.startingDeathStatus).toBe('fine_fine');
	});

	it('starts on Sensible loony status', () => {
		expect(cleric.startingLoonyStatus).toBe('sensible');
	});

	it('starts with naughty pictures (1d30)', () => {
		expect(cleric.startingCurrency).toEqual({
			currency: 'naughty_pictures',
			roll: { count: 1, sides: 30 }
		});
	});
});

describe('Knave situation', () => {
	const knave = SITUATION_MAP.get('knave')!;

	it('exists in the situation map', () => {
		expect(knave).toBeDefined();
	});

	it('requires subtlety, glibness, and nimbleness', () => {
		expect(knave.requiredTraits).toEqual(['subtlety', 'glibness', 'nimbleness']);
	});

	it('has no required retainers', () => {
		expect(knave.requiredRetainers).toEqual([]);
	});

	it('does not allow retainers', () => {
		expect(knave.allowRetainers).toBe(false);
	});

	it('has a dice pool of [14, 12, 10, 8, 6]', () => {
		expect(knave.dicePool).toEqual([14, 12, 10, 8, 6]);
	});

	it('only allows lower class', () => {
		expect(knave.availableClasses).toEqual(['lower']);
	});

	it('is indifferent to valour', () => {
		expect(knave.indifferentTraits).toEqual({ type: 'fixed', traitIds: ['valour'] });
	});

	it('has 6 available traits to choose from', () => {
		expect(knave.availableTraits).toHaveLength(6);
		expect(knave.availableTraits).toEqual([
			'animal_husbandry',
			'argumentation',
			'bardistry',
			'heartiness',
			'luck',
			'strategy'
		]);
	});

	it('starts on Fine, Fine death status', () => {
		expect(knave.startingDeathStatus).toBe('fine_fine');
	});

	it('starts on Sensible loony status', () => {
		expect(knave.startingLoonyStatus).toBe('sensible');
	});

	it('starts with whizzo butter (1d30)', () => {
		expect(knave.startingCurrency).toEqual({
			currency: 'whizzo_butter',
			roll: { count: 1, sides: 30 }
		});
	});
});

describe('Monarch situation', () => {
	const monarch = SITUATION_MAP.get('monarch')!;

	it('exists in the situation map', () => {
		expect(monarch).toBeDefined();
	});

	it('requires authority, purpose, and strategy', () => {
		expect(monarch.requiredTraits).toEqual(['authority', 'purpose', 'strategy']);
	});

	it('requires manservant retainer', () => {
		expect(monarch.requiredRetainers).toEqual(['manservant']);
	});

	it('allows retainers', () => {
		expect(monarch.allowRetainers).toBe(true);
	});

	it('has valet and jester as available retainers', () => {
		expect(monarch.availableRetainers).toEqual(['valet', 'jester']);
	});

	it('has a dice pool of [18, 14, 10, 18]', () => {
		expect(monarch.dicePool).toEqual([18, 14, 10, 18]);
	});

	it('only allows upper class', () => {
		expect(monarch.availableClasses).toEqual(['upper']);
	});

	it('is indifferent to argumentation', () => {
		expect(monarch.indifferentTraits).toEqual({ type: 'fixed', traitIds: ['argumentation'] });
	});

	it('has 8 available traits to choose from', () => {
		expect(monarch.availableTraits).toHaveLength(8);
		expect(monarch.availableTraits).toEqual([
			'decorum',
			'glibness',
			'heartiness',
			'lorefulness',
			'luck',
			'subtlety',
			'valour',
			'wisdom_in_the_ways_of_science'
		]);
	});

	it('starts on Fine, Fine death status', () => {
		expect(monarch.startingDeathStatus).toBe('fine_fine');
	});

	it('starts on Sensible loony status', () => {
		expect(monarch.startingLoonyStatus).toBe('sensible');
	});

	it('starts with cheese (1d30)', () => {
		expect(monarch.startingCurrency).toEqual({
			currency: 'cheese',
			roll: { count: 1, sides: 30 }
		});
	});
});

describe('Monk/Nun situation', () => {
	const monkNun = SITUATION_MAP.get('monk_nun')!;

	it('exists in the situation map', () => {
		expect(monkNun).toBeDefined();
	});

	it('requires purpose and chastity', () => {
		expect(monkNun.requiredTraits).toEqual(['purpose', 'chastity']);
	});

	it('has no required retainers', () => {
		expect(monkNun.requiredRetainers).toEqual([]);
	});

	it('allows retainers', () => {
		expect(monkNun.allowRetainers).toBe(true);
	});

	it('has scribe and torchbearer as available retainers', () => {
		expect(monkNun.availableRetainers).toEqual(['scribe', 'torchbearer']);
	});

	it('has a dice pool of [14, 14, 12, 10, 8]', () => {
		expect(monkNun.dicePool).toEqual([14, 14, 12, 10, 8]);
	});

	it('allows middle and lower class', () => {
		expect(monkNun.availableClasses).toEqual(['middle', 'lower']);
	});

	it('requires lorefulness for middle class and heartiness for lower class', () => {
		expect(monkNun.classRequiredTraits).toEqual({
			middle: ['lorefulness'],
			lower: ['heartiness']
		});
	});

	it('has 5 available traits to choose from', () => {
		expect(monkNun.availableTraits).toHaveLength(5);
		expect(monkNun.availableTraits).toEqual([
			'animal_husbandry',
			'argumentation',
			'bardistry',
			'luck',
			'nimbleness'
		]);
	});

	it('is indifferent to glibness', () => {
		expect(monkNun.indifferentTraits).toEqual({ type: 'fixed', traitIds: ['glibness'] });
	});

	it('starts on Fine, Fine death status', () => {
		expect(monkNun.startingDeathStatus).toBe('fine_fine');
	});

	it('starts on Sensible loony status', () => {
		expect(monkNun.startingLoonyStatus).toBe('sensible');
	});

	it('starts with eggs (1d30)', () => {
		expect(monkNun.startingCurrency).toEqual({
			currency: 'eggs',
			roll: { count: 1, sides: 30 }
		});
	});
});

describe('Noble situation', () => {
	const noble = SITUATION_MAP.get('noble')!;

	it('exists in the situation map', () => {
		expect(noble).toBeDefined();
	});

	it('requires decorum and glibness', () => {
		expect(noble.requiredTraits).toEqual(['decorum', 'glibness']);
	});

	it('requires valet retainer', () => {
		expect(noble.requiredRetainers).toEqual(['valet']);
	});

	it('allows retainers', () => {
		expect(noble.allowRetainers).toBe(true);
	});

	it('has manservant and herald as available retainers', () => {
		expect(noble.availableRetainers).toEqual(['manservant', 'herald']);
	});

	it('has a dice pool of [18, 14, 8, 8]', () => {
		expect(noble.dicePool).toEqual([18, 14, 8, 8]);
	});

	it('only allows upper class', () => {
		expect(noble.availableClasses).toEqual(['upper']);
	});

	it('is indifferent to druidry', () => {
		expect(noble.indifferentTraits).toEqual({ type: 'fixed', traitIds: ['druidry'] });
	});

	it('has 8 available traits to choose from', () => {
		expect(noble.availableTraits).toHaveLength(8);
		expect(noble.availableTraits).toEqual([
			'argumentation',
			'authority',
			'bardistry',
			'chastity',
			'luck',
			'nimbleness',
			'strategy',
			'subtlety'
		]);
	});

	it('starts on Mr. Neutron death status', () => {
		expect(noble.startingDeathStatus).toBe('mr_neutron');
	});

	it('starts on Reginald Maudling loony status', () => {
		expect(noble.startingLoonyStatus).toBe('reginald_maudling');
	});

	it('starts with lupins (1d30)', () => {
		expect(noble.startingCurrency).toEqual({
			currency: 'lupins',
			roll: { count: 1, sides: 30 }
		});
	});
});

describe('Enchanter situation', () => {
	const enchanter = SITUATION_MAP.get('enchanter')!;

	it('exists in the situation map', () => {
		expect(enchanter).toBeDefined();
	});

	it('requires sorcery', () => {
		expect(enchanter.requiredTraits).toEqual(['sorcery']);
	});

	it('has no required retainers', () => {
		expect(enchanter.requiredRetainers).toEqual([]);
	});

	it('allows retainers', () => {
		expect(enchanter.allowRetainers).toBe(true);
	});

	it('has apprentice and homunculus as available retainers', () => {
		expect(enchanter.availableRetainers).toEqual(['apprentice', 'homunculus']);
	});

	it('must roll for traits (no dice pool)', () => {
		expect(enchanter.mustRoll).toBe(true);
		expect(enchanter.dicePool).toEqual([]);
	});

	it('allows upper, middle, and lower class', () => {
		expect(enchanter.availableClasses).toEqual(['upper', 'middle', 'lower']);
	});

	it('requires lorefulness for upper, wisdom for middle, druidry for lower', () => {
		expect(enchanter.classRequiredTraits).toEqual({
			upper: ['lorefulness'],
			middle: ['wisdom_in_the_ways_of_science'],
			lower: ['druidry']
		});
	});

	it('has 5 available traits to choose from', () => {
		expect(enchanter.availableTraits).toHaveLength(5);
		expect(enchanter.availableTraits).toEqual([
			'argumentation',
			'luck',
			'nimbleness',
			'strategy',
			'subtlety'
		]);
	});

	it('is indifferent to purpose', () => {
		expect(enchanter.indifferentTraits).toEqual({ type: 'fixed', traitIds: ['purpose'] });
	});

	it('starts on Fine, Fine death status', () => {
		expect(enchanter.startingDeathStatus).toBe('fine_fine');
	});

	it('starts on Daft loony status', () => {
		expect(enchanter.startingLoonyStatus).toBe('daft');
	});

	it('starts with gemstones (1d30)', () => {
		expect(enchanter.startingCurrency).toEqual({
			currency: 'gemstones',
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

	it('returns base required slots for cleric without class', () => {
		const slots = getRequiredSlots('cleric');
		expect(slots).toHaveLength(2);
		expect(slots[0]).toEqual({ type: 'trait', traitId: 'purpose', required: true });
		expect(slots[1]).toEqual({ type: 'trait', traitId: 'lorefulness', required: true });
	});

	it('includes decorum for cleric with upper class', () => {
		const slots = getRequiredSlots('cleric', 'upper');
		expect(slots).toHaveLength(3);
		const traitIds = slots.filter((s) => s.type === 'trait').map((s) => s.traitId);
		expect(traitIds).toContain('purpose');
		expect(traitIds).toContain('lorefulness');
		expect(traitIds).toContain('decorum');
	});

	it('includes chastity for cleric with middle class', () => {
		const slots = getRequiredSlots('cleric', 'middle');
		expect(slots).toHaveLength(3);
		const traitIds = slots.filter((s) => s.type === 'trait').map((s) => s.traitId);
		expect(traitIds).toContain('purpose');
		expect(traitIds).toContain('lorefulness');
		expect(traitIds).toContain('chastity');
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
