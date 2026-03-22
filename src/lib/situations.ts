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
	{
		id: 'animal_husbandry',
		label: 'Animal Husbandry',
		description:
			'Your knack for befriending, taming, and not being eaten by the beasts of the realm. Handy for riding horses, calming oxen, and convincing geese you mean them no harm (you do).'
	},
	{
		id: 'argumentation',
		label: 'Argumentation',
		description:
			'The fine art of being right, or at least louder than whoever disagrees. Useful in debates, legal disputes, and tavern rows about whose round it is.'
	},
	{
		id: 'authority',
		label: 'Authority',
		description:
			'How convincingly you can tell people what to do and have them actually do it. Essential for leading troops, commanding servants, and queue-jumping at the bakery.'
	},
	{
		id: 'bardistry',
		label: 'Bardistry',
		description:
			'Your talent for song, verse, and dramatic recitation. Roll this when performing, inspiring allies, or attempting to rhyme something with "Camelot" (it\'s quite a lot).'
	},
	{
		id: 'chastity',
		label: 'Chastity',
		description:
			'Your resistance to temptations of the flesh and other morally questionable diversions. Higher values indicate either genuine virtue or simply never being asked.'
	},
	{
		id: 'decorum',
		label: 'Decorum',
		description:
			'Knowing which fork to use, how to address a bishop, and when not to mention the prawns. Your grasp of etiquette, manners, and not embarrassing yourself at court.'
	},
	{
		id: 'druidry',
		label: 'Druidry',
		description:
			'Command over the ancient nature magics — talking to trees, summoning weather, and knowing exactly which mushrooms will kill you versus merely make the trees talk back.'
	},
	{
		id: 'glibness',
		label: 'Glibness',
		description:
			'The silver-tongued ability to talk your way into (and occasionally out of) absolutely anything. For charm, persuasion, and selling bridges you don\'t technically own.'
	},
	{
		id: 'heartiness',
		label: 'Heartiness',
		description:
			'How much punishment your body can absorb before it files a formal complaint. Governs stamina, constitution, and surviving whatever the cook put in the stew.'
	},
	{
		id: 'lorefulness',
		label: 'Lorefulness',
		description:
			'The accumulated knowledge rattling about in your skull — history, legends, and obscure facts about the mating habits of dragons. Roll when you need to know things.'
	},
	{
		id: 'luck',
		label: 'Luck',
		description:
			'The inexplicable favour of the universe. When skill fails, preparation fails, and common sense has long since departed, Luck is what stands between you and catastrophe.'
	},
	{
		id: 'nimbleness',
		label: 'Nimbleness',
		description:
			'Agility, dexterity, and the ability to dodge things thrown at your head. Covers acrobatics, sleight of hand, and running away with considerable elegance.'
	},
	{
		id: 'purpose',
		label: 'Purpose',
		description:
			'Sheer bloody-minded determination. When the quest is hopeless, the odds impossible, and everyone else has gone home, Purpose is what keeps you trudging forward.'
	},
	{
		id: 'sorcery',
		label: 'Sorcery',
		description:
			'Your grasp of the arcane arts — casting spells, reading magical texts, and not accidentally turning yourself into a newt. The flashier, more explosion-prone cousin of Druidry.'
	},
	{
		id: 'strategy',
		label: 'Strategy',
		description:
			'Tactical thinking for combat and beyond — whether you play the long game or charge in headlong. Also covers launching pointy projectiles from a sensible distance.'
	},
	{
		id: 'subtlety',
		label: 'Subtlety',
		description:
			'The art of not being noticed when you\'d rather not be. Sneaking, skulking, hiding, and pretending you were definitely somewhere else when the pie went missing.'
	},
	{
		id: 'valour',
		label: 'Valour',
		description:
			'Raw fighting prowess — swinging swords, bashing shields, and generally making a nuisance of yourself in melee. The trait of choice for those who prefer problems they can stab.'
	},
	{
		id: 'wisdom_in_the_ways_of_science',
		label: 'Wisdom in the Ways of Science',
		description:
			'Do you know what also floats in water? If yes, this is your trait. Covers scientific reasoning, alchemy, engineering, and determining whether someone is in fact a witch.'
	}
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
		description: 'The armour-plated icon of the age! Thundering across dale, through forest, and over bridge on noble errands and feats of derring-do. With gleaming steel in hand and a trusty manservant hauling everything else, you are the living embodiment of the Chivalric Code — which demands, among other things, that you fight fair and keep your naughty bits strictly to yourself.',
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
		description: 'The common folk: mud-caked, flea-bitten, and absolutely essential to the realm\'s economy. You possess no titles, though you do possess a certain fragrance. Unburdened by destiny or social graces, you\'re free to become nearly anything — except invited to dinner.',
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
		description: 'Be you a court alchemist with royal backing, a wild-eyed sorcerer hurling fireballs at geography, or a modest hedge wizard entertaining children with tricks involving inflated livestock organs — you command the arcane arts. Your trade is bending the forces of nature and chaos to your will, which means your own demise is seldom natural and almost always spectacularly chaotic.',
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
		description: 'At some point you decided civilisation had too many people in it, so you retreated to the wilderness to live in quiet contemplation and staggering filth. Subsisting on foraged acorns in damp caves has its perks: you are remarkably hardy, possess fearsome mental resolve, and occasionally glimpse the future. The catch? You must remain naked, or very nearly so. A brief disguise is tolerable, but prolonged clothing is not.',
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
		description: 'Not everyone can be a hero, and frankly you find the whole concept overrated. No silver spoon for you — and if there had been, you\'d have fenced it for something practical ages ago. You\'re a realist, possibly the only sensible person in a world gone completely mad. You survive on your wits, which is to say quick fingers, a silver tongue, and a reliable talent for not dying every time a plague, tyrant, or self-righteous knight rolls through.',
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
		description: 'The age teems with crowned heads — some presiding over grand fortresses, others little more than jumped-up warlords scheming in swamp castles. Heavy is the head that wears the crown, but at least you\'ll have considerably less muck on you than most. Monarchs bear more required traits than other situations: such is the burden of exalted station. They do, however, get a charming eccentricity — all the best and most memorable majesties have one.',
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
		description: 'Devout ascetics more interested in serving the divine than pestering strangers about it. Your order\'s rules dictate your conduct and, frequently, how others react to you. Work with your HoLE to establish the specifics — or simply tell them how it\'s going to be. How dare anyone come between you and God! Who do they think they are? That\'s heresy! Or perhaps thinking that\'s heresy is itself heresy. Now you see why self-flagellation was such a popular monastic pastime, right alongside brewing beer.',
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
		description: 'Fancy garments, lavish banquets, and swanning about ballrooms with all the right people — how delightful for you. As a titled (and rather entitled) member of the aristocracy, you embody elegance, good breeding, and social cunning. A natural leader, though you have no interest whatsoever in Nature and its many inconveniences. You have fewer options during creation — yes, life is terribly hard — but your posh upbringing makes you considerably harder to kill or drive round the bend.',
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
		description: 'However would history be transmitted to the future without you? You might be a warrior-poet, a soulful playwright, a dashing actor, a grand storyteller, a jaunty jongleur, or a historian but without the tweedy suit and halitosis. Whatever your art, you appeal to a Muse for inspiration and reward. On the bright side, people find you irresistibly attractive. On the downside, so do most things with teeth.',
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
		description: 'A servant of the divine, draped in fine vestments and radiating holy purpose from every pore. Whether a lofty bishop, a humble parish priest, or a righteously violent adventurer who solves theological disputes with a mace, your calling is to pry open the world and cram it full of salvation. You can probably read, too — perhaps even Latin — unless you\'re one of those appointed-by-favour types.',
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
