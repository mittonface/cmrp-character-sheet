import type {
	SituationDef,
	TraitDef,
	RetainerDef,
	CharacterSlot,
	SocialClass,
	SituationChoiceDef
} from './types';
import { SLOT_COUNT } from './types';

/** All traits in the system */
export const ALL_TRAITS: TraitDef[] = [
	{ id: 'animal_husbandry', label: 'Animal Husbandry' },
	{ id: 'argumentation', label: 'Argumentation' },
	{ id: 'authority', label: 'Authority' },
	{ id: 'bardistry', label: 'Bardistry' },
	{ id: 'chastity', label: 'Chastity' },
	{ id: 'decorum', label: 'Decorum' },
	{ id: 'druidry', label: 'Druidry' },
	{ id: 'glibness', label: 'Glibness' },
	{ id: 'heartiness', label: 'Heartiness' },
	{ id: 'lorefulness', label: 'Lorefulness' },
	{ id: 'luck', label: 'Luck' },
	{ id: 'nimbleness', label: 'Nimbleness' },
	{ id: 'purpose', label: 'Purpose' },
	{ id: 'sorcery', label: 'Sorcery' },
	{ id: 'strategy', label: 'Strategy' },
	{ id: 'subtlety', label: 'Subtlety' },
	{ id: 'valour', label: 'Valour' },
	{ id: 'wisdom_in_the_ways_of_science', label: 'Wisdom in the Ways of Science' }
];

