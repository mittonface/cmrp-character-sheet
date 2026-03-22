import type { AccoutrementDef, RetainerAccoutrementTypes } from './types';

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
      { target: 'authority', value: 1 },
    ],
  },
  {
    id: 'shield',
    label: 'Shield',
    slotId: 'valour',
    modifiers: [
      { target: 'valour', value: 1 },
      { target: 'strategy', value: 1 },
    ],
  },
  {
    id: 'knightly_helmet',
    label: 'Knightly Helmet',
    slotId: 'valour',
    modifiers: [
      { target: 'valour', value: 1 },
      { target: 'luck', value: 1 },
    ],
  },
  {
    id: 'knightly_weapon',
    label: 'Knightly Weapon',
    slotId: 'valour',
    modifiers: [
      { target: 'valour', value: 1 },
      { target: 'argumentation', value: 1 },
    ],
    pointy: true,
  },
  {
    id: 'polearm',
    label: 'Polearm',
    slotId: 'valour',
    modifiers: [
      { target: 'valour', value: 1 },
      { target: 'nimbleness', value: -1 },
    ],
    pointy: true,
    conditionalModifiers: [
      { description: '+1 to all trait rolls vs Lower-class persons' },
    ],
  },
  {
    id: 'jousting_lance',
    label: 'Jousting Lance',
    slotId: 'valour',
    modifiers: [
      { target: 'valour', value: 1 },
      { target: 'animal_husbandry', value: -1 },
    ],
    pointy: true,
    conditionalModifiers: [{ description: '+1 to all trait rolls vs Knights' }],
  },
  {
    id: 'longersword',
    label: 'Longersword',
    slotId: 'valour',
    modifiers: [
      { target: 'valour', value: 1 },
      { target: 'purpose', value: 1 },
    ],
    pointy: true,
  },
  {
    id: 'fresh_fruit',
    label: 'Fresh Fruit',
    slotId: 'valour',
    modifiers: [
      { target: 'valour', value: 1 },
      { target: 'heartiness', value: 1 },
    ],
  },
  {
    id: 'vicious_axe',
    label: 'Vicious Axe',
    slotId: 'valour',
    modifiers: [
      { target: 'valour', value: 1 },
      { target: 'decorum', value: -1 },
    ],
    pointy: true,
    conditionalModifiers: [
      { description: '+1 to all trait rolls vs Monstrosities' },
    ],
  },
  {
    id: 'burlington_wallbanger',
    label: 'The Burlington Wallbanger',
    slotId: 'valour',
    modifiers: [
      { target: 'valour', value: 1 },
      { target: 'valour', value: 1 }, // extra +1 valour (total +2)
      { target: 'subtlety', value: -1 },
    ],
    specialEffects: ['One-time use: bring down a wall of any size'],
    requires: { retainer: true },
  },
  // --- Animal Husbandry accoutrements ---
  // All animal husbandry accoutrements share a baseline +1 to animal husbandry
  {
    id: 'some_filth',
    label: 'Some Filth (not lovely)',
    slotId: 'animal_husbandry',
    modifiers: [
      { target: 'animal_husbandry', value: 1 },
      { target: 'decorum', value: -1 },
    ],
    conditionalModifiers: [
      { description: '+1 to all trait rolls vs Lower-Class persons' },
    ],
  },
  {
    id: 'farm_animal_with_license',
    label: 'Farm Animal with License',
    slotId: 'animal_husbandry',
    modifiers: [
      { target: 'animal_husbandry', value: 1 },
      { target: 'animal_husbandry', value: 1 }, // extra +1 (total +2)
    ],
  },
  {
    id: 'cloth_sack',
    label: 'Cloth Sack',
    slotId: 'animal_husbandry',
    modifiers: [
      { target: 'animal_husbandry', value: 1 },
      { target: 'strategy', value: 1 },
    ],
    grantsExtra: { fromAnySlot: true, excludePointy: true },
  },
  {
    id: 'hoe',
    label: 'Hoe',
    slotId: 'animal_husbandry',
    modifiers: [
      { target: 'animal_husbandry', value: 1 },
      { target: 'chastity', value: 1 },
    ],
  },
  {
    id: 'pitchfork',
    label: 'Pitchfork',
    slotId: 'animal_husbandry',
    modifiers: [
      { target: 'animal_husbandry', value: 1 },
      { target: 'wisdom_in_the_ways_of_science', value: -1 },
    ],
    pointy: true,
    conditionalModifiers: [
      {
        description: '+1 to all trait rolls vs witches, wizards, and the like',
      },
    ],
  },
  {
    id: 'scythe',
    label: 'Scythe',
    slotId: 'animal_husbandry',
    modifiers: [
      { target: 'animal_husbandry', value: 1 },
      { target: 'authority', value: 1 },
    ],
    pointy: true,
  },
  {
    id: 'bird_rattle',
    label: 'Bird Rattle',
    slotId: 'animal_husbandry',
    modifiers: [
      { target: 'animal_husbandry', value: 1 },
      { target: 'glibness', value: 1 },
    ],
    specialEffects: ['Chases away all non-migratory birds'],
  },
  {
    id: 'harrow',
    label: 'Harrow',
    slotId: 'animal_husbandry',
    modifiers: [
      { target: 'animal_husbandry', value: 1 },
      { target: 'bardistry', value: 1 },
    ],
  },
  {
    id: 'sheeps_bladder',
    label: "Sheep's Bladder",
    slotId: 'animal_husbandry',
    modifiers: [
      { target: 'animal_husbandry', value: 1 },
      { target: 'druidry', value: 1 },
    ],
    specialEffects: ['One-time use: prevent an earthquake'],
  },
  {
    id: 'webbs_wonder_lettuce',
    label: "Webb's Wonder Lettuce",
    slotId: 'animal_husbandry',
    modifiers: [
      { target: 'animal_husbandry', value: 1 },
      { target: 'sorcery', value: 1 },
    ],
    specialEffects: [
      'One-time use: set the timer and lure a single person or creature near. When it detonates, the person or creature snuffs it, and everyone is covered in charred lettuce leaves.',
    ],
  },
  // --- Argumentation accoutrements ---
  // All argumentation accoutrements share a baseline +1 to argumentation
  {
    id: 'club_with_notches',
    label: "A Club with Notches in It, One For Each Argument You've Won",
    slotId: 'argumentation',
    modifiers: [
      { target: 'argumentation', value: 1 },
      { target: 'valour', value: 1 },
    ],
  },
  {
    id: 'gavel',
    label: 'Gavel',
    slotId: 'argumentation',
    modifiers: [
      { target: 'argumentation', value: 1 },
      { target: 'authority', value: 1 },
    ],
  },
  {
    id: 'socratic_toga',
    label: 'Socratic Toga',
    slotId: 'argumentation',
    modifiers: [
      { target: 'argumentation', value: 1 },
      { target: 'wisdom_in_the_ways_of_science', value: 1 },
    ],
  },
  {
    id: 'black_barristers_gown',
    label: "Black Barrister's Gown",
    slotId: 'argumentation',
    modifiers: [
      { target: 'argumentation', value: 1 },
      { target: 'subtlety', value: 1 },
    ],
  },
  {
    id: 'complicated_charts_and_diagrams',
    label: 'A Bundle of Complicated Charts and Diagrams',
    slotId: 'argumentation',
    modifiers: [
      { target: 'argumentation', value: 1 },
      { target: 'strategy', value: 1 },
    ],
  },
  {
    id: 'heap_of_historical_records',
    label: 'A Heap of Historical Records',
    slotId: 'argumentation',
    modifiers: [
      { target: 'argumentation', value: 1 },
      { target: 'lorefulness', value: 1 },
    ],
  },
  {
    id: 'sheaf_of_contracts',
    label: 'A Sheaf of Contracts, Forms, and Legal Documents',
    slotId: 'argumentation',
    modifiers: [
      { target: 'argumentation', value: 1 },
      { target: 'argumentation', value: 1 }, // extra +1 (total +2)
    ],
  },
  {
    id: 'portable_lectern',
    label: 'Portable Lectern',
    slotId: 'argumentation',
    modifiers: [
      { target: 'argumentation', value: 1 },
      { target: 'decorum', value: 1 },
    ],
    specialEffects: [
      'Must be set up before it can be used (and the plus can be applied)',
    ],
  },
  {
    id: 'parliament_of_fowls',
    label: 'Parliament of Fowls: A Book of Debate Poetry',
    slotId: 'argumentation',
    modifiers: [
      { target: 'argumentation', value: 1 },
      { target: 'authority', value: -1 },
    ],
    conditionalModifiers: [
      { description: '+1 to all trait rolls vs bards and other entertainers' },
    ],
  },
  {
    id: 'magna_carta',
    label: 'Magna Carta (rough draft)',
    slotId: 'argumentation',
    modifiers: [{ target: 'argumentation', value: 1 }],
    conditionalModifiers: [
      { description: '+1 to all trait rolls vs upper-class persons' },
    ],
    specialEffects: [
      'One-time use: defeat a sovereign. No roll required; the Sovereign is immediately overcome as if the required number of Deeds to defeat them had been met. They remain on the throne, but they\u2019ve lost a great deal of authority and respect\u2026 and they are no longer an obstacle to your aims.',
    ],
  },
  // --- Bardistry accoutrements ---
  // All bardistry accoutrements share a baseline +1 to bardistry
  {
    id: 'tambourine',
    label: 'Tambourine',
    slotId: 'bardistry',
    modifiers: [
      { target: 'bardistry', value: 1 },
      { target: 'glibness', value: 1 },
    ],
  },
  {
    id: 'trumpet',
    label: 'Trumpet',
    slotId: 'bardistry',
    modifiers: [
      { target: 'bardistry', value: 1 },
      { target: 'valour', value: 1 },
    ],
    specialEffects: ['Attracts geese when playing'],
  },
  {
    id: 'shadow_lantern',
    label: 'Shadow Lantern',
    slotId: 'bardistry',
    modifiers: [
      { target: 'bardistry', value: 1 },
      { target: 'sorcery', value: 1 },
    ],
    specialEffects: [
      'Must be lit before use. Projects images of witches, dragons, and other exciting characters.',
    ],
  },
  {
    id: 'bagpipes',
    label: 'Bagpipes',
    slotId: 'bardistry',
    modifiers: [
      { target: 'bardistry', value: 1 },
      { target: 'heartiness', value: 1 },
    ],
  },
  {
    id: 'lute',
    label: 'Lute',
    slotId: 'bardistry',
    modifiers: [
      { target: 'bardistry', value: 1 },
      { target: 'nimbleness', value: 1 },
    ],
  },
  {
    id: 'harp',
    label: 'Harp',
    slotId: 'bardistry',
    modifiers: [
      { target: 'bardistry', value: 1 },
      { target: 'chastity', value: 1 },
    ],
  },
  {
    id: 'red_shoes_sprinkled_with_holy_oil',
    label: 'Red Shoes Sprinkled with Holy Oil',
    slotId: 'bardistry',
    modifiers: [
      { target: 'bardistry', value: 1 },
      { target: 'purpose', value: 1 },
    ],
  },
  {
    id: 'portable_music_stand',
    label: 'Portable Music Stand',
    slotId: 'bardistry',
    modifiers: [
      { target: 'bardistry', value: 1 },
      { target: 'authority', value: 1 },
    ],
    specialEffects: [
      'Must be set up before it can be used (and the plus can be applied)',
    ],
  },
  {
    id: 'portative_organ',
    label: 'Portative Organ',
    slotId: 'bardistry',
    modifiers: [
      { target: 'bardistry', value: 1 },
      { target: 'animal_husbandry', value: -1 },
    ],
    conditionalModifiers: [
      { description: '+1 to all trait rolls vs French persons' },
    ],
  },
  {
    id: 'positive_organ',
    label: 'Positive Organ',
    slotId: 'bardistry',
    modifiers: [{ target: 'bardistry', value: 1 }],
    conditionalModifiers: [{ description: '+1 to all trait rolls vs clergy' }],
    specialEffects: [
      'Requires a cart to transport, and a second person to operate the bellows. Once per day, you can attempt to play a rousing voluntary. Make a Bardistry roll (Strewthing/Spamming as normal). That many nearby are converted to a religion of your choice. If you Spam It, the organ explodes heretically, in addition to the normal Spam results.',
    ],
  },
  // --- Chastity accoutrements ---
  // All chastity accoutrements share a baseline +1 to chastity
  {
    id: 'fashionable_tights',
    label: 'Fashionable Tights',
    slotId: 'chastity',
    modifiers: [
      { target: 'chastity', value: 1 },
      { target: 'decorum', value: 1 },
    ],
  },
  {
    id: 'riding_crop',
    label: 'Riding Crop',
    slotId: 'chastity',
    modifiers: [
      { target: 'chastity', value: 1 },
      { target: 'animal_husbandry', value: 1 },
    ],
  },
  {
    id: 'elaborate_codpiece',
    label: 'Elaborate Codpiece',
    slotId: 'chastity',
    modifiers: [
      { target: 'chastity', value: 1 },
      { target: 'decorum', value: 1 },
    ],
    specialEffects: ['Nearby ducks attempt to mate with it'],
  },
  {
    id: 'chastity_belt',
    label: 'Chastity Belt',
    slotId: 'chastity',
    modifiers: [
      { target: 'chastity', value: 1 },
      { target: 'chastity', value: 1 }, // extra +1 chastity (total +2)
      { target: 'glibness', value: -1 },
    ],
  },
  {
    id: 'mantle_and_veil_of_the_vestal_virgin',
    label: 'Mantle and Veil of the Vestal Virgin',
    slotId: 'chastity',
    modifiers: [
      { target: 'chastity', value: 1 },
      { target: 'druidry', value: -1 },
    ],
    conditionalModifiers: [
      {
        description:
          '+1 to all trait rolls vs cads, lechers, philanderers and other naughty persons',
      },
    ],
  },
  {
    id: 'quick_pitch_pavillion',
    label: 'Quick Pitch Pavillion',
    slotId: 'chastity',
    modifiers: [
      { target: 'chastity', value: 1 },
      { target: 'purpose', value: 1 },
    ],
    specialEffects: [
      "This item is marketed as the 'Quickie,' but we're not sure why, as it's designed for on-the-go meditation and prayer only. Must be erected before use.",
    ],
  },
  {
    id: 'victor_mature_abdominal_corset',
    label: 'Victor Mature Abdominal Corset',
    slotId: 'chastity',
    modifiers: [
      { target: 'chastity', value: 1 },
      { target: 'heartiness', value: 1 },
    ],
  },
  {
    id: 'bleed_it_kosher_truss',
    label: 'The Bleed-It Kosher Truss',
    slotId: 'chastity',
    modifiers: [
      { target: 'chastity', value: 1 },
      { target: 'heartiness', value: -1 },
    ],
    conditionalModifiers: [
      {
        description:
          '+1 to all trait rolls vs monks, nuns, hermits and other ascetics',
      },
    ],
  },
  {
    id: 'skeleton_key',
    label: 'Skeleton Key',
    slotId: 'chastity',
    modifiers: [
      { target: 'chastity', value: 1 },
      { target: 'subtlety', value: 1 },
    ],
    specialEffects: [
      'To be used exclusively for _locking_ chastity belts and doors between you and your lover. Why? How were you planning to use it? Well I never!',
    ],
  },
  {
    id: 'hercules_hold_em_in',
    label: "The Hercules Hold-'em In",
    slotId: 'chastity',
    modifiers: [
      { target: 'chastity', value: 1 },
      { target: 'valour', value: 1 },
    ],
    specialEffects: [
      'One-time use: remove the device, which destroys it. The rush of blood to the previously held-in parts gives you a sudden burst of vivacity. Reset Death status to your maximum, and for the remainder of the scene you may perform three Deeds on each of your turns.',
    ],
  },
  // --- Authority accoutrements ---
  // All authority accoutrements share a baseline +1 to authority
  {
    id: 'gonfalon',
    label: 'Gonfalon',
    slotId: 'authority',
    modifiers: [
      { target: 'authority', value: 1 },
      { target: 'strategy', value: 1 },
    ],
    requires: { retainer: true },
  },
  {
    id: 'buisine',
    label: 'Buisine',
    slotId: 'authority',
    modifiers: [
      { target: 'authority', value: 1 },
      { target: 'bardistry', value: 1 },
    ],
    requires: { retainer: true },
  },
  {
    id: 'sheaf_of_pedigree_parchments',
    label: 'Sheaf of Pedigree Parchments',
    slotId: 'authority',
    modifiers: [
      { target: 'authority', value: 1 },
      { target: 'lorefulness', value: 1 },
    ],
  },
  {
    id: 'ancestors_framed_portrait',
    label: "Ancestor's Framed Portrait",
    slotId: 'authority',
    modifiers: [
      { target: 'authority', value: 1 },
      { target: 'purpose', value: 1 },
    ],
  },
  {
    id: 'shield_with_coat_of_arms',
    label: 'Shield Emblazoned with Coat of Arms',
    slotId: 'authority',
    modifiers: [
      { target: 'authority', value: 1 },
      { target: 'valour', value: 1 },
    ],
  },
  {
    id: 'signet_ring',
    label: 'Signet Ring',
    slotId: 'authority',
    modifiers: [
      { target: 'authority', value: 1 },
      { target: 'decorum', value: 1 },
    ],
  },
  {
    id: 'letter_of_the_marque',
    label: 'Letter of the Marque',
    slotId: 'authority',
    modifiers: [
      { target: 'authority', value: 1 },
      { target: 'decorum', value: -1 },
    ],
    conditionalModifiers: [{ description: '+1 to all trait rolls vs pirates' }],
  },
  {
    id: 'applause_laughs_pennon',
    label: 'Applause/Laughs Pennon',
    slotId: 'authority',
    modifiers: [
      { target: 'authority', value: 1 },
      { target: 'luck', value: 1 },
    ],
    specialEffects: ['Can be waved to appease an unhappy studio audience'],
  },
  {
    id: 'crown',
    label: 'Crown',
    slotId: 'authority',
    modifiers: [
      { target: 'authority', value: 1 },
      { target: 'luck', value: -1 },
    ],
    conditionalModifiers: [
      { description: '+1 to all trait rolls vs upper-class persons' },
    ],
  },
  {
    id: 'domesday_book',
    label: 'The Domesday Book',
    slotId: 'authority',
    modifiers: [
      { target: 'authority', value: 1 },
      { target: 'wisdom_in_the_ways_of_science', value: 1 },
    ],
    specialEffects: [
      'Once per day, wield the book to levy a tax. Make an Authority roll (Strewthing/Spamming as normal). Shoppekeepers in the area must hand over d10 pieces of currency each. If carried openly, Shoppekeepers and merchants will show great disdain, or they\u2019ll be really nice and later hire someone to kill you.',
    ],
  },
  // --- Decorum accoutrements ---
  // All decorum accoutrements share a baseline +1 to decorum
  {
    id: 'phrygian_cap',
    label: 'Phrygian Cap',
    slotId: 'decorum',
    modifiers: [
      { target: 'decorum', value: 1 },
      { target: 'nimbleness', value: 1 },
    ],
  },
  {
    id: 'wimple',
    label: 'Wimple',
    slotId: 'decorum',
    modifiers: [
      { target: 'decorum', value: 1 },
      { target: 'purpose', value: 1 },
    ],
  },
  {
    id: 'barbette',
    label: 'Barbette',
    slotId: 'decorum',
    modifiers: [
      { target: 'decorum', value: 1 },
      { target: 'luck', value: 1 },
    ],
  },
  {
    id: 'surcoat',
    label: 'Surcoat',
    slotId: 'decorum',
    modifiers: [
      { target: 'decorum', value: 1 },
      { target: 'valour', value: 1 },
    ],
  },
  {
    id: 'hennin',
    label: 'Hennin',
    slotId: 'decorum',
    modifiers: [
      { target: 'decorum', value: 1 },
      { target: 'decorum', value: 1 }, // extra +1 decorum (total +2)
    ],
    specialEffects: [
      'Decorated with precious stones. Roll 1d30 to see how many gemstones are attached.',
    ],
  },
  {
    id: 'twelve_small_apparel_bells',
    label: '12 Small Apparel Bells',
    slotId: 'decorum',
    modifiers: [
      { target: 'decorum', value: 1 },
      { target: 'subtlety', value: -1 },
    ],
    conditionalModifiers: [
      { description: '+1 to all trait rolls vs. children' },
    ],
  },
  {
    id: 'poulaines',
    label: 'Poulaines',
    slotId: 'decorum',
    modifiers: [
      { target: 'decorum', value: 1 },
      { target: 'nimbleness', value: -1 },
    ],
    pointy: true,
    conditionalModifiers: [
      { description: '+1 to all trait rolls vs. Upper-Class persons' },
    ],
  },
  {
    id: 'silk_cotte',
    label: 'Silk Cotte',
    slotId: 'decorum',
    modifiers: [
      { target: 'decorum', value: 1 },
      { target: 'glibness', value: 1 },
    ],
  },
  {
    id: 'observers_book_of_princes',
    label: "The Observer's Book of Princes",
    slotId: 'decorum',
    modifiers: [
      { target: 'decorum', value: 1 },
      { target: 'lorefulness', value: 1 },
    ],
  },
  {
    id: 'book_of_etiquette',
    label: 'The Book of Etiquette',
    slotId: 'decorum',
    modifiers: [{ target: 'decorum', value: 1 }],
    specialEffects: [
      'One-time use: burn, shred or otherwise thoroughly destroy the book. All Upper-Class persons who see you do it faint dramatically from the shock. When they come to, they\u2019ll think you\u2019re the most vile, abhorrent knave and tell all their friends about you\u2026 but you\u2019ll be long gone by then, surely.',
    ],
  },
  // --- Druidry accoutrements ---
  // All druidry accoutrements share a baseline +1 to druidry
  {
    id: 'sprig_of_mistletoe',
    label: 'A Sprig of Mistletoe',
    slotId: 'druidry',
    modifiers: [{ target: 'druidry', value: 1 }],
    specialEffects: [
      'If you become No More, you immediately reincarnate in the body of a common NPC nearby, retaining all your Traits, memories, etc.',
    ],
  },
  {
    id: 'bone_club',
    label: 'Bone Club',
    slotId: 'druidry',
    modifiers: [
      { target: 'druidry', value: 1 },
      { target: 'valour', value: 1 },
    ],
  },
  {
    id: 'wildflower_press',
    label: 'Wildflower Press',
    slotId: 'druidry',
    modifiers: [
      { target: 'druidry', value: 1 },
      { target: 'decorum', value: 1 },
    ],
  },
  {
    id: 'set_of_ogham_staves',
    label: 'Set of Ogham Staves',
    slotId: 'druidry',
    modifiers: [
      { target: 'druidry', value: 1 },
      { target: 'lorefulness', value: 1 },
    ],
  },
  {
    id: 'apes_skull',
    label: "Ape's Skull",
    slotId: 'druidry',
    modifiers: [
      { target: 'druidry', value: 1 },
      { target: 'sorcery', value: 1 },
    ],
    specialEffects: [
      "You occasionally have the desire to look at it and say, 'Yorick, stop messing about!' You don't know why.",
    ],
  },
  {
    id: 'stuffed_furry_creature',
    label: 'Stuffed Furry Creature',
    slotId: 'druidry',
    modifiers: [
      { target: 'druidry', value: 1 },
      { target: 'luck', value: 1 },
    ],
  },
  {
    id: 'crown_of_oak_leaves',
    label: 'Crown of Oak Leaves',
    slotId: 'druidry',
    modifiers: [
      { target: 'druidry', value: 1 },
      { target: 'druidry', value: 1 }, // extra +1 druidry (total +2)
    ],
  },
  {
    id: 'miniature_wicker_man',
    label: 'Miniature Wicker Man',
    slotId: 'druidry',
    modifiers: [
      { target: 'druidry', value: 1 },
      { target: 'valour', value: -1 },
    ],
    conditionalModifiers: [
      { description: '+1 to all trait rolls vs. monotheists' },
    ],
  },
  {
    id: 'dolmen',
    label: 'A Dolmen',
    slotId: 'druidry',
    modifiers: [
      { target: 'druidry', value: 1 },
      { target: 'subtlety', value: -1 },
    ],
    conditionalModifiers: [
      { description: '+1 to all trait rolls vs. Barbarians and other pagans' },
    ],
    specialEffects: ['Requires a cart to transport.'],
  },
  {
    id: 'sir_charles_guide_to_fauna',
    label: "Sir Charles of Butley Down's Guide to Fauna and Extra-Scary Fauna",
    slotId: 'druidry',
    modifiers: [
      { target: 'druidry', value: 1 },
      { target: 'wisdom_in_the_ways_of_science', value: 1 },
    ],
    specialEffects: [
      "Once per day (that's really all one can bear of Sir Charles of Butley Down's writing), you can look up a Beast or Monstrosity you can see and learn everything about them. Your HoLE will provide you with the details you require.",
    ],
  },

  // --- Glibness accoutrements ---
  // All glibness accoutrements share a baseline +1 to glibness
  {
    id: 'a_box',
    label: 'A Box',
    slotId: 'glibness',
    modifiers: [{ target: 'glibness', value: 1 }],
    grantsExtra: { fromAnySlot: true, excludePointy: false },
    specialEffects: [
      'Must be stood upon before it can be used (and the plus can be applied)',
    ],
  },
  {
    id: 'vom_it_brand_cold_sick',
    label: 'VOM-IT Brand Cold Sick (lump of)',
    slotId: 'glibness',
    modifiers: [
      { target: 'glibness', value: 1 },
      { target: 'sorcery', value: 1 },
    ],
  },
  {
    id: 'leather_jack_of_scum',
    label: 'Leather Jack of Scum',
    slotId: 'glibness',
    modifiers: [
      { target: 'glibness', value: 1 },
      { target: 'heartiness', value: 1 },
    ],
    specialEffects: [
      "Must be slathered on one's hair before it can be used (and the plus can be applied). May also be used as foot ointment or salad dressing.",
    ],
  },
  {
    id: 'removable_moustache',
    label: 'Removable Moustache',
    slotId: 'glibness',
    modifiers: [
      { target: 'glibness', value: 1 },
      { target: 'chastity', value: -1 },
    ],
    conditionalModifiers: [
      { description: '+1 to all trait rolls vs. French persons' },
    ],
  },
  {
    id: 'fools_hat',
    label: "Fool's Hat",
    slotId: 'glibness',
    modifiers: [
      { target: 'glibness', value: 1 },
      { target: 'authority', value: -1 },
    ],
    conditionalModifiers: [
      { description: '+1 to all trait rolls vs. Upper-Class persons' },
    ],
  },
  {
    id: 'sir_dagonet_mask',
    label: 'Sir Dagonet Mask',
    slotId: 'glibness',
    modifiers: [{ target: 'glibness', value: 1 }],
    conditionalModifiers: [
      { description: '+1 to all trait rolls vs. Knights of the Round Table' },
    ],
  },
  {
    id: 'turkish_little_rude_plant',
    label: 'Turkish Little Rude Plant',
    slotId: 'glibness',
    modifiers: [
      { target: 'glibness', value: 1 },
      { target: 'druidry', value: 1 },
    ],
  },
  {
    id: 'punch_and_judy_puppets',
    label: 'Punch and Judy Puppets',
    slotId: 'glibness',
    modifiers: [
      { target: 'glibness', value: 1 },
      { target: 'authority', value: -1 },
    ],
    conditionalModifiers: [
      {
        description:
          '+1 to all trait rolls vs. Lower-Class persons and children',
      },
    ],
  },
  {
    id: 'motley_full_body_tights',
    label: 'Motley Full-Body Tights',
    slotId: 'glibness',
    modifiers: [
      { target: 'glibness', value: 1 },
      { target: 'nimbleness', value: 1 },
    ],
  },
  {
    id: 'johnsons_novelties',
    label: "Johnson's Novelties",
    slotId: 'glibness',
    modifiers: [
      { target: 'glibness', value: 1 },
      { target: 'glibness', value: 1 },
    ],
    specialEffects: [
      "One-time use: break out the full kit at once. Make a Glibness roll (Strewthing/Spamming as normal). On a 2+, that number of people who hold neutral or negative opinions of you and your companions regard you as welcome guests. If you Spam it, everyone is covered in vomit, fungus, alcohol, snakes, skunk juice, and pooh pooh, and they're rather poor sports about the whole thing. This in addition to the normal Spam results.",
    ],
  },

  // --- Heartiness accoutrements ---
  // All heartiness accoutrements share a baseline +1 to heartiness
  {
    id: 'animal_companion',
    label: 'Animal Companion',
    slotId: 'heartiness',
    modifiers: [
      { target: 'heartiness', value: 1 },
      { target: 'animal_husbandry', value: 1 },
    ],
  },
  {
    id: 'wooden_churn_of_bodily_substance',
    label: 'A Wooden Churn of Bodily Substance',
    slotId: 'heartiness',
    modifiers: [
      { target: 'heartiness', value: 1 },
      { target: 'wisdom_in_the_ways_of_science', value: -1 },
    ],
    conditionalModifiers: [{ description: '+1 to all trait rolls vs. Gumbys' }],
  },
  {
    id: 'flint_and_steel',
    label: 'Flint & Steel',
    slotId: 'heartiness',
    modifiers: [
      { target: 'heartiness', value: 1 },
      { target: 'luck', value: 1 },
    ],
    specialEffects: ['Can be used to make fire.'],
  },
  {
    id: 'lamprey_loose_cover',
    label: 'Lamprey Loose Cover',
    slotId: 'heartiness',
    modifiers: [
      { target: 'heartiness', value: 1 },
      { target: 'nimbleness', value: 1 },
    ],
    specialEffects: [
      'One-size-fits-all outerwear of homespun that stops dust getting in the cracks and crevices that nature left unprotected.',
    ],
  },
  {
    id: 'sack_of_truffles',
    label: 'Sack of Truffles',
    slotId: 'heartiness',
    modifiers: [
      { target: 'heartiness', value: 1 },
      { target: 'druidry', value: 1 },
    ],
    specialEffects: ['Nearby pigs follow you around.'],
  },
  {
    id: 'cupping_cups',
    label: 'Cupping Cups',
    slotId: 'heartiness',
    modifiers: [
      { target: 'heartiness', value: 1 },
      { target: 'bardistry', value: 1 },
    ],
    specialEffects: [
      'Heated and placed on skin to create a suction effect and stimulate blood flow.',
    ],
  },
  {
    id: 'surgical_stockings',
    label: 'Surgical Stockings',
    slotId: 'heartiness',
    modifiers: [
      { target: 'heartiness', value: 1 },
      { target: 'chastity', value: 1 },
      { target: 'decorum', value: -1 },
    ],
  },
  {
    id: 'sack_of_wilkinsons_laxative_cereal',
    label: "Sack of Wilkinson's Number 8 Laxative Cereal",
    slotId: 'heartiness',
    modifiers: [{ target: 'heartiness', value: 1 }],
    specialEffects: [
      'One-time use: ingest the whole sack at once to flush out any poison, illness, or curse. Not recommended for use within two miles of polite company.',
    ],
  },
  {
    id: 'rancid_polecat_no_2',
    label: 'Rancid Polecat No. 2 (eau de toilette)',
    slotId: 'heartiness',
    modifiers: [
      { target: 'heartiness', value: 1 },
      { target: 'chastity', value: 1 },
    ],
    specialEffects: [
      'One-time use: douse yourself with an entire bottle to repel Beasts for one day.',
    ],
  },
  {
    id: 'sack_of_ano_weet_pow',
    label: 'Sack of Ano-Weet POW!',
    slotId: 'heartiness',
    modifiers: [
      { target: 'heartiness', value: 1 },
      { target: 'purpose', value: 1 },
      { target: 'decorum', value: -1 },
    ],
    specialEffects: [
      "One-time use: remove the miniature Pope that comes in each sack and make a d30 roll on the Cleric's Spiffing Serious Ability table, no matter what your Situation is.",
    ],
  },

  // --- Lorefulness accoutrements ---
  // All lorefulness accoutrements share a baseline +1 to lorefulness
  {
    id: 'short_history_of_history_books',
    label: 'A Short History of History Books by R.T. Boredom',
    slotId: 'lorefulness',
    modifiers: [
      { target: 'lorefulness', value: 1 },
      { target: 'argumentation', value: -1 },
    ],
    conditionalModifiers: [
      {
        description:
          '+1 to all Trait rolls vs. scholars, tutors, researchers, and the like',
      },
    ],
  },
  {
    id: 'pileus',
    label: 'Pileus',
    slotId: 'lorefulness',
    modifiers: [
      { target: 'lorefulness', value: 1 },
      { target: 'decorum', value: 1 },
    ],
  },
  {
    id: 'short_history_of_chairs',
    label:
      "Martin of Bedford's A Short History of Chairs, Tables, and Pieces of Wood",
    slotId: 'lorefulness',
    modifiers: [
      { target: 'lorefulness', value: 1 },
      { target: 'glibness', value: -1 },
    ],
    conditionalModifiers: [
      {
        description:
          '+1 to all Trait rolls vs. Burghers and other Middle-Class persons',
      },
    ],
  },
  {
    id: 'forbidden_hungarian_phrase_book',
    label: "Yalt's Forbidden Hungarian Phrase Book",
    slotId: 'lorefulness',
    modifiers: [
      { target: 'lorefulness', value: 1 },
      { target: 'glibness', value: 1 },
    ],
  },
  {
    id: 'autobiography_of_st_stephen',
    label: 'Stone Me: The Autobiography of St. Stephen',
    slotId: 'lorefulness',
    modifiers: [
      { target: 'lorefulness', value: 1 },
      { target: 'purpose', value: 1 },
    ],
  },
  {
    id: 'dynamo_tension_course',
    label: '78-page Dynamo Tension Muscle-Building Course',
    slotId: 'lorefulness',
    modifiers: [
      { target: 'lorefulness', value: 1 },
      { target: 'valour', value: 1 },
    ],
  },
  {
    id: 'clay_cup_sumerian',
    label: 'Clay Cup, Sumerian, 4th Dynasty',
    slotId: 'lorefulness',
    modifiers: [
      { target: 'lorefulness', value: 1 },
      { target: 'sorcery', value: 1 },
    ],
    specialEffects: ['Often mistaken for the Holy Grail.'],
  },
  {
    id: 'book_of_armaments',
    label: 'The Book of Armaments',
    slotId: 'lorefulness',
    modifiers: [
      { target: 'lorefulness', value: 1 },
      { target: 'strategy', value: 1 },
    ],
  },
  {
    id: 'immovable_type_printing_press',
    label: 'Immovable-Type Printing Press',
    slotId: 'lorefulness',
    modifiers: [
      { target: 'lorefulness', value: 1 },
      { target: 'animal_husbandry', value: 1 },
    ],
    specialEffects: ['Requires a cart to transport.'],
  },
  {
    id: 'world_encyclopaedia_of_carnal_knowledge',
    label: 'The World Encyclopaedia of Carnal Knowledge',
    slotId: 'lorefulness',
    modifiers: [
      { target: 'lorefulness', value: 1 },
      { target: 'wisdom_in_the_ways_of_science', value: 1 },
      { target: 'chastity', value: -1 },
    ],
    specialEffects: [
      "Once per day, consult the book to produce a fact that causes all celibates, ascetics, and abstainers within hearing distance to be deeply depressed about what they're missing. They are unable to do anything but sit and pout for the rest of the day.",
      'One-time use: rip out all the illustrations (destroying the book) to produce 100 Naughty Pictures (a Currency).',
    ],
  },

  // --- Luck accoutrements ---
  // All luck accoutrements share a baseline +1 to luck
  {
    id: 'rabbits_foot',
    label: "Rabbit's Foot",
    slotId: 'luck',
    modifiers: [
      { target: 'luck', value: 1 },
      { target: 'luck', value: 1 },
      { target: 'animal_husbandry', value: -1 },
    ],
  },
  {
    id: 'horseshoe',
    label: 'Horseshoe',
    slotId: 'luck',
    modifiers: [
      { target: 'luck', value: 1 },
      { target: 'nimbleness', value: 1 },
    ],
  },
  {
    id: 'four_leaf_clover',
    label: 'Four-Leaf Clover',
    slotId: 'luck',
    modifiers: [
      { target: 'luck', value: 1 },
      { target: 'bardistry', value: 1 },
    ],
  },
  {
    id: 'pagan_goddess_figurine',
    label: 'Pagan Goddess Figurine (tiny)',
    slotId: 'luck',
    modifiers: [
      { target: 'luck', value: 1 },
      { target: 'purpose', value: -1 },
    ],
    conditionalModifiers: [
      { description: '+1 to all Trait rolls vs. Barbarians and other pagans' },
    ],
  },
  {
    id: 'pouch_of_fine_salt',
    label: 'Pouch of Fine Salt',
    slotId: 'luck',
    modifiers: [
      { target: 'luck', value: 1 },
      { target: 'decorum', value: 1 },
    ],
  },
  {
    id: 'garden_gnome',
    label: 'Garden Gnome',
    slotId: 'luck',
    modifiers: [
      { target: 'luck', value: 1 },
      { target: 'authority', value: -1 },
    ],
    conditionalModifiers: [
      { description: '+1 to all Trait rolls vs. Vikings' },
    ],
  },
  {
    id: 'pouch_of_13_sacred_acorns',
    label: 'Pouch of 13 Sacred Acorns',
    slotId: 'luck',
    modifiers: [
      { target: 'luck', value: 1 },
      { target: 'druidry', value: 1 },
    ],
    specialEffects: [
      'You can spend these as Currency, but once one or more is removed from the pouch, the item loses its plus and all the Acorns are just Currency.',
    ],
  },
  {
    id: 'deer_antler_hat',
    label: 'Deer Antler Hat',
    slotId: 'luck',
    modifiers: [
      { target: 'luck', value: 1 },
      { target: 'subtlety', value: -1 },
    ],
    pointy: true,
    conditionalModifiers: [
      { description: "+1 to all Trait rolls vs. Knights Who Say 'Ni'" },
    ],
  },
  {
    id: 'amber',
    label: 'Amber',
    slotId: 'luck',
    modifiers: [
      { target: 'luck', value: 1 },
      { target: 'wisdom_in_the_ways_of_science', value: 1 },
    ],
  },
  {
    id: 'stone_gargoyle',
    label: 'Stone Gargoyle',
    slotId: 'luck',
    modifiers: [
      { target: 'luck', value: 1 },
      { target: 'purpose', value: 1 },
    ],
    specialEffects: [
      'Requires a cart to transport.',
      'One-time use: the gargoyle wakes up and makes an extra-ugly face. One Monstrosity that sees it scarpers with the gargoyle in pursuit. Neither are ever seen again, and the Monstrosity is defeated, as if through Deeds.',
    ],
  },

  // --- Nimbleness accoutrements ---
  // All nimbleness accoutrements share a baseline +1 to nimbleness
  {
    id: 'balancing_staff',
    label: 'Balancing Staff',
    slotId: 'nimbleness',
    modifiers: [
      { target: 'nimbleness', value: 1 },
      { target: 'strategy', value: 1 },
    ],
  },
  {
    id: 'embroidered_silk_handkerchiefs',
    label: 'Set of Embroidered Silk Handkerchiefs',
    slotId: 'nimbleness',
    modifiers: [
      { target: 'nimbleness', value: 1 },
      { target: 'decorum', value: 1 },
    ],
  },
  {
    id: 'dashing_cape',
    label: 'Dashing Cape with Extra Flowiness',
    slotId: 'nimbleness',
    modifiers: [
      { target: 'nimbleness', value: 1 },
      { target: 'valour', value: 1 },
    ],
  },
  {
    id: 'halitosis_brand_body_rub',
    label: 'Halitosis-Brand Body Rub',
    slotId: 'nimbleness',
    modifiers: [
      { target: 'nimbleness', value: 1 },
      { target: 'decorum', value: -1 },
    ],
    conditionalModifiers: [{ description: '+1 to all Trait rolls vs. Gumbys' }],
  },
  {
    id: 'split_crotch_breeches',
    label: 'Split-Crotch Breeches',
    slotId: 'nimbleness',
    modifiers: [
      { target: 'nimbleness', value: 1 },
      { target: 'nimbleness', value: 1 },
    ],
  },
  {
    id: 'fingerless_gloves',
    label: 'Fingerless Gloves',
    slotId: 'nimbleness',
    modifiers: [
      { target: 'nimbleness', value: 1 },
      { target: 'bardistry', value: 1 },
    ],
  },
  {
    id: 'eel_skin_boots',
    label: 'Eel-Skin Boots',
    slotId: 'nimbleness',
    modifiers: [
      { target: 'nimbleness', value: 1 },
      { target: 'subtlety', value: 1 },
    ],
  },
  {
    id: 'pixie_hat_with_pointy_ears',
    label: 'Pixie Hat with Pointy Ears',
    slotId: 'nimbleness',
    modifiers: [
      { target: 'nimbleness', value: 1 },
      { target: 'druidry', value: 1 },
      { target: 'sorcery', value: -1 },
    ],
    pointy: true,
    specialEffects: ['Pixies attack on sight.'],
  },
  {
    id: 'llama_skin_gloves',
    label: 'Llama-Skin Gloves',
    slotId: 'nimbleness',
    modifiers: [
      { target: 'nimbleness', value: 1 },
      { target: 'glibness', value: 1 },
    ],
    specialEffects: ['Llamas attack on sight.'],
  },
  {
    id: 'pouch_of_rid_a_weasel',
    label: 'Pouch of Rid-a-Weasel-Stoat-Rat-Mouse-Rabbitex',
    slotId: 'nimbleness',
    modifiers: [
      { target: 'nimbleness', value: 1 },
      { target: 'heartiness', value: -1 },
    ],
    conditionalModifiers: [
      { description: '+1 to all Trait rolls vs. small woodland creatures' },
    ],
    specialEffects: [
      'A talcum powder for grip enhancement.',
      'One-time use: cover body with the entire contents of the pouch to repel all small woodland creatures, rodents, and rodential persons within a mile, for one day.',
    ],
  },

  // --- Purpose accoutrements ---
  // All purpose accoutrements share a baseline +1 to purpose
  {
    id: 'pate_plank',
    label: 'Pate Plank',
    slotId: 'purpose',
    modifiers: [
      { target: 'purpose', value: 1 },
      { target: 'wisdom_in_the_ways_of_science', value: -1 },
    ],
    conditionalModifiers: [{ description: '+1 to all Trait rolls vs. clergy' }],
    specialEffects: [
      'One-time use: whilst chanting in Latin, break it over your head. Suffer 1 bit of Death, move Purpose four degrees towards Serious, and move all other Traits one degree towards Silly.',
    ],
  },
  {
    id: 'hair_shirt',
    label: 'Hair Shirt',
    slotId: 'purpose',
    modifiers: [
      { target: 'purpose', value: 1 },
      { target: 'animal_husbandry', value: 1 },
    ],
  },
  {
    id: 'self_scourge',
    label: 'Self-Scourge',
    slotId: 'purpose',
    modifiers: [
      { target: 'purpose', value: 1 },
      { target: 'chastity', value: 1 },
    ],
  },
  {
    id: 'ceremonial_robes',
    label: 'Ceremonial Robes',
    slotId: 'purpose',
    modifiers: [
      { target: 'purpose', value: 1 },
      { target: 'decorum', value: 1 },
    ],
  },
  {
    id: 'censer_with_incense',
    label: 'Censer with Incense',
    slotId: 'purpose',
    modifiers: [
      { target: 'purpose', value: 1 },
      { target: 'heartiness', value: 1 },
    ],
  },
  {
    id: 'hymnal',
    label: 'Hymnal',
    slotId: 'purpose',
    modifiers: [
      { target: 'purpose', value: 1 },
      { target: 'bardistry', value: 1 },
    ],
  },
  {
    id: 'mitre',
    label: 'Mitre',
    slotId: 'purpose',
    modifiers: [
      { target: 'purpose', value: 1 },
      { target: 'authority', value: 1 },
    ],
  },
  {
    id: 'papal_bull',
    label: 'Papal Bull',
    slotId: 'purpose',
    modifiers: [
      { target: 'purpose', value: 1 },
      { target: 'glibness', value: -1 },
    ],
    conditionalModifiers: [
      { description: '+1 to all Trait rolls vs. Catholic persons' },
    ],
    specialEffects: [
      "One-time use: break the seal and read the contents. Make a Luck roll (Strewthing/Spamming as normal). If the result is 4+, your sins are forgiven. Return all your Demerits. If the result is 2-3, it's just some spilled wine. Maybe blood. Whatever. If it's a 1, you are declared a heretic!",
    ],
  },
  {
    id: 'a_halo_and_two_cherubs',
    label: 'A Halo and Two Cherubs',
    slotId: 'purpose',
    modifiers: [
      { target: 'purpose', value: 1 },
      { target: 'subtlety', value: -1 },
    ],
    conditionalModifiers: [
      { description: '+1 to all Trait rolls vs. painters' },
    ],
  },
  {
    id: 'holy_hand_grenade_of_antioch',
    label: 'Holy Hand Grenade of Antioch',
    slotId: 'purpose',
    modifiers: [
      { target: 'purpose', value: 1 },
      { target: 'strategy', value: 1 },
      { target: 'valour', value: -1 },
    ],
    specialEffects: [
      "One-time use: make a Strategy roll (Strewthing/Spamming as normal). If the result is 3 or 5, you've miscounted; it explodes in your hand, and you take 1 bit of Death. Otherwise (assuming it's not a Spam), you lobbeth the grenade, yea verily, with much accuracy, and cause a single person or creature to snuff it.",
    ],
  },

  // --- Sorcery accoutrements ---
  // All sorcery accoutrements share a baseline +1 to sorcery
  {
    id: 'staff',
    label: 'Staff',
    slotId: 'sorcery',
    modifiers: [
      { target: 'sorcery', value: 1 },
      { target: 'heartiness', value: 1 },
    ],
    specialEffects: ['Sheep tend to follow you around.'],
  },
  {
    id: 'wand',
    label: 'Wand',
    slotId: 'sorcery',
    modifiers: [
      { target: 'sorcery', value: 1 },
      { target: 'sorcery', value: 1 },
    ],
  },
  {
    id: 'shrunken_head',
    label: 'Shrunken Head',
    slotId: 'sorcery',
    modifiers: [
      { target: 'sorcery', value: 1 },
      { target: 'lorefulness', value: 1 },
    ],
  },
  {
    id: 'pointy_hat',
    label: 'Pointy Hat',
    slotId: 'sorcery',
    modifiers: [
      { target: 'sorcery', value: 1 },
      { target: 'wisdom_in_the_ways_of_science', value: 1 },
    ],
  },
  {
    id: 'cauldron',
    label: 'Cauldron',
    slotId: 'sorcery',
    modifiers: [
      { target: 'sorcery', value: 1 },
      { target: 'nimbleness', value: -1 },
    ],
    conditionalModifiers: [
      { description: '+1 to all Trait rolls vs. Witches and cooks' },
    ],
  },
  {
    id: 'feather_boa',
    label: 'Feather Boa',
    slotId: 'sorcery',
    modifiers: [
      { target: 'sorcery', value: 1 },
      { target: 'glibness', value: 1 },
    ],
  },
  {
    id: 'starry_robes',
    label: 'Starry Robes',
    slotId: 'sorcery',
    modifiers: [
      { target: 'sorcery', value: 1 },
      { target: 'purpose', value: 1 },
    ],
  },
  {
    id: 'crystal_ball',
    label: 'Crystal Ball',
    slotId: 'sorcery',
    modifiers: [
      { target: 'sorcery', value: 1 },
      { target: 'strategy', value: 1 },
    ],
    specialEffects: ['If anyone sees it, they ask you to tell their fortune.'],
  },
  {
    id: 'interspace_toothbrush',
    label: 'Interspace Toothbrush',
    slotId: 'sorcery',
    modifiers: [
      { target: 'sorcery', value: 1 },
      { target: 'decorum', value: -1 },
    ],
    conditionalModifiers: [{ description: '+1 to all Trait rolls vs. Møøses' }],
    specialEffects: ['Møøses attack you on sight.'],
  },
  {
    id: 'police_wand',
    label: 'Police Wand',
    slotId: 'sorcery',
    modifiers: [
      { target: 'sorcery', value: 1 },
      { target: 'authority', value: 1 },
    ],
    conditionalModifiers: [
      {
        description:
          '+3 to all Trait rolls vs. outlaws, criminals, bandits, and the like',
      },
    ],
    specialEffects: [
      'One-time use (roll a d6 to see which effect you get). 1 = Turn yourself invisible for the day. 2 = Commit one act of time-travelling or teleportation. 3 = Turn all nearby bandits and other violent criminals into frogs. 4 = Make your whole party invisible for the day. 5 = Must help all old ladies you encounter across the road. For the rest of your life. 6 = Choose one from 1-5.',
    ],
  },

  // --- Strategy accoutrements ---
  // All strategy accoutrements share a baseline +1 to strategy
  {
    id: 'book_of_trojan_woodland_creatures',
    label: 'Book of Trojan Woodland Creatures',
    slotId: 'strategy',
    modifiers: [
      { target: 'strategy', value: 1 },
      { target: 'lorefulness', value: 1 },
    ],
  },
  {
    id: 'sling',
    label: 'Sling',
    slotId: 'strategy',
    modifiers: [
      { target: 'strategy', value: 1 },
      { target: 'druidry', value: 1 },
    ],
  },
  {
    id: 'dice',
    label: 'Dice',
    slotId: 'strategy',
    modifiers: [
      { target: 'strategy', value: 1 },
      { target: 'luck', value: 1 },
    ],
  },
  {
    id: 'ladder',
    label: 'Ladder',
    slotId: 'strategy',
    modifiers: [
      { target: 'strategy', value: 1 },
      { target: 'authority', value: 1 },
    ],
  },
  {
    id: 'longbow',
    label: 'Longbow',
    slotId: 'strategy',
    modifiers: [
      { target: 'strategy', value: 1 },
      { target: 'subtlety', value: -1 },
    ],
    pointy: true,
    conditionalModifiers: [
      { description: '+1 to all rolls vs. French persons' },
    ],
  },
  {
    id: 'chessboard',
    label: 'Chessboard',
    slotId: 'strategy',
    modifiers: [
      { target: 'strategy', value: 1 },
      { target: 'decorum', value: 1 },
    ],
  },
  {
    id: 'fetchez_la_vache_set',
    label: 'Fetchez la Vache Set (travel size)',
    slotId: 'strategy',
    modifiers: [
      { target: 'strategy', value: 1 },
      { target: 'animal_husbandry', value: -1 },
    ],
    conditionalModifiers: [
      {
        description:
          '+1 to all Trait rolls while playing (life-size) Fetchez la Vache',
      },
    ],
  },
  {
    id: 'crossbow',
    label: 'Crossbow',
    slotId: 'strategy',
    modifiers: [
      { target: 'strategy', value: 1 },
      { target: 'nimbleness', value: -1 },
    ],
    pointy: true,
    conditionalModifiers: [
      { description: '+1 to all rolls vs. armoured persons' },
    ],
  },
  {
    id: 'maurices_strategikon',
    label: "Maurice's Strategikon",
    slotId: 'strategy',
    modifiers: [
      { target: 'strategy', value: 1 },
      { target: 'heartiness', value: 1 },
    ],
  },
  {
    id: 'siege_engine',
    label: 'Siege Engine',
    slotId: 'strategy',
    modifiers: [{ target: 'strategy', value: 1 }],
    conditionalModifiers: [
      { description: '+1 to all Trait rolls vs. becastled persons' },
    ],
    specialEffects: [
      'Requires four people to haul and operate. Roll a d6 to determine type. 1 = Battering ram. 2 = Ballista. 3 = Catapult. 4 = Trebuchet. 5 = Portable drawbridge. 6 = Siege tower.',
      "All types have a one-time use: bring down or bypass a castle's fortifications. The Siege Engine is destroyed in the process, but you're in!",
    ],
  },

  // --- Subtlety accoutrements ---
  // All subtlety accoutrements share a baseline +1 to subtlety
  {
    id: 'padded_footwear',
    label: 'Padded Footwear',
    slotId: 'subtlety',
    modifiers: [
      { target: 'subtlety', value: 1 },
      { target: 'druidry', value: 1 },
    ],
  },
  {
    id: 'snare_trap',
    label: 'Snare Trap',
    slotId: 'subtlety',
    modifiers: [
      { target: 'subtlety', value: 1 },
      { target: 'animal_husbandry', value: -1 },
    ],
    conditionalModifiers: [{ description: '+1 to all Trait rolls vs. Beasts' }],
  },
  {
    id: 'grappling_hook_and_rope',
    label: 'Grappling Hook and a Coil of Rope',
    slotId: 'subtlety',
    modifiers: [
      { target: 'subtlety', value: 1 },
      { target: 'strategy', value: 1 },
    ],
    pointy: true,
  },
  {
    id: 'hooded_cloak_questionable_tassel',
    label: 'Hooded Cloak with Questionable Tassel',
    slotId: 'subtlety',
    modifiers: [
      { target: 'subtlety', value: 1 },
      { target: 'glibness', value: 1 },
    ],
  },
  {
    id: 'lock_picks',
    label: 'Lock Picks',
    slotId: 'subtlety',
    modifiers: [
      { target: 'subtlety', value: 1 },
      { target: 'nimbleness', value: 1 },
    ],
  },
  {
    id: 'history_of_naughty_people',
    label: 'A History of Naughty People by R.T. Sampson',
    slotId: 'subtlety',
    modifiers: [
      { target: 'subtlety', value: 1 },
      { target: 'lorefulness', value: 1 },
    ],
  },
  {
    id: 'heart_attack_o_margarine',
    label: 'Heart Attack-o Margarine (tub of)',
    slotId: 'subtlety',
    modifiers: [
      { target: 'subtlety', value: 1 },
      { target: 'heartiness', value: 1 },
    ],
    specialEffects: [
      'One-time use: if a person or creature consumes the entire tub, their arteries become instantly clogged and they are No More.',
    ],
  },
  {
    id: 'llap_goch_picture_book',
    label: 'LLAP-GOCH Picture Book',
    slotId: 'subtlety',
    modifiers: [
      { target: 'subtlety', value: 1 },
      { target: 'valour', value: 1 },
    ],
  },
  {
    id: 'brazilian_dagger',
    label: 'Brazilian Dagger',
    slotId: 'subtlety',
    modifiers: [{ target: 'subtlety', value: 1 }],
    pointy: true,
    specialEffects: [
      'If you unsheath it, your Luck (if you have it as a Trait) resets to d4.',
      "One-time use: if you can get another person to use it, horrible things begin happening to them. Ultimately this results in the person being made dead and the dagger being destroyed, and it's always messy.",
    ],
  },
  {
    id: 'whizzo_assorted_chocolates',
    label: 'Whizzo Assorted Chocolates (box of)',
    slotId: 'subtlety',
    modifiers: [
      { target: 'subtlety', value: 1 },
      { target: 'decorum', value: 1 },
    ],
    specialEffects: [
      'One-time use: if you convince or trick someone into eating all six, they are No More.',
    ],
  },

  // --- Wisdom in the Ways of Science accoutrements ---
  // All wisdom in the ways of science accoutrements share a baseline +1 to wisdom_in_the_ways_of_science
  {
    id: 'sundial',
    label: 'Sundial',
    slotId: 'wisdom_in_the_ways_of_science',
    modifiers: [
      { target: 'wisdom_in_the_ways_of_science', value: 1 },
      { target: 'druidry', value: 1 },
    ],
    specialEffects: [
      'Large. Stone. Requires a cart to transport.',
      'Useless at night, but surely you knew that.',
    ],
  },
  {
    id: 'sulphur_powder_iron_filings_magnet',
    label: 'Sulphur Powder, Iron Filings, and a Magnet',
    slotId: 'wisdom_in_the_ways_of_science',
    modifiers: [
      { target: 'wisdom_in_the_ways_of_science', value: 1 },
      { target: 'chastity', value: 1 },
    ],
  },
  {
    id: 'scales_large',
    label: 'Scales (large)',
    slotId: 'wisdom_in_the_ways_of_science',
    modifiers: [
      { target: 'wisdom_in_the_ways_of_science', value: 1 },
      { target: 'authority', value: 1 },
    ],
    specialEffects: ['Requires a cart to transport.'],
  },
  {
    id: 'abacus_protractor_ruler_compass',
    label: 'Abacus, Protractor, Ruler, and Compass',
    slotId: 'wisdom_in_the_ways_of_science',
    modifiers: [
      { target: 'wisdom_in_the_ways_of_science', value: 1 },
      { target: 'glibness', value: -1 },
    ],
    conditionalModifiers: [
      {
        description:
          '+1 to all Trait rolls vs. Shoppekeepers, Burghers, merchants, and the like',
      },
    ],
    specialEffects: [
      'If carried openly, these objects cause children to flee in terror.',
    ],
  },
  {
    id: 'scales_reasonable',
    label: 'Scales (reasonable)',
    slotId: 'wisdom_in_the_ways_of_science',
    modifiers: [
      { target: 'wisdom_in_the_ways_of_science', value: 1 },
      { target: 'bardistry', value: 1 },
    ],
  },
  {
    id: 'powders_burn_different_colours',
    label: 'Powders that Burn in Different Colours',
    slotId: 'wisdom_in_the_ways_of_science',
    modifiers: [
      { target: 'wisdom_in_the_ways_of_science', value: 1 },
      { target: 'subtlety', value: 1 },
    ],
  },
  {
    id: 'silver_trophy_achievement_science',
    label: 'Silver Trophy for Achievement in Science',
    slotId: 'wisdom_in_the_ways_of_science',
    modifiers: [
      { target: 'wisdom_in_the_ways_of_science', value: 1 },
      { target: 'argumentation', value: 1 },
    ],
    specialEffects: [
      "Often confused for the Holy Grail. One-time use: melt it down for 23 Gold (currency). Don't ask, 'But isn't it made of silver?' You'll only embarrass yourself.",
    ],
  },
  {
    id: 'alchemical_equipment',
    label: 'Alchemical Equipment',
    slotId: 'wisdom_in_the_ways_of_science',
    modifiers: [
      { target: 'wisdom_in_the_ways_of_science', value: 1 },
      { target: 'druidry', value: 1 },
    ],
  },
  {
    id: 'astrolabe',
    label: 'Astrolabe',
    slotId: 'wisdom_in_the_ways_of_science',
    modifiers: [
      { target: 'wisdom_in_the_ways_of_science', value: 1 },
      { target: 'purpose', value: -1 },
    ],
    conditionalModifiers: [
      {
        description:
          '+1 to all Trait rolls vs. astrologers, scientists, and other forward-thinkers',
      },
    ],
    specialEffects: ['Useless in daytime, birdbrain.'],
  },
  {
    id: 'philosophers_stone',
    label: "The Philosopher's Stone",
    slotId: 'wisdom_in_the_ways_of_science',
    modifiers: [
      { target: 'wisdom_in_the_ways_of_science', value: 1 },
      { target: 'purpose', value: 1 },
      { target: 'lorefulness', value: 1 },
      { target: 'heartiness', value: -1 },
    ],
    specialEffects: [
      'One-time use: resurrect someone (including yourself) who is No More OR transform any base metal into Gold (Currency). Roll a d20 ten times to see how much you get.',
    ],
  },
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
  ALL_ACCOUTREMENTS.map((a) => [a.id, a]),
);

