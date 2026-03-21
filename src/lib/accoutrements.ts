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
	},
	// --- Bardistry accoutrements ---
	// All bardistry accoutrements share a baseline +1 to bardistry
	{
		id: 'tambourine',
		label: 'Tambourine',
		slotId: 'bardistry',
		modifiers: [
			{ target: 'bardistry', value: 1 },
			{ target: 'glibness', value: 1 }
		]
	},
	{
		id: 'trumpet',
		label: 'Trumpet',
		slotId: 'bardistry',
		modifiers: [
			{ target: 'bardistry', value: 1 },
			{ target: 'valour', value: 1 }
		],
		specialEffects: ['Attracts geese when playing']
	},
	{
		id: 'shadow_lantern',
		label: 'Shadow Lantern',
		slotId: 'bardistry',
		modifiers: [
			{ target: 'bardistry', value: 1 },
			{ target: 'sorcery', value: 1 }
		],
		specialEffects: [
			'Must be lit before use. Projects images of witches, dragons, and other exciting characters.'
		]
	},
	{
		id: 'bagpipes',
		label: 'Bagpipes',
		slotId: 'bardistry',
		modifiers: [
			{ target: 'bardistry', value: 1 },
			{ target: 'heartiness', value: 1 }
		]
	},
	{
		id: 'lute',
		label: 'Lute',
		slotId: 'bardistry',
		modifiers: [
			{ target: 'bardistry', value: 1 },
			{ target: 'nimbleness', value: 1 }
		]
	},
	{
		id: 'harp',
		label: 'Harp',
		slotId: 'bardistry',
		modifiers: [
			{ target: 'bardistry', value: 1 },
			{ target: 'chastity', value: 1 }
		]
	},
	{
		id: 'red_shoes_sprinkled_with_holy_oil',
		label: 'Red Shoes Sprinkled with Holy Oil',
		slotId: 'bardistry',
		modifiers: [
			{ target: 'bardistry', value: 1 },
			{ target: 'purpose', value: 1 }
		]
	},
	{
		id: 'portable_music_stand',
		label: 'Portable Music Stand',
		slotId: 'bardistry',
		modifiers: [
			{ target: 'bardistry', value: 1 },
			{ target: 'authority', value: 1 }
		],
		specialEffects: ['Must be set up before it can be used (and the plus can be applied)']
	},
	{
		id: 'portative_organ',
		label: 'Portative Organ',
		slotId: 'bardistry',
		modifiers: [
			{ target: 'bardistry', value: 1 },
			{ target: 'animal_husbandry', value: -1 }
		],
		conditionalModifiers: [{ description: '+1 to all trait rolls vs French persons' }]
	},
	{
		id: 'positive_organ',
		label: 'Positive Organ',
		slotId: 'bardistry',
		modifiers: [{ target: 'bardistry', value: 1 }],
		conditionalModifiers: [{ description: '+1 to all trait rolls vs clergy' }],
		specialEffects: [
			'Requires a cart to transport, and a second person to operate the bellows. Once per day, you can attempt to play a rousing voluntary. Make a Bardistry roll (Strewthing/Spamming as normal). That many nearby are converted to a religion of your choice. If you Spam It, the organ explodes heretically, in addition to the normal Spam results.'
		]
	},
	// --- Chastity accoutrements ---
	// All chastity accoutrements share a baseline +1 to chastity
	{
		id: 'fashionable_tights',
		label: 'Fashionable Tights',
		slotId: 'chastity',
		modifiers: [
			{ target: 'chastity', value: 1 },
			{ target: 'decorum', value: 1 }
		]
	},
	{
		id: 'riding_crop',
		label: 'Riding Crop',
		slotId: 'chastity',
		modifiers: [
			{ target: 'chastity', value: 1 },
			{ target: 'animal_husbandry', value: 1 }
		]
	},
	{
		id: 'elaborate_codpiece',
		label: 'Elaborate Codpiece',
		slotId: 'chastity',
		modifiers: [
			{ target: 'chastity', value: 1 },
			{ target: 'decorum', value: 1 }
		],
		specialEffects: ['Nearby ducks attempt to mate with it']
	},
	{
		id: 'chastity_belt',
		label: 'Chastity Belt',
		slotId: 'chastity',
		modifiers: [
			{ target: 'chastity', value: 1 },
			{ target: 'chastity', value: 1 }, // extra +1 chastity (total +2)
			{ target: 'glibness', value: -1 }
		]
	},
	{
		id: 'mantle_and_veil_of_the_vestal_virgin',
		label: 'Mantle and Veil of the Vestal Virgin',
		slotId: 'chastity',
		modifiers: [
			{ target: 'chastity', value: 1 },
			{ target: 'druidry', value: -1 }
		],
		conditionalModifiers: [
			{
				description:
					'+1 to all trait rolls vs cads, lechers, philanderers and other naughty persons'
			}
		]
	},
	{
		id: 'quick_pitch_pavillion',
		label: 'Quick Pitch Pavillion',
		slotId: 'chastity',
		modifiers: [
			{ target: 'chastity', value: 1 },
			{ target: 'purpose', value: 1 }
		],
		specialEffects: [
			"This item is marketed as the 'Quickie,' but we're not sure why, as it's designed for on-the-go meditation and prayer only. Must be erected before use."
		]
	},
	{
		id: 'victor_mature_abdominal_corset',
		label: 'Victor Mature Abdominal Corset',
		slotId: 'chastity',
		modifiers: [
			{ target: 'chastity', value: 1 },
			{ target: 'heartiness', value: 1 }
		]
	},
	{
		id: 'bleed_it_kosher_truss',
		label: 'The Bleed-It Kosher Truss',
		slotId: 'chastity',
		modifiers: [
			{ target: 'chastity', value: 1 },
			{ target: 'heartiness', value: -1 }
		],
		conditionalModifiers: [
			{ description: '+1 to all trait rolls vs monks, nuns, hermits and other ascetics' }
		]
	},
	{
		id: 'skeleton_key',
		label: 'Skeleton Key',
		slotId: 'chastity',
		modifiers: [
			{ target: 'chastity', value: 1 },
			{ target: 'subtlety', value: 1 }
		],
		specialEffects: [
			'To be used exclusively for _locking_ chastity belts and doors between you and your lover. Why? How were you planning to use it? Well I never!'
		]
	},
	{
		id: 'hercules_hold_em_in',
		label: "The Hercules Hold-'em In",
		slotId: 'chastity',
		modifiers: [
			{ target: 'chastity', value: 1 },
			{ target: 'valour', value: 1 }
		],
		specialEffects: [
			'One-time use: remove the device, which destroys it. The rush of blood to the previously held-in parts gives you a sudden burst of vivacity. Reset Death status to your maximum, and for the remainder of the scene you may perform three Deeds on each of your turns.'
		]
	},
	// --- Authority accoutrements ---
	// All authority accoutrements share a baseline +1 to authority
	{
		id: 'gonfalon',
		label: 'Gonfalon',
		slotId: 'authority',
		modifiers: [
			{ target: 'authority', value: 1 },
			{ target: 'strategy', value: 1 }
		],
		requires: { retainer: true }
	},
	{
		id: 'buisine',
		label: 'Buisine',
		slotId: 'authority',
		modifiers: [
			{ target: 'authority', value: 1 },
			{ target: 'bardistry', value: 1 }
		],
		requires: { retainer: true }
	},
	{
		id: 'sheaf_of_pedigree_parchments',
		label: 'Sheaf of Pedigree Parchments',
		slotId: 'authority',
		modifiers: [
			{ target: 'authority', value: 1 },
			{ target: 'lorefulness', value: 1 }
		]
	},
	{
		id: 'ancestors_framed_portrait',
		label: "Ancestor's Framed Portrait",
		slotId: 'authority',
		modifiers: [
			{ target: 'authority', value: 1 },
			{ target: 'purpose', value: 1 }
		]
	},
	{
		id: 'shield_with_coat_of_arms',
		label: 'Shield Emblazoned with Coat of Arms',
		slotId: 'authority',
		modifiers: [
			{ target: 'authority', value: 1 },
			{ target: 'valour', value: 1 }
		]
	},
	{
		id: 'signet_ring',
		label: 'Signet Ring',
		slotId: 'authority',
		modifiers: [
			{ target: 'authority', value: 1 },
			{ target: 'decorum', value: 1 }
		]
	},
	{
		id: 'letter_of_the_marque',
		label: 'Letter of the Marque',
		slotId: 'authority',
		modifiers: [
			{ target: 'authority', value: 1 },
			{ target: 'decorum', value: -1 }
		],
		conditionalModifiers: [{ description: '+1 to all trait rolls vs pirates' }]
	},
	{
		id: 'applause_laughs_pennon',
		label: 'Applause/Laughs Pennon',
		slotId: 'authority',
		modifiers: [
			{ target: 'authority', value: 1 },
			{ target: 'luck', value: 1 }
		],
		specialEffects: ['Can be waved to appease an unhappy studio audience']
	},
	{
		id: 'crown',
		label: 'Crown',
		slotId: 'authority',
		modifiers: [
			{ target: 'authority', value: 1 },
			{ target: 'luck', value: -1 }
		],
		conditionalModifiers: [{ description: '+1 to all trait rolls vs upper-class persons' }]
	},
	{
		id: 'domesday_book',
		label: 'The Domesday Book',
		slotId: 'authority',
		modifiers: [
			{ target: 'authority', value: 1 },
			{ target: 'wisdom_in_the_ways_of_science', value: 1 }
		],
		specialEffects: [
			'Once per day, wield the book to levy a tax. Make an Authority roll (Strewthing/Spamming as normal). Shoppekeepers in the area must hand over d10 pieces of currency each. If carried openly, Shoppekeepers and merchants will show great disdain, or they\u2019ll be really nice and later hire someone to kill you.'
		]
	},
	// --- Decorum accoutrements ---
	// All decorum accoutrements share a baseline +1 to decorum
	{
		id: 'phrygian_cap',
		label: 'Phrygian Cap',
		slotId: 'decorum',
		modifiers: [
			{ target: 'decorum', value: 1 },
			{ target: 'nimbleness', value: 1 }
		]
	},
	{
		id: 'wimple',
		label: 'Wimple',
		slotId: 'decorum',
		modifiers: [
			{ target: 'decorum', value: 1 },
			{ target: 'purpose', value: 1 }
		]
	},
	{
		id: 'barbette',
		label: 'Barbette',
		slotId: 'decorum',
		modifiers: [
			{ target: 'decorum', value: 1 },
			{ target: 'luck', value: 1 }
		]
	},
	{
		id: 'surcoat',
		label: 'Surcoat',
		slotId: 'decorum',
		modifiers: [
			{ target: 'decorum', value: 1 },
			{ target: 'valour', value: 1 }
		]
	},
	{
		id: 'hennin',
		label: 'Hennin',
		slotId: 'decorum',
		modifiers: [
			{ target: 'decorum', value: 1 },
			{ target: 'decorum', value: 1 } // extra +1 decorum (total +2)
		],
		specialEffects: ['Decorated with precious stones. Roll 1d30 to see how many gemstones are attached.']
	},
	{
		id: 'twelve_small_apparel_bells',
		label: '12 Small Apparel Bells',
		slotId: 'decorum',
		modifiers: [
			{ target: 'decorum', value: 1 },
			{ target: 'subtlety', value: -1 }
		],
		conditionalModifiers: [{ description: '+1 to all trait rolls vs. children' }]
	},
	{
		id: 'poulaines',
		label: 'Poulaines',
		slotId: 'decorum',
		modifiers: [
			{ target: 'decorum', value: 1 },
			{ target: 'nimbleness', value: -1 }
		],
		conditionalModifiers: [{ description: '+1 to all trait rolls vs. Upper-Class persons' }]
	},
	{
		id: 'silk_cotte',
		label: 'Silk Cotte',
		slotId: 'decorum',
		modifiers: [
			{ target: 'decorum', value: 1 },
			{ target: 'glibness', value: 1 }
		]
	},
	{
		id: 'observers_book_of_princes',
		label: "The Observer's Book of Princes",
		slotId: 'decorum',
		modifiers: [
			{ target: 'decorum', value: 1 },
			{ target: 'lorefulness', value: 1 }
		]
	},
	{
		id: 'book_of_etiquette',
		label: 'The Book of Etiquette',
		slotId: 'decorum',
		modifiers: [{ target: 'decorum', value: 1 }],
		specialEffects: [
			'One-time use: burn, shred or otherwise thoroughly destroy the book. All Upper-Class persons who see you do it faint dramatically from the shock. When they come to, they\u2019ll think you\u2019re the most vile, abhorrent knave and tell all their friends about you\u2026 but you\u2019ll be long gone by then, surely.'
		]
	},
	// --- Druidry accoutrements ---
	// All druidry accoutrements share a baseline +1 to druidry
	{
		id: 'sprig_of_mistletoe',
		label: 'A Sprig of Mistletoe',
		slotId: 'druidry',
		modifiers: [{ target: 'druidry', value: 1 }],
		specialEffects: [
			'If you become No More, you immediately reincarnate in the body of a common NPC nearby, retaining all your Traits, memories, etc.'
		]
	},
	{
		id: 'bone_club',
		label: 'Bone Club',
		slotId: 'druidry',
		modifiers: [
			{ target: 'druidry', value: 1 },
			{ target: 'valour', value: 1 }
		]
	},
	{
		id: 'wildflower_press',
		label: 'Wildflower Press',
		slotId: 'druidry',
		modifiers: [
			{ target: 'druidry', value: 1 },
			{ target: 'decorum', value: 1 }
		]
	},
	{
		id: 'set_of_ogham_staves',
		label: 'Set of Ogham Staves',
		slotId: 'druidry',
		modifiers: [
			{ target: 'druidry', value: 1 },
			{ target: 'lorefulness', value: 1 }
		]
	},
	{
		id: 'apes_skull',
		label: "Ape's Skull",
		slotId: 'druidry',
		modifiers: [
			{ target: 'druidry', value: 1 },
			{ target: 'sorcery', value: 1 }
		],
		specialEffects: [
			"You occasionally have the desire to look at it and say, 'Yorick, stop messing about!' You don't know why."
		]
	},
	{
		id: 'stuffed_furry_creature',
		label: 'Stuffed Furry Creature',
		slotId: 'druidry',
		modifiers: [
			{ target: 'druidry', value: 1 },
			{ target: 'luck', value: 1 }
		]
	},
	{
		id: 'crown_of_oak_leaves',
		label: 'Crown of Oak Leaves',
		slotId: 'druidry',
		modifiers: [
			{ target: 'druidry', value: 1 },
			{ target: 'druidry', value: 1 } // extra +1 druidry (total +2)
		]
	},
	{
		id: 'miniature_wicker_man',
		label: 'Miniature Wicker Man',
		slotId: 'druidry',
		modifiers: [
			{ target: 'druidry', value: 1 },
			{ target: 'valour', value: -1 }
		],
		conditionalModifiers: [{ description: '+1 to all trait rolls vs. monotheists' }]
	},
	{
		id: 'dolmen',
		label: 'A Dolmen',
		slotId: 'druidry',
		modifiers: [
			{ target: 'druidry', value: 1 },
			{ target: 'subtlety', value: -1 }
		],
		conditionalModifiers: [{ description: '+1 to all trait rolls vs. Barbarians and other pagans' }],
		specialEffects: ['Requires a cart to transport.']
	},
	{
		id: 'sir_charles_guide_to_fauna',
		label: "Sir Charles of Butley Down's Guide to Fauna and Extra-Scary Fauna",
		slotId: 'druidry',
		modifiers: [
			{ target: 'druidry', value: 1 },
			{ target: 'wisdom_in_the_ways_of_science', value: 1 }
		],
		specialEffects: [
			"Once per day (that's really all one can bear of Sir Charles of Butley Down's writing), you can look up a Beast or Monstrosity you can see and learn everything about them. Your HoLE will provide you with the details you require."
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
