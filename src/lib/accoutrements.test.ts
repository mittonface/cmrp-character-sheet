import { describe, it, expect } from 'vitest';
import {
	ALL_ACCOUTREMENTS,
	ACCOUTREMENTS_BY_SLOT,
	ACCOUTREMENT_MAP,
	getAvailableAccoutrements
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