/** Get available accoutrements for a slot (trait or retainer), filtered by prerequisites */
export function getAvailableAccoutrements(
  slotId: string,
  hasRetainer: boolean,
): AccoutrementDef[] {
  const all = ACCOUTREMENTS_BY_SLOT.get(slotId) ?? [];
  return all.filter((a) => {
    if (a.requires?.retainer && !hasRetainer) return false;
    return true;
  });
}

/**
 * Get available accoutrements for a retainer, based on their accoutrement types.
 * Retainers draw from the pools of their allowed trait types rather than having their own pool.
 * Pass the retainer's accoutrementTypes directly to avoid circular imports.
 */
export function getRetainerAvailableAccoutrements(
  accoutrementTypes: RetainerAccoutrementTypes,
  hasRetainer: boolean,
  employerTraitIds?: string[],
): AccoutrementDef[] {
  let traitIds: string[];
  switch (accoutrementTypes.type) {
    case 'specific':
      traitIds = accoutrementTypes.traitIds;
      break;
    case 'any':
      traitIds = [...ACCOUTREMENTS_BY_SLOT.keys()];
      break;
    case 'employerChoice':
      traitIds = employerTraitIds ?? [];
      break;
  }

  const seen = new Set<string>();
  const result: AccoutrementDef[] = [];
  for (const traitId of traitIds) {
    const pool = ACCOUTREMENTS_BY_SLOT.get(traitId) ?? [];
    for (const acc of pool) {
      if (seen.has(acc.id)) continue;
      if (acc.requires?.retainer && !hasRetainer) continue;
      seen.add(acc.id);
      result.push(acc);
    }
  }
  return result;
}

/** Get available extra accoutrements granted by a primary accoutrement (e.g. Cloth Sack) */
export function getExtraAccoutrementOptions(
  primaryAccId: string,
  hasRetainer: boolean,
): AccoutrementDef[] {
  const primary = ACCOUTREMENT_MAP.get(primaryAccId);
  if (!primary?.grantsExtra) return [];

  const { fromAnySlot, excludePointy } = primary.grantsExtra;
  const pool = fromAnySlot
    ? ALL_ACCOUTREMENTS
    : (ACCOUTREMENTS_BY_SLOT.get(primary.slotId) ?? []);

  return pool.filter((a) => {
    if (a.id === primaryAccId) return false; // can't pick the same accoutrement twice
    if (a.requires?.retainer && !hasRetainer) return false;
    if (excludePointy && a.pointy) return false;
    return true;
  });
}