/** All retainers in the system */
export const ALL_RETAINERS: RetainerDef[] = [
	{
		id: 'acolyte',
		label: 'Acolyte',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: ['chastity', 'lorefulness', 'nimbleness', 'purpose']
		},
		employmentRequirement: { situations: ['cleric'], sameReligion: true },
		perDiem: '1 Earnest Mutual Prayer',
		promotion: { type: 'specific', situationIds: ['cleric'] }
	},
	{
		id: 'apprentice',
		label: 'Apprentice',
		accoutrementSlots: 2,
		accoutrementTypes: { type: 'employerChoice', count: 2 },
		employmentRequirement: { classes: ['middle'] },
		perDiem: '1 Deed',
		promotion: { type: 'matchesEmployer' }
	},
	{
		id: 'cook',
		label: 'Cook',
		accoutrementSlots: 2,
		accoutrementTypes: { type: 'specific', traitIds: ['heartiness'] },
		employmentRequirement: {},
		perDiem: '1 Hearty Belch',
		promotion: { type: 'anyOfClass', classes: ['lower'] }
	},
	{
		id: 'crone',
		label: 'Crone',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: ['druidry', 'lorefulness', 'sorcery']
		},
		employmentRequirement: {},
		perDiem: '1 Apple',
		promotion: {
			type: 'specific',
			situationIds: ['churl', 'enchanter', 'eremite', 'knave']
		}
	},
	{
		id: 'fortune_teller',
		label: 'Fortune Teller',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: ['druidry', 'sorcery', 'wisdom_in_the_ways_of_science']
		},
		employmentRequirement: {},
		perDiem: '1 Fortune',
		promotion: {
			type: 'specific',
			situationIds: ['churl', 'enchanter', 'eremite', 'knave']
		}
	},
	{
		id: 'groom',
		label: 'Groom',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: ['animal_husbandry', 'heartiness', 'druidry']
		},
		employmentRequirement: {},
		perDiem: 'Just be nice to animals',
		promotion: { type: 'anyOfClass', classes: ['lower'] }
	},
	{
		id: 'herald',
		label: 'Herald',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: ['authority', 'bardistry', 'decorum', 'glibness', 'strategy']
		},
		employmentRequirement: { classes: ['upper'] },
		perDiem: '1 Announcement',
		promotion: { type: 'specific', situationIds: ['noble', 'troubadour'] }
	},
	{
		id: 'homunculus',
		label: 'Homunculus',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: ['druidry', 'sorcery', 'subtlety', 'wisdom_in_the_ways_of_science']
		},
		employmentRequirement: { situations: ['enchanter'] },
		perDiem: '1 Dollop of Something Nasty',
		promotion: {
			type: 'none',
			reason: 'It disappears in a puff of foul-smelling vapour if its employer croaks'
		}
	},
	{
		id: 'jester',
		label: 'Jester',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: [
				'argumentation',
				'bardistry',
				'glibness',
				'luck',
				'nimbleness',
				'subtlety'
			]
		},
		employmentRequirement: {},
		perDiem: '1 Jolly',
		promotion: { type: 'random' }
	},
	{
		id: 'leech',
		label: 'Leech',
		accoutrementSlots: 0,
		employmentRequirement: {},
		perDiem: "None. They're thrilled to have a patient to experim…er…treat",
		promotion: {
			type: 'specific',
			situationIds: ['cleric', 'enchanter', 'knave', 'noble']
		}
	},
	{
		id: 'manservant',
		label: 'Manservant (with coconuts)',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: ['animal_husbandry', 'heartiness', 'strategy', 'valour']
		},
		employmentRequirement: { situations: ['knight', 'monarch', 'noble'] },
		perDiem: '1 Chicken',
		promotion: { type: 'specific', situationIds: ['knave'] }
	},
	{
		id: 'merchant',
		label: 'Merchant',
		accoutrementSlots: 1,
		accoutrementTypes: { type: 'any' },
		employmentRequirement: {},
		perDiem: '1 Opportunity to do Business',
		promotion: { type: 'anyOfClass', classes: ['middle'] }
	},
	{
		id: 'minstrel',
		label: 'Minstrel',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: [
				'bardistry',
				'decorum',
				'glibness',
				'heartiness',
				'lorefulness',
				'luck'
			]
		},
		employmentRequirement: {},
		perDiem: '1 Coin',
		promotion: {
			type: 'specific',
			situationIds: ['enchanter', 'knave', 'troubadour']
		}
	},
	{
		id: 'outlaw',
		label: 'Outlaw',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: ['heartiness', 'strategy', 'subtlety', 'valour']
		},
		employmentRequirement: { classes: ['lower'] },
		perDiem: '1 Opportunity',
		promotion: { type: 'anyOfClass', classes: ['lower'], also: ['monarch'] }
	},
	{
		id: 'page',
		label: 'Page',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: ['authority', 'argumentation', 'lorefulness']
		},
		employmentRequirement: { classes: ['upper'] },
		perDiem: "None. Happy to serve, m'lord!",
		promotion: { type: 'anyOfClass', classes: ['upper'] }
	},
	{
		id: 'poet',
		label: 'Poet',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: ['bardistry', 'chastity', 'decorum', 'glibness', 'lorefulness', 'luck']
		},
		employmentRequirement: {},
		perDiem: '1 Romantic Scene',
		promotion: {
			type: 'specific',
			situationIds: ['churl', 'enchanter', 'eremite', 'knave', 'troubadour']
		}
	},
	{
		id: 'porter',
		label: 'Porter',
		accoutrementSlots: 1,
		accoutrementTypes: { type: 'any' },
		employmentRequirement: {},
		perDiem: "Scrap of food'll do. Ain't particular.",
		promotion: { type: 'anyOfClass', classes: ['lower'] }
	},
	{
		id: 'priest',
		label: 'Priest',
		accoutrementSlots: 0,
		employmentRequirement: {
			classes: ['middle', 'upper'],
			traitMinimums: [{ traitId: 'purpose', minSize: 14 }],
			sameReligion: true
		},
		perDiem: 'Tithing',
		promotion: {
			type: 'specific',
			situationIds: ['cleric', 'eremite', 'monk_nun', 'monarch', 'noble']
		}
	},
	{
		id: 'sage',
		label: 'Sage',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: ['lorefulness', 'sorcery', 'wisdom_in_the_ways_of_science']
		},
		employmentRequirement: {
			traitMinimums: [{ traitId: 'lorefulness', minSize: 14 }]
		},
		perDiem: '1 Lecture (delivered or received)',
		promotion: {
			type: 'specific',
			situationIds: ['enchanter', 'eremite', 'monk_nun']
		}
	},
	{
		id: 'scribe',
		label: 'Scribe',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: [
				'argumentation',
				'bardistry',
				'lorefulness',
				'strategy',
				'wisdom_in_the_ways_of_science'
			]
		},
		employmentRequirement: { classes: ['middle', 'upper'] },
		perDiem: '1 Something to Write on or with',
		promotion: {
			type: 'specific',
			situationIds: ['churl', 'cleric', 'eremite', 'monk_nun', 'noble', 'troubadour']
		}
	},
	{
		id: 'smith',
		label: 'Smith',
		accoutrementSlots: 0,
		employmentRequirement: {},
		perDiem: '1 Ale',
		promotion: {
			type: 'specific',
			situationIds: ['churl', 'knave', 'knight']
		}
	},
	{
		id: 'spy',
		label: 'Spy',
		accoutrementSlots: 0,
		employmentRequirement: {},
		perDiem: '1 Gemstone',
		promotion: { type: 'specific', situationIds: ['knave', 'noble'] }
	},
	{
		id: 'squire',
		label: 'Squire',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: ['authority', 'decorum', 'heartiness', 'strategy', 'valour']
		},
		employmentRequirement: { situations: ['knight'] },
		perDiem: "None. Happy to serve, m'lord!",
		promotion: {
			type: 'specific',
			situationIds: ['knight', 'monarch', 'noble']
		}
	},
	{
		id: 'torchbearer',
		label: 'Torchbearer',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: ['heartiness', 'nimbleness', 'luck', 'subtlety']
		},
		employmentRequirement: { situations: ['monk_nun'] },
		perDiem: '1 Torch',
		promotion: {
			type: 'specific',
			situationIds: ['churl', 'knave', 'monk_nun']
		}
	},
	{
		id: 'valet',
		label: 'Valet/Handmaid',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: ['chastity', 'decorum', 'glibness', 'nimbleness', 'strategy']
		},
		employmentRequirement: { classes: ['upper'] },
		perDiem: '1 Flower',
		promotion: {
			type: 'specific',
			situationIds: ['churl', 'knave', 'noble']
		}
	},
	{
		id: 'woodsman',
		label: 'Woodsman',
		accoutrementSlots: 2,
		accoutrementTypes: {
			type: 'specific',
			traitIds: ['druidry', 'heartiness', 'strategy']
		},
		employmentRequirement: { classes: ['middle', 'lower'] },
		perDiem: '1 Dead Animal',
		promotion: {
			type: 'specific',
			situationIds: ['churl', 'knave', 'knight', 'monk_nun']
		}
	}
];

