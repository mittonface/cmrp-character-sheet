/** Operation types for modifiers */
export type ModifierOperation = 'add' | 'multiply' | 'set' | 'min' | 'max';

/** A single modifier applied to a character field */
export type Modifier = {
	source: string; // e.g. "situation:knight", "item:magic-ring"
	target: string; // e.g. "valour", "heartiness"
	operation: ModifierOperation;
	value: number;
	priority?: number; // controls application order (lower = earlier, default 0)
};

/** A character has exactly 5 slots, each either a Trait or a Retainer */
export type CharacterSlot =
	| { type: 'trait'; traitId: string; required: boolean }
	| { type: 'retainer'; retainerId: string; required: boolean; name: string };

/** A Situation (class) defines the rules for filling the 5 slots */
export type SituationDef = {
	id: string;
	label: string;
	requiredTraits: string[]; // trait IDs the character must have
	availableTraits: string[]; // trait IDs the player can pick from for free slots
	requiredRetainers: string[]; // retainer IDs the character must have
	allowRetainers: boolean; // whether the player can choose retainers for free slots
	availableRetainers?: string[]; // if set, restricts which retainers can be chosen
	classRequiredTraits?: Partial<Record<SocialClass, string[]>>; // traits required by social class choice
	choices?: SituationChoiceDef[]; // named choices that can add required traits (e.g. muse selection)
	dicePool: DieSize[]; // dice available to distribute across traits (length = max trait slots, empty if mustRoll)
	mustRoll?: boolean; // if true, player must roll for each trait (no dice pool to distribute)
	availableClasses: SocialClass[]; // which social classes the player can pick
	indifferentTraits: IndifferentTraitsDef; // how indifferent traits are determined
	startingDeathStatus: DeathStatus; // where on the Death Status track the character begins
	startingLoonyStatus: LoonyStatus; // where on the Loony Status track the character begins
	startingCurrency: { currency: Currency; roll: DiceExpression }; // which currency and what to roll for the starting amount
};

/** A Trait definition */
export type TraitDef = {
	id: string;
	label: string;
};

/** A Retainer definition */
export type RetainerDef = {
	id: string;
	label: string;
};

/** A simple trait modifier from an accoutrement */
export type AccoutrementModifier = {
	target: string; // trait ID
	value: number; // e.g. +1 or -1
};

/** A conditional modifier that can't be auto-calculated (display only) */
export type ConditionalModifier = {
	description: string; // e.g. "+1 to all trait rolls vs Monstrosities"
};

/** An accoutrement that can be equipped on a trait */
export type AccoutrementDef = {
	id: string;
	label: string;
	traitId: string; // which trait this accoutrement belongs to
	modifiers: AccoutrementModifier[]; // simple +/- to traits (auto-applied)
	conditionalModifiers?: ConditionalModifier[]; // display-only conditional effects
	specialEffects?: string[]; // narrative/one-time effects
	requires?: { retainer: boolean }; // prerequisites
};

/** A named choice a Situation offers the player, where each option can add required traits */
export type SituationChoiceDef = {
	id: string; // e.g. 'muse'
	label: string; // e.g. 'Muse'
	options: SituationChoiceOption[];
};

export type SituationChoiceOption = {
	id: string; // e.g. 'calliope'
	label: string; // e.g. 'Calliope'
	requiredTraits?: string[]; // trait IDs added as required when this option is chosen
};

/** Indifferent traits definition — fixed by the Situation or selected by the player */
export type IndifferentTraitsDef =
	| { type: 'fixed'; traitIds: string[] }
	| { type: 'select'; count: number; exclude?: string[] };

/** Social class options */
export const SOCIAL_CLASSES = ['upper', 'middle', 'lower'] as const;
export type SocialClass = (typeof SOCIAL_CLASSES)[number];

/** Death Status track — ordered from healthiest to deadest */
export const DEATH_STATUSES = [
	'mr_neutron',
	'fine_fine',
	'getting_better',
	'not_dead_yet',
	'virtually_dead',
	'no_more'
] as const;
export type DeathStatus = (typeof DEATH_STATUSES)[number];

export const DEATH_STATUS_LABELS: Record<DeathStatus, string> = {
	mr_neutron: 'Mr. Neutron',
	fine_fine: 'Fine, Fine',
	getting_better: 'Getting Better',
	not_dead_yet: 'Not Dead Yet',
	virtually_dead: 'Virtually Dead',
	no_more: 'No More'
};

/** Loony Status track — ordered from sanest to maddest */
export const LOONY_STATUSES = [
	'reginald_maudling',
	'sensible',
	'daft',
	'barmy',
	'crackers',
	'coconuts'
] as const;
export type LoonyStatus = (typeof LOONY_STATUSES)[number];

export const LOONY_STATUS_LABELS: Record<LoonyStatus, string> = {
	reginald_maudling: 'Reginald Maudling',
	sensible: 'Sensible',
	daft: 'Daft',
	barmy: 'Barmy',
	crackers: 'Crackers',
	coconuts: 'Coconuts'
};

/** Currency types available in the game */
export const CURRENCIES = [
	'acorns',
	'cheese',
	'eggs',
	'gemstones',
	'gold',
	'lupins',
	'naughty_pictures',
	'plague_dead_bodies',
	'upper_class_twit_trading_cards',
	'whizzo_butter'
] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_LABELS: Record<Currency, string> = {
	acorns: 'Acorns',
	cheese: 'Cheese',
	eggs: 'Eggs',
	gemstones: 'Gemstones',
	gold: 'Gold',
	lupins: 'Lupins',
	naughty_pictures: 'Naughty Pictures',
	plague_dead_bodies: 'Plague-Dead Bodies',
	upper_class_twit_trading_cards: 'Upper-Class Twit Trading Cards',
	whizzo_butter: 'Whizzo Butter'
};

export const SLOT_COUNT = 5;

/** Valid die sizes for traits */
export const DIE_SIZES = [4, 6, 8, 10, 12, 14, 16, 18, 20] as const;
export type DieSize = (typeof DIE_SIZES)[number];

/** A dice expression for rollable fields */
export type DiceExpression = {
	count: number; // number of dice
	sides: number; // e.g. 20 for d20
	modifier?: number; // flat bonus/penalty
};

/** Field types for the sheet schema */
export type FieldType = 'number' | 'text' | 'select' | 'computed';

/** Definition of a single field on the character sheet */
export type FieldDef = {
	id: string;
	label: string;
	type: FieldType;
	section?: string;
	options?: string[];
	compute?: (ctx: SheetContext) => number | string;
	rollable?: DiceExpression | ((ctx: SheetContext) => DiceExpression);
};

/** Context passed to computed fields and dice expressions */
export type SheetContext = {
	baseValues: Record<string, number | string>;
	finalValues: Record<string, number | string>;
	modifiers: Modifier[];
	slots: CharacterSlot[];
};

/** The raw character data that gets saved/loaded */
export type CharacterData = {
	name: string;
	situation: string;
	socialClass: SocialClass | '';
	deathStatus: DeathStatus | '';
	loonyStatus: LoonyStatus | '';
	slots: CharacterSlot[];
	traitValues: Record<string, DieSize>; // trait ID → die size (e.g. 20 for d20)
	indifferentTraits?: string[]; // player-selected or fixed indifferent trait IDs
	accoutrements: Record<string, string>; // trait ID → accoutrement ID
	currencies: Partial<Record<Currency, number>>; // currency amounts
	choiceSelections: Record<string, string>; // situation choice ID → selected option ID (e.g. muse → calliope)
	selections: Record<string, string>; // other selections
};
