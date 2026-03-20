import type { SituationDef, TraitDef, RetainerDef, CharacterSlot, SocialClass } from './types';
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
	{ id: 'acolyte', label: 'Acolyte' },
	{ id: 'apprentice', label: 'Apprentice' },
	{ id: 'herald', label: 'Herald' },
	{ id: 'homunculus', label: 'Homunculus' },
	{ id: 'jester', label: 'Jester' },
	{ id: 'manservant', label: 'Manservant (with coconuts)' },
	{ id: 'minstrel', label: 'Minstrel' },
	{ id: 'poet', label: 'Poet' },
	{ id: 'scribe', label: 'Scribe' },
	{ id: 'squire', label: 'Squire' },
	{ id: 'torchbearer', label: 'Torchbearer' },
	{ id: 'valet', label: 'Valet/Handmaid' }
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
		indifferentTrait: 'subtlety'
	}
];

export const SITUATION_MAP = new Map<string, SituationDef>(SITUATIONS.map((s) => [s.id, s]));

/** Get the required (locked-in) slots for a situation */
export function getRequiredSlots(situationId: string): CharacterSlot[] {
	const situation = SITUATION_MAP.get(situationId);
	if (!situation) return [];

	const slots: CharacterSlot[] = [];
	for (const traitId of situation.requiredTraits) {
		slots.push({ type: 'trait', traitId, required: true });
	}
	for (const retainerId of situation.requiredRetainers) {
		slots.push({ type: 'retainer', retainerId, required: true, name: '' });
	}
	return slots;
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