export const TRAIT_MAP = new Map<string, TraitDef>(ALL_TRAITS.map((t) => [t.id, t]));
export const RETAINER_MAP = new Map<string, RetainerDef>(ALL_RETAINERS.map((r) => [r.id, r]));

/** Situation definitions */
export const SITUATIONS: SituationDef[] = [
	{
		id: 'knight',
		label: 'Knight',
		requiredTraits: ['valour', 'chastity'],
		availableTraits: [
			'animal_husbandry',
			'bardistry',
			'decorum',
			'heartiness',
			'luck',
			'purpose',
			'strategy'
		],
		requiredRetainers: ['manservant'],
		allowRetainers: true,
		availableRetainers: ['squire', 'minstrel'],
		dicePool: [18, 12, 12, 6],
		availableClasses: ['upper'],
		indifferentTraits: { type: 'fixed', traitIds: ['subtlety'] },
		startingDeathStatus: 'mr_neutron',
		startingLoonyStatus: 'daft',
		startingCurrency: { currency: 'gold', roll: { count: 1, sides: 30 } }
	},
	{
		id: 'churl',
		label: 'Churl',
		requiredTraits: ['animal_husbandry'],
		availableTraits: [
			'argumentation',
			'bardistry',
			'chastity',
			'druidry',
			'glibness',
			'heartiness',
			'luck',
			'nimbleness',
			'purpose',
			'strategy',
			'subtlety',
			'valour'
		],
		requiredRetainers: [],
		allowRetainers: false,
		dicePool: [12, 12, 10, 10, 8],
		availableClasses: ['lower'],
		indifferentTraits: { type: 'select', count: 2, exclude: ['luck'] },
		startingDeathStatus: 'getting_better',
		startingLoonyStatus: 'sensible',
		startingCurrency: { currency: 'plague_dead_bodies', roll: { count: 1, sides: 30 } }
	},
	{
		id: 'enchanter',
		label: 'Enchanter',
		requiredTraits: ['sorcery'],
		availableTraits: ['argumentation', 'luck', 'nimbleness', 'strategy', 'subtlety'],
		requiredRetainers: [],
		allowRetainers: true,
		availableRetainers: ['apprentice', 'homunculus'],
		classRequiredTraits: {
			upper: ['lorefulness'],
			middle: ['wisdom_in_the_ways_of_science'],
			lower: ['druidry']
		},
		dicePool: [],
		mustRoll: true,
		availableClasses: ['upper', 'middle', 'lower'],
		indifferentTraits: { type: 'fixed', traitIds: ['purpose'] },
		startingDeathStatus: 'fine_fine',
		startingLoonyStatus: 'daft',
		startingCurrency: { currency: 'gemstones', roll: { count: 1, sides: 30 } }
	},
	{
		id: 'eremite',
		label: 'Eremite',
		requiredTraits: ['lorefulness', 'heartiness'],
		availableTraits: [
			'animal_husbandry',
			'argumentation',
			'druidry',
			'luck',
			'nimbleness',
			'subtlety'
		],
		requiredRetainers: [],
		allowRetainers: false,
		dicePool: [16, 14, 12, 12, 6],
		availableClasses: ['lower'],
		indifferentTraits: { type: 'fixed', traitIds: ['decorum'] },
		startingDeathStatus: 'mr_neutron',
		startingLoonyStatus: 'reginald_maudling',
		startingCurrency: { currency: 'acorns', roll: { count: 1, sides: 30 } }
	},
	{
		id: 'knave',
		label: 'Knave',
		requiredTraits: ['subtlety', 'glibness', 'nimbleness'],
		availableTraits: [
			'animal_husbandry',
			'argumentation',
			'bardistry',
			'heartiness',
			'luck',
			'strategy'
		],
		requiredRetainers: [],
		allowRetainers: false,
		dicePool: [14, 12, 10, 8, 6],
		availableClasses: ['lower'],
		indifferentTraits: { type: 'fixed', traitIds: ['valour'] },
		startingDeathStatus: 'fine_fine',
		startingLoonyStatus: 'sensible',
		startingCurrency: { currency: 'whizzo_butter', roll: { count: 1, sides: 30 } }
	},
	{
		id: 'monarch',
		label: 'Monarch',
		requiredTraits: ['authority', 'purpose', 'strategy'],
		availableTraits: [
			'decorum',
			'glibness',
			'heartiness',
			'lorefulness',
			'luck',
			'subtlety',
			'valour',
			'wisdom_in_the_ways_of_science'
		],
		requiredRetainers: ['manservant'],
		allowRetainers: true,
		availableRetainers: ['valet', 'jester'],
		dicePool: [18, 14, 10, 18],
		availableClasses: ['upper'],
		indifferentTraits: { type: 'fixed', traitIds: ['argumentation'] },
		startingDeathStatus: 'fine_fine',
		startingLoonyStatus: 'sensible',
		startingCurrency: { currency: 'cheese', roll: { count: 1, sides: 30 } }
	},
	{
		id: 'monk_nun',
		label: 'Monk/Nun',
		requiredTraits: ['purpose', 'chastity'],
		availableTraits: [
			'animal_husbandry',
			'argumentation',
			'bardistry',
			'luck',
			'nimbleness'
		],
		requiredRetainers: [],
		allowRetainers: true,
		availableRetainers: ['scribe', 'torchbearer'],
		classRequiredTraits: {
			middle: ['lorefulness'],
			lower: ['heartiness']
		},
		dicePool: [14, 14, 12, 10, 8],
		availableClasses: ['middle', 'lower'],
		indifferentTraits: { type: 'fixed', traitIds: ['glibness'] },
		startingDeathStatus: 'fine_fine',
		startingLoonyStatus: 'sensible',
		startingCurrency: { currency: 'eggs', roll: { count: 1, sides: 30 } }
	},
	{
		id: 'noble',
		label: 'Noble',
		requiredTraits: ['decorum', 'glibness'],
		availableTraits: [
			'argumentation',
			'authority',
			'bardistry',
			'chastity',
			'luck',
			'nimbleness',
			'strategy',
			'subtlety'
		],
		requiredRetainers: ['valet'],
		allowRetainers: true,
		availableRetainers: ['manservant', 'herald'],
		dicePool: [18, 14, 8, 8],
		availableClasses: ['upper'],
		indifferentTraits: { type: 'fixed', traitIds: ['druidry'] },
		startingDeathStatus: 'mr_neutron',
		startingLoonyStatus: 'reginald_maudling',
		startingCurrency: { currency: 'lupins', roll: { count: 1, sides: 30 } }
	},
	{
		id: 'troubadour',
		label: 'Troubadour',
		requiredTraits: ['bardistry', 'luck'],
		availableTraits: ['animal_husbandry', 'druidry', 'heartiness', 'valour'],
		requiredRetainers: [],
		allowRetainers: true,
		availableRetainers: ['minstrel', 'poet'],
		choices: [
			{
				id: 'muse',
				label: 'Muse',
				options: [
					{ id: 'calliope', label: 'Calliope', requiredTraits: ['argumentation'] },
					{ id: 'clio', label: 'Clio', requiredTraits: ['lorefulness'] },
					{ id: 'erato', label: 'Erato', requiredTraits: ['decorum'] },
					{ id: 'euterpe', label: 'Euterpe', requiredTraits: ['subtlety'] },
					{ id: 'melpomene', label: 'Melpomene', requiredTraits: ['authority'] },
					{ id: 'polyhymnia', label: 'Polyhymnia', requiredTraits: ['strategy'] },
					{ id: 'terpsichore', label: 'Terpsichore', requiredTraits: ['nimbleness'] },
					{ id: 'thalia', label: 'Thalia', requiredTraits: ['glibness'] },
					{ id: 'urania', label: 'Urania', requiredTraits: ['wisdom_in_the_ways_of_science'] }
				]
			}
		],
		dicePool: [16, 16, 10, 6, 6],
		availableClasses: ['upper', 'middle', 'lower'],
		indifferentTraits: { type: 'fixed', traitIds: ['chastity'] },
		startingDeathStatus: 'fine_fine',
		startingLoonyStatus: 'sensible',
		startingCurrency: {
			currency: 'upper_class_twit_trading_cards',
			roll: { count: 1, sides: 30 }
		}
	},
	{
		id: 'cleric',
		label: 'Cleric',
		requiredTraits: ['purpose', 'lorefulness'],
		availableTraits: ['argumentation', 'glibness', 'luck', 'valour'],
		requiredRetainers: [],
		allowRetainers: true,
		availableRetainers: ['acolyte', 'scribe'],
		classRequiredTraits: {
			upper: ['decorum'],
			middle: ['chastity']
		},
		dicePool: [16, 14, 12, 10, 6],
		availableClasses: ['upper', 'middle'],
		indifferentTraits: { type: 'fixed', traitIds: ['wisdom_in_the_ways_of_science'] },
		startingDeathStatus: 'fine_fine',
		startingLoonyStatus: 'sensible',
		startingCurrency: { currency: 'naughty_pictures', roll: { count: 1, sides: 30 } }
	}
];

