import { describe, it, expect } from 'vitest';
import {
	ALL_ACCOUTREMENTS,
	ACCOUTREMENTS_BY_SLOT,
	ACCOUTREMENT_MAP,
	getAvailableAccoutrements,
	getExtraAccoutrementOptions
} from './accoutrements';

describe('data integrity', () => {
	it('all accoutrements have unique IDs', () => {
		const ids = ALL_ACCOUTREMENTS.map((a) => a.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('ACCOUTREMENT_MAP contains all accoutrements', () => {
		expect(ACCOUTREMENT_MAP.size).toBe(ALL_ACCOUTREMENTS.length);
		for (const acc of ALL_ACCOUTREMENTS) {
			expect(ACCOUTREMENT_MAP.get(acc.id)).toBe(acc);
		}
	});

	it('ACCOUTREMENTS_BY_SLOT indexes all accoutrements correctly', () => {
		let total = 0;
		for (const [, list] of ACCOUTREMENTS_BY_SLOT) {
			total += list.length;
		}
		expect(total).toBe(ALL_ACCOUTREMENTS.length);
	});

	it('every accoutrement has at least one modifier', () => {
		for (const acc of ALL_ACCOUTREMENTS) {
			expect(acc.modifiers.length).toBeGreaterThan(0);
		}
	});

	it('all valour accoutrements have +1 valour as first modifier', () => {
		const valourAccs = ALL_ACCOUTREMENTS.filter((a) => a.slotId === 'valour');
		for (const acc of valourAccs) {
			expect(acc.modifiers[0]).toEqual({ target: 'valour', value: 1 });
		}
	});

	it('all animal husbandry accoutrements have +1 animal_husbandry as first modifier', () => {
		const ahAccs = ALL_ACCOUTREMENTS.filter((a) => a.slotId === 'animal_husbandry');
		expect(ahAccs.length).toBe(10);
		for (const acc of ahAccs) {
			expect(acc.modifiers[0]).toEqual({ target: 'animal_husbandry', value: 1 });
		}
	});
});

describe('specific accoutrements', () => {
	it('Burlington Wallbanger requires a retainer', () => {
		const bw = ACCOUTREMENT_MAP.get('burlington_wallbanger')!;
		expect(bw.requires).toEqual({ retainer: true });
	});

	it('Burlington Wallbanger has special effects', () => {
		const bw = ACCOUTREMENT_MAP.get('burlington_wallbanger')!;
		expect(bw.specialEffects).toContain('One-time use: bring down a wall of any size');
	});

	it('Burlington Wallbanger has +2 valour total', () => {
		const bw = ACCOUTREMENT_MAP.get('burlington_wallbanger')!;
		const valourTotal = bw.modifiers
			.filter((m) => m.target === 'valour')
			.reduce((sum, m) => sum + m.value, 0);
		expect(valourTotal).toBe(2);
	});

	it('Polearm has conditional modifiers', () => {
		const polearm = ACCOUTREMENT_MAP.get('polearm')!;
		expect(polearm.conditionalModifiers).toHaveLength(1);
		expect(polearm.conditionalModifiers![0].description).toContain('Lower-class');
	});

	it('Vicious Axe has negative decorum modifier', () => {
		const axe = ACCOUTREMENT_MAP.get('vicious_axe')!;
		const decorum = axe.modifiers.find((m) => m.target === 'decorum');
		expect(decorum).toBeDefined();
		expect(decorum!.value).toBe(-1);
	});

	it('Some Filth has conditional modifier and -1 decorum', () => {
		const filth = ACCOUTREMENT_MAP.get('some_filth')!;
		expect(filth.conditionalModifiers).toHaveLength(1);
		expect(filth.conditionalModifiers![0].description).toContain('Lower-Class');
		expect(filth.modifiers.find((m) => m.target === 'decorum')!.value).toBe(-1);
	});

	it('Farm Animal with License has +2 animal husbandry total', () => {
		const farm = ACCOUTREMENT_MAP.get('farm_animal_with_license')!;
		const ahTotal = farm.modifiers
			.filter((m) => m.target === 'animal_husbandry')
			.reduce((sum, m) => sum + m.value, 0);
		expect(ahTotal).toBe(2);
	});

	it('Cloth Sack grants extra accoutrement slot', () => {
		const sack = ACCOUTREMENT_MAP.get('cloth_sack')!;
		expect(sack.grantsExtra).toEqual({ fromAnySlot: true, excludePointy: true });
	});

	it('Pitchfork has conditional modifier vs witches/wizards', () => {
		const fork = ACCOUTREMENT_MAP.get('pitchfork')!;
		expect(fork.conditionalModifiers).toHaveLength(1);
		expect(fork.conditionalModifiers![0].description).toContain('witches');
	});

	it("Sheep's Bladder has special earthquake prevention", () => {
		const bladder = ACCOUTREMENT_MAP.get('sheeps_bladder')!;
		expect(bladder.specialEffects).toHaveLength(1);
		expect(bladder.specialEffects![0]).toContain('earthquake');
	});

	it("Webb's Wonder Lettuce has special detonation effect", () => {
		const lettuce = ACCOUTREMENT_MAP.get('webbs_wonder_lettuce')!;
		expect(lettuce.specialEffects).toHaveLength(1);
		expect(lettuce.specialEffects![0]).toContain('detonates');
	});
});

describe('getAvailableAccoutrements', () => {
	it('returns all valour accoutrements when player has a retainer', () => {
		const available = getAvailableAccoutrements('valour', true);
		const allValour = ALL_ACCOUTREMENTS.filter((a) => a.slotId === 'valour');
		expect(available).toHaveLength(allValour.length);
	});

	it('excludes retainer-required accoutrements when player has no retainer', () => {
		const available = getAvailableAccoutrements('valour', false);
		const withoutRetainerReq = ALL_ACCOUTREMENTS.filter(
			(a) => a.slotId === 'valour' && !a.requires?.retainer
		);
		expect(available).toHaveLength(withoutRetainerReq.length);
		expect(available.find((a) => a.id === 'burlington_wallbanger')).toBeUndefined();
	});

	it('returns empty for a trait with no accoutrements', () => {
		expect(getAvailableAccoutrements('sorcery', true)).toEqual([]);
	});

	it('returns empty for unknown trait', () => {
		expect(getAvailableAccoutrements('nonexistent', true)).toEqual([]);
	});
});

describe('getExtraAccoutrementOptions', () => {
	it('returns options for Cloth Sack (fromAnySlot, excludePointy)', () => {
		const options = getExtraAccoutrementOptions('cloth_sack', true);
		expect(options.length).toBeGreaterThan(0);
		// Should not include Cloth Sack itself
		expect(options.find((a) => a.id === 'cloth_sack')).toBeUndefined();
	});

	it('excludes pointy accoutrements from Cloth Sack options', () => {
		const options = getExtraAccoutrementOptions('cloth_sack', true);
		for (const acc of options) {
			expect(acc.pointy).toBeFalsy();
		}
	});

	it('returns empty for accoutrements without grantsExtra', () => {
		expect(getExtraAccoutrementOptions('knightly_armour', true)).toEqual([]);
	});

	it('returns empty for unknown accoutrement', () => {
		expect(getExtraAccoutrementOptions('nonexistent', true)).toEqual([]);
	});

	it('excludes retainer-required accoutrements when no retainer', () => {
		const withRetainer = getExtraAccoutrementOptions('cloth_sack', true);
		const withoutRetainer = getExtraAccoutrementOptions('cloth_sack', false);
		expect(withoutRetainer.length).toBeLessThanOrEqual(withRetainer.length);
		expect(withoutRetainer.find((a) => a.requires?.retainer)).toBeUndefined();
	});
});
