import type { AccoutrementDef } from './types';

/** All accoutrements in the system, keyed by trait */
export const ALL_ACCOUTREMENTS: AccoutrementDef[] = [
	// --- Valour accoutrements ---
	// All valour accoutrements share a baseline +1 to valour
	{
		id: 'knightly_armour',
		label: 'Knightly Armour',
		slotId: 'valour',
		modifiers: [
			{ target: 'valour', value: 1 },
			{ target: 'authority', value: 1 }
		]
	},
	{
		id: 'shield',
		label: 'Shield',
		slotId: 'valour',
		modifiers: [
			{ target: 'valour', value: 1 },
			{ target: 'strategy', value: 1 }
		]
	},
	{
		id: 'knightly_helmet',
		label: 'Knightly Helmet',
		slotId: 'valour',
		modifiers: [
			{ target: 'valour', value: 1 },
			{ target: 'luck', value: 1 }
		]
	},
	{
		id: 'knightly_weapon',
		label: 'Knightly Weapon',
		slotId: 'valour',
		modifiers: [
			{ target: 'valour', value: 1 },
			{ target: 'argumentation', value: 1 }
		]
	},
	{
		id: 'polearm',
		label: 'Polearm',
		slotId: 'valour',
		modifiers: [
			{ target: 'valour', value: 1 },
			{ target: 'nimbleness', value: -1 }
		],
		conditionalModifiers: [{ description: '+1 to all trait rolls vs Lower-class persons' }]
	},
	{
		id: 'jousting_lance',
		label: 'Jousting Lance',
		slotId: 'valour',
		modifiers: [
			{ target: 'valour', value: 1 },
			{ target: 'animal_husbandry', value: -1 }
		],
		conditionalModifiers: [{ description: '+1 to all trait rolls vs Knights' }]
	},
	{
		id: 'longersword',
		label: 'Longersword',
		slotId: 'valour',
		modifiers: [
			{ target: 'valour', value: 1 },
			{ target: 'purpose', value: 1 }
		]
	},
	{
		id: 'fresh_fruit',
		label: 'Fresh Fruit',
		slotId: 'valour',
		modifiers: [
			{ target: 'valour', value: 1 },
			{ target: 'heartiness', value: 1 }
		]
	},
	{
		id: 'vicious_axe',
		label: 'Vicious Axe',
		slotId: 'valour',
		modifiers: [
			{ target: 'valour', value: 1 },
			{ target: 'decorum', value: -1 }
		],
		conditionalModifiers: [{ description: '+1 to all trait rolls vs Monstrosities' }]
	},
	{
		id: 'burlington_wallbanger',
		label: 'The Burlington Wallbanger',
		slotId: 'valour',
		modifiers: [
			{ target: 'valour', value: 1 },
			{ target: 'valour', value: 1 }, // extra +1 valour (total +2)
			{ target: 'subtlety', value: -1 }
		],
		specialEffects: ['One-time use: bring down a wall of any size'],
		requires: { retainer: true }
	}
];

/** Accoutrements indexed by slot ID (trait or retainer) */
export const ACCOUTREMENTS_BY_SLOT = new Map<string, AccoutrementDef[]>();
for (const acc of ALL_ACCOUTREMENTS) {
	const list = ACCOUTREMENTS_BY_SLOT.get(acc.slotId) ?? [];
	list.push(acc);
	ACCOUTREMENTS_BY_SLOT.set(acc.slotId, list);
}

/** Accoutrements indexed by ID */
export const ACCOUTREMENT_MAP = new Map<string, AccoutrementDef>(
	ALL_ACCOUTREMENTS.map((a) => [a.id, a])
);

/** Get available accoutrements for a slot (trait or retainer), filtered by prerequisites */
export function getAvailableAccoutrements(
	slotId: string,
	hasRetainer: boolean
): AccoutrementDef[] {
	const all = ACCOUTREMENTS_BY_SLOT.get(slotId) ?? [];
	return all.filter((a) => {
		if (a.requires?.retainer && !hasRetainer) return false;
		return true;
	});
}