export const SITUATION_MAP = new Map<string, SituationDef>(SITUATIONS.map((s) => [s.id, s]));

/** Get the required (locked-in) slots for a situation, optionally including class-required and choice-required traits */
export function getRequiredSlots(
	situationId: string,
	socialClass?: SocialClass,
	choiceSelections?: Record<string, string>
): CharacterSlot[] {
	const situation = SITUATION_MAP.get(situationId);
	if (!situation) return [];

	const slots: CharacterSlot[] = [];
	for (const traitId of situation.requiredTraits) {
		slots.push({ type: 'trait', traitId, required: true });
	}
	if (socialClass && situation.classRequiredTraits?.[socialClass]) {
		for (const traitId of situation.classRequiredTraits[socialClass]!) {
			slots.push({ type: 'trait', traitId, required: true });
		}
	}
	if (choiceSelections && situation.choices) {
		for (const choice of situation.choices) {
			const selectedOptionId = choiceSelections[choice.id];
			if (!selectedOptionId) continue;
			const option = choice.options.find((o) => o.id === selectedOptionId);
			if (option?.requiredTraits) {
				for (const traitId of option.requiredTraits) {
					slots.push({ type: 'trait', traitId, required: true });
				}
			}
		}
	}
	for (const retainerId of situation.requiredRetainers) {
		slots.push({ type: 'retainer', retainerId, required: true, name: '' });
	}
	return slots;
}

