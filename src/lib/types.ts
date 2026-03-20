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
	dicePool: DieSize[]; // dice available to distribute across traits (length = max trait slots)
	availableClasses: SocialClass[]; // which social classes the player can pick
	indifferentTrait: string; // trait ID the situation is indifferent to (display only)
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

/** Social class options */
export const SOCIAL_CLASSES = ['upper', 'middle', 'lower'] as const;
export type SocialClass = (typeof SOCIAL_CLASSES)[number];

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
	slots: CharacterSlot[];
	traitValues: Record<string, DieSize>; // trait ID → die size (e.g. 20 for d20)
	accoutrements: Record<string, string>; // trait ID → accoutrement ID
	selections: Record<string, string>; // other selections
};
