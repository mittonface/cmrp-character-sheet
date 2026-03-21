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
	},
	// --- Animal Husbandry accoutrements ---
	// All animal husbandry accoutrements share a baseline +1 to animal husbandry
	{
		id: 'some_filth',
		label: 'Some Filth (not lovely)',
		slotId: 'animal_husbandry',
		modifiers: [
			{ target: 'animal_husbandry', value: 1 },
			{ target: 'decorum', value: -1 }
		],
		conditionalModifiers: [{ description: '+1 to all trait rolls vs Lower-Class persons' }]
	},
	{
		id: 'farm_animal_with_license',
		label: 'Farm Animal with License',
		slotId: 'animal_husbandry',
		modifiers: [
			{ target: 'animal_husbandry', value: 1 },
			{ target: 'animal_husbandry', value: 1 } // extra +1 (total +2)
		]
	},
	{
		id: 'cloth_sack',
		label: 'Cloth Sack',
		slotId: 'animal_husbandry',
		modifiers: [
			{ target: 'animal_husbandry', value: 1 },
			{ target: 'strategy', value: 1 }
		],
		grantsExtra: { fromAnySlot: true, excludePointy: true }
	},
	{
		id: 'hoe',
		label: 'Hoe',
		slotId: 'animal_husbandry',
		modifiers: [
			{ target: 'animal_husbandry', value: 1 },
			{ target: 'chastity', value: 1 }
		]
	},
	{
		id: 'pitchfork',
		label: 'Pitchfork',
		slotId: 'animal_husbandry',
		modifiers: [
			{ target: 'animal_husbandry', value: 1 },
			{ target: 'wisdom_in_the_ways_of_science', value: -1 }
		],
		conditionalModifiers: [{ description: '+1 to all trait rolls vs witches, wizards, and the like' }]
	},
	{
		id: 'scythe',
		label: 'Scythe',
		slotId: 'animal_husbandry',
		modifiers: [
			{ target: 'animal_husbandry', value: 1 },
			{ target: 'authority', value: 1 }
		]
	},
	{
		id: 'bird_rattle',
		label: 'Bird Rattle',
		slotId: 'animal_husbandry',
		modifiers: [
			{ target: 'animal_husbandry', value: 1 },
			{ target: 'glibness', value: 1 }
		],
		specialEffects: ['Chases away all non-migratory birds']
	},
	{
		id: 'harrow',
		label: 'Harrow',
		slotId: 'animal_husbandry',
		modifiers: [
			{ target: 'animal_husbandry', value: 1 },
			{ target: 'bardistry', value: 1 }
		]
	},
	{
		id: 'sheeps_bladder',
		label: "Sheep's Bladder",
		slotId: 'animal_husbandry',
		modifiers: [
			{ target: 'animal_husbandry', value: 1 },
			{ target: 'druidry', value: 1 }
		],
		specialEffects: ['One-time use: prevent an earthquake']
	},
	{
		id: 'webbs_wonder_lettuce',
		label: "Webb's Wonder Lettuce",
		slotId: 'animal_husbandry',
		modifiers: [
			{ target: 'animal_husbandry', value: 1 },
			{ target: 'sorcery', value: 1 }
		],
		specialEffects: [
			'One-time use: set the timer and lure a single person or creature near. When it detonates, the person or creature snuffs it, and everyone is covered in charred lettuce leaves.'
		]
	},
	// --- Argumentation accoutrements ---
	// All argumentation accoutrements share a baseline +1 to argumentation
	{
		id: 'club_with_notches',
		label: "A Club with Notches in It, One For Each Argument You've Won",
		slotId: 'argumentation',
		modifiers: [
			{ target: 'argumentation', value: 1 },
			{ target: 'valour', value: 1 }
		]
	},
	{
		id: 'gavel',
		label: 'Gavel',
		slotId: 'argumentation',
		modifiers: [
			{ target: 'argumentation', value: 1 },
			{ target: 'authority', value: 1 }
		]
	},
	{
		id: 'socratic_toga',
		label: 'Socratic Toga',
		slotId: 'argumentation',
		modifiers: [
			{ target: 'argumentation', value: 1 },
			{ target: 'wisdom_in_the_ways_of_science', value: 1 }
		]
	},
	{
		id: 'black_barristers_gown',
		label: "Black Barrister's Gown",
		slotId: 'argumentation',
		modifiers: [
			{ target: 'argumentation', value: 1 },
			{ target: 'subtlety', value: 1 }
		]
	},
	{
		id: 'complicated_charts_and_diagrams',
		label: 'A Bundle of Complicated Charts and Diagrams',
		slotId: 'argumentation',
		modifiers: [
			{ target: 'argumentation', value: 1 },
			{ target: 'strategy', value: 1 }
		]
	},
	{
		id: 'heap_of_historical_records',
		label: 'A Heap of Historical Records',
		slotId: 'argumentation',
		modifiers: [
			{ target: 'argumentation', value: 1 },
			{ target: 'lorefulness', value: 1 }
		]
	},
	{
		id: 'sheaf_of_contracts',
		label: 'A Sheaf of Contracts, Forms, and Legal Documents',
		slotId: 'argumentation',
		modifiers: [
			{ target: 'argumentation', value: 1 },
			{ target: 'argumentation', value: 1 } // extra +1 (total +2)
		]
	},
	{
		id: 'portable_lectern',
		label: 'Portable Lectern',
		slotId: 'argumentation',
		modifiers: [
			{ target: 'argumentation', value: 1 },
			{ target: 'decorum', value: 1 }
		],
		specialEffects: ['Must be set up before it can be used (and the plus can be applied)']
	},
	{
		id: 'parliament_of_fowls',
		label: 'Parliament of Fowls: A Book of Debate Poetry',
		slotId: 'argumentation',
		modifiers: [
			{ target: 'argumentation', value: 1 },
			{ target: 'authority', value: -1 }
		],
		conditionalModifiers: [{ description: '+1 to all trait rolls vs bards and other entertainers' }]
	},
	{
		id: 'magna_carta',
		label: 'Magna Carta (rough draft)',
		slotId: 'argumentation',
		modifiers: [{ target: 'argumentation', value: 1 }],
		conditionalModifiers: [{ description: '+1 to all trait rolls vs upper-class persons' }],
		specialEffects: [
			'One-time use: defeat a sovereign. No roll required; the Sovereign is immediately overcome as if the required number of Deeds to defeat them had been met. They remain on the throne, but they\u2019ve lost a great deal of authority and respect\u2026 and they are no longer an obstacle to your aims.'
		]
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

/** Get available extra accoutrements granted by a primary accoutrement (e.g. Cloth Sack) */
export function getExtraAccoutrementOptions(
	primaryAccId: string,
	hasRetainer: boolean
): AccoutrementDef[] {
	const primary = ACCOUTREMENT_MAP.get(primaryAccId);
	if (!primary?.grantsExtra) return [];

	const { fromAnySlot, excludePointy } = primary.grantsExtra;
	const pool = fromAnySlot ? ALL_ACCOUTREMENTS : (ACCOUTREMENTS_BY_SLOT.get(primary.slotId) ?? []);

	return pool.filter((a) => {
		if (a.id === primaryAccId) return false; // can't pick the same accoutrement twice
		if (a.requires?.retainer && !hasRetainer) return false;
		if (excludePointy && a.pointy) return false;
		return true;
	});
}