/** Get the choices available for a situation */
export function getSituationChoices(situationId: string): SituationChoiceDef[] {
	const situation = SITUATION_MAP.get(situationId);
	return situation?.choices ?? [];
}

/** Get the number of free slots the player needs to fill */
export function getFreeSlotCount(situationId: string): number {
	const required = getRequiredSlots(situationId);
	return SLOT_COUNT - required.length;
}

/** Get the traits available for the player to pick in free slots */
export function getPickableTraits(situationId: string, currentSlots: CharacterSlot[]): TraitDef[] {
	const situation = SITUATION_MAP.get(situationId);
	if (!situation) return [];

	const alreadyPicked = new Set(
		currentSlots.filter((s) => s.type === 'trait').map((s) => s.traitId)
	);

	return situation.availableTraits
		.filter((id) => !alreadyPicked.has(id))
		.map((id) => TRAIT_MAP.get(id))
		.filter((t): t is TraitDef => t !== undefined);
}

/** Get the social classes available for a situation */
export function getAvailableClasses(situationId: string): SocialClass[] {
	const situation = SITUATION_MAP.get(situationId);
	if (!situation) return [];
	return situation.availableClasses;
}

/** Get the retainers available for the player to pick in free slots */
export function getPickableRetainers(
	situationId: string,
	currentSlots: CharacterSlot[]
): RetainerDef[] {
	const situation = SITUATION_MAP.get(situationId);
	if (!situation || !situation.allowRetainers) return [];

	const alreadyPicked = new Set(
		currentSlots.filter((s) => s.type === 'retainer').map((s) => s.retainerId)
	);

	const pool = situation.availableRetainers ?? ALL_RETAINERS.map((r) => r.id);

	return pool
		.filter((id) => !alreadyPicked.has(id))
		.map((id) => RETAINER_MAP.get(id))
		.filter((r): r is RetainerDef => r !== undefined);
}
