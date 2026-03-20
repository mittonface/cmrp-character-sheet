import type { CharacterData, CharacterSlot, Currency, DeathStatus, DieSize, IndifferentTraitsDef, LoonyStatus, Modifier, SheetContext, SocialClass } from './types';
import { SLOT_COUNT } from './types';
import { applyModifiers, removeBySource } from './modifiers';
import { getEffects } from './effects';
import { getRequiredSlots, getPickableTraits, getPickableRetainers, getAvailableClasses, SITUATION_MAP, TRAIT_MAP } from './situations';
import { ACCOUTREMENT_MAP, getAvailableAccoutrements } from './accoutrements';

/**
 * Creates a reactive character sheet state using Svelte 5 runes.
 *
 * Usage:
 *   let character = createCharacter();
 *   character.setSituation('knight');
 *   character.addSlot({ type: 'trait', traitId: 'valour', required: false });
 *   character.setTraitValue('valour', 5);
 */
export function createCharacter(initial?: CharacterData) {
	let name = $state(initial?.name ?? '');
	let situationId = $state(initial?.situation ?? '');
	let socialClass = $state<SocialClass | ''>(initial?.socialClass ?? '');
	let deathStatus = $state<DeathStatus | ''>(initial?.deathStatus ?? '');
	let loonyStatus = $state<LoonyStatus | ''>(initial?.loonyStatus ?? '');
	let slots = $state<CharacterSlot[]>(initial?.slots ?? []);
	let traitValues = $state<Record<string, DieSize>>(initial?.traitValues ?? {});
	let indifferentTraitSelections = $state<string[]>(initial?.indifferentTraits ?? []);
	let accoutrements = $state<Record<string, string>>(initial?.accoutrements ?? {});
	let currencies = $state<Partial<Record<Currency, number>>>(initial?.currencies ?? {});
	let selections = $state<Record<string, string>>(initial?.selections ?? {});
	let modifiers = $state<Modifier[]>([]);

	// --- Derived from slots ---
	let traitSlots = $derived(slots.filter((s) => s.type === 'trait'));
	let retainerSlots = $derived(slots.filter((s) => s.type === 'retainer'));
	let traitIds = $derived(traitSlots.map((s) => s.traitId));
	let freeSlotCount = $derived(SLOT_COUNT - slots.filter((s) => s.required).length);
	let chosenSlotCount = $derived(slots.filter((s) => !s.required).length);
	let remainingChoices = $derived(freeSlotCount - chosenSlotCount);
	let slotsComplete = $derived(slots.length === SLOT_COUNT);

	// --- Dice pool from the situation ---
	let dicePool = $derived(SITUATION_MAP.get(situationId)?.dicePool ?? []);
	let traitCount = $derived(traitSlots.length);

	// --- Available social classes from the situation ---
	let availableClasses = $derived(getAvailableClasses(situationId));

	// --- Indifferent traits ---
	let indifferentTraitsDef = $derived<IndifferentTraitsDef | null>(
		SITUATION_MAP.get(situationId)?.indifferentTraits ?? null
	);

	// The resolved list of indifferent trait IDs (fixed or player-selected)
	let indifferentTraits = $derived.by(() => {
		const def = indifferentTraitsDef;
		if (!def) return [];
		if (def.type === 'fixed') return def.traitIds;
		return indifferentTraitSelections;
	});

	// Traits available for the player to pick as indifferent (for 'select' type)
	let pickableIndifferentTraits = $derived.by(() => {
		const def = indifferentTraitsDef;
		if (!def || def.type !== 'select') return [];
		const situation = SITUATION_MAP.get(situationId);
		if (!situation) return [];

		const chosenTraitIds = new Set(traitIds);
		const excluded = new Set(def.exclude ?? []);
		const alreadySelected = new Set(indifferentTraitSelections);

		return situation.availableTraits
			.filter((id) => !chosenTraitIds.has(id) && !excluded.has(id) && !alreadySelected.has(id))
			.map((id) => TRAIT_MAP.get(id)!)
			.filter(Boolean);
	});

	let indifferentTraitsComplete = $derived.by(() => {
		const def = indifferentTraitsDef;
		if (!def) return true;
		if (def.type === 'fixed') return true;
		return indifferentTraitSelections.length >= def.count;
	});

	let indifferentTraitsNeeded = $derived.by(() => {
		const def = indifferentTraitsDef;
		if (!def || def.type !== 'select') return 0;
		return def.count - indifferentTraitSelections.length;
	});

	// --- Starting currency from the situation (for highlighting) ---
	let startingCurrency = $derived(SITUATION_MAP.get(situationId)?.startingCurrency ?? null);

	// --- Pickable options for free slots ---
	let pickableTraits = $derived(getPickableTraits(situationId, slots));
	let pickableRetainers = $derived(getPickableRetainers(situationId, slots));

	// --- Situation management ---
	function setSituation(id: string) {
		modifiers = removeBySource(modifiers, 'situation:');
		situationId = id;

		// Reset to just the required slots
		slots = getRequiredSlots(id);
		traitValues = {};
		accoutrements = {};
		indifferentTraitSelections = [];

		// Auto-set class if only one option
		const classes = getAvailableClasses(id);
		socialClass = classes.length === 1 ? classes[0] : '';

		// Set starting status tracks and currency from the situation
		const situation = SITUATION_MAP.get(id);
		deathStatus = situation?.startingDeathStatus ?? '';
		loonyStatus = situation?.startingLoonyStatus ?? '';

		// Reset currencies (player will roll for starting amount)
		currencies = {};

		if (id) {
			const effects = getEffects('situation', id);
			modifiers = [...modifiers, ...effects];
		}
	}

	// --- Social class management ---
	function setSocialClass(cls: SocialClass | '') {
		if (cls && !availableClasses.includes(cls)) return;
		socialClass = cls;
	}

	// --- Death status management ---
	function setDeathStatus(status: DeathStatus) {
		deathStatus = status;
	}

	// --- Loony status management ---
	function setLoonyStatus(status: LoonyStatus) {
		loonyStatus = status;
	}

	// --- Indifferent trait selection management ---
	function addIndifferentTrait(traitId: string) {
		const def = indifferentTraitsDef;
		if (!def || def.type !== 'select') return;
		if (indifferentTraitSelections.length >= def.count) return;
		if (indifferentTraitSelections.includes(traitId)) return;
		indifferentTraitSelections = [...indifferentTraitSelections, traitId];
	}

	function removeIndifferentTrait(traitId: string) {
		indifferentTraitSelections = indifferentTraitSelections.filter((id) => id !== traitId);
	}

	// --- Slot management ---
	function addSlot(slot: CharacterSlot) {
		if (slots.length >= SLOT_COUNT) return;
		slots = [...slots, slot];
		// If a trait was added that was selected as indifferent, remove it from indifferent selections
		if (slot.type === 'trait' && indifferentTraitSelections.includes(slot.traitId)) {
			indifferentTraitSelections = indifferentTraitSelections.filter((id) => id !== slot.traitId);
		}
	}

	function removeSlot(index: number) {
		const slot = slots[index];
		if (!slot || slot.required) return; // can't remove required slots

		// Clean up trait value and accoutrement if removing a trait
		if (slot.type === 'trait') {
			delete traitValues[slot.traitId];
			clearAccoutrement(slot.traitId);
		}

		slots = slots.filter((_, i) => i !== index);
	}

	function setTraitValue(traitId: string, value: DieSize) {
		traitValues[traitId] = value;
	}

	// --- Accoutrement management ---
	let hasRetainer = $derived(retainerSlots.length > 0);
	let requiredTraitIds = $derived(
		new Set(
			slots
				.filter((s): s is CharacterSlot & { type: 'trait' } => s.type === 'trait' && s.required)
				.map((s) => s.traitId)
		)
	);

	function setAccoutrement(traitId: string, accoutrementId: string) {
		if (accoutrementId) {
			accoutrements[traitId] = accoutrementId;
		} else {
			delete accoutrements[traitId];
		}
	}

	function clearAccoutrement(traitId: string) {
		delete accoutrements[traitId];
	}

	// --- Roll modifiers derived from accoutrements ---
	// These are bonuses/penalties applied to dice rolls, NOT to the die size itself.
	// e.g. Knightly Armour gives +1 valour and +1 authority as roll modifiers.
	let rollModifiers = $derived.by(() => {
		const mods: Record<string, number> = {};
		for (const [, accId] of Object.entries(accoutrements)) {
			const acc = ACCOUTREMENT_MAP.get(accId);
			if (!acc) continue;
			for (const m of acc.modifiers) {
				mods[m.target] = (mods[m.target] ?? 0) + m.value;
			}
		}
		return mods;
	});

	// --- Computed values with modifiers ---
	let baseValues = $derived.by(() => {
		const values: Record<string, number | string> = {};
		for (const id of traitIds) {
			values[id] = traitValues[id] ?? 0;
		}
		return values;
	});

	let finalValues = $derived(applyModifiers(baseValues, modifiers));

	let finalTraits = $derived.by(() => {
		const result: Record<string, number> = {};
		for (const id of traitIds) {
			result[id] = (finalValues[id] as number) ?? 0;
		}
		return result;
	});

	// --- Currency management ---
	function setCurrency(currency: Currency, amount: number) {
		if (amount <= 0) {
			delete currencies[currency];
		} else {
			currencies[currency] = amount;
		}
	}

	// --- Selection management (for non-situation selections) ---
	function setSelection(category: string, choice: string) {
		modifiers = removeBySource(modifiers, `${category}:`);
		if (choice) {
			selections[category] = choice;
			const effects = getEffects(category, choice);
			modifiers = [...modifiers, ...effects];
		} else {
			delete selections[category];
		}
	}

	let context: SheetContext = $derived({
		baseValues,
		finalValues,
		modifiers,
		slots
	});

	function serialize(): CharacterData {
		return {
			name,
			situation: situationId,
			socialClass,
			deathStatus,
			loonyStatus,
			slots: slots.map((s) => ({ ...s })),
			indifferentTraits: [...indifferentTraitSelections],
			traitValues: { ...traitValues },
			accoutrements: { ...accoutrements },
			currencies: { ...currencies },
			selections: { ...selections }
		};
	}

	return {
		get name() {
			return name;
		},
		set name(v: string) {
			name = v;
		},
		get situationId() {
			return situationId;
		},
		get socialClass() {
			return socialClass;
		},
		get deathStatus() {
			return deathStatus;
		},
		get loonyStatus() {
			return loonyStatus;
		},
		get availableClasses() {
			return availableClasses;
		},
		get indifferentTraits() {
			return indifferentTraits;
		},
		get indifferentTraitsDef() {
			return indifferentTraitsDef;
		},
		get pickableIndifferentTraits() {
			return pickableIndifferentTraits;
		},
		get indifferentTraitsComplete() {
			return indifferentTraitsComplete;
		},
		get indifferentTraitsNeeded() {
			return indifferentTraitsNeeded;
		},
		get startingCurrency() {
			return startingCurrency;
		},
		get slots() {
			return slots;
		},
		get traitSlots() {
			return traitSlots;
		},
		get retainerSlots() {
			return retainerSlots;
		},
		get traitIds() {
			return traitIds;
		},
		get traitValues() {
			return traitValues;
		},
		get finalTraits() {
			return finalTraits;
		},
		get freeSlotCount() {
			return freeSlotCount;
		},
		get remainingChoices() {
			return remainingChoices;
		},
		get slotsComplete() {
			return slotsComplete;
		},
		get pickableTraits() {
			return pickableTraits;
		},
		get pickableRetainers() {
			return pickableRetainers;
		},
		get dicePool() {
			return dicePool;
		},
		get traitCount() {
			return traitCount;
		},
		get accoutrements() {
			return accoutrements;
		},
		get currencies() {
			return currencies;
		},
		get hasRetainer() {
			return hasRetainer;
		},
		get requiredTraitIds() {
			return requiredTraitIds;
		},
		get selections() {
			return selections;
		},
		get rollModifiers() {
			return rollModifiers;
		},
		get modifiers() {
			return modifiers;
		},
		get finalValues() {
			return finalValues;
		},
		get context() {
			return context;
		},
		setSituation,
		setSocialClass,
		addIndifferentTrait,
		removeIndifferentTrait,
		setDeathStatus,
		setLoonyStatus,
		addSlot,
		removeSlot,
		setTraitValue,
		setAccoutrement,
		clearAccoutrement,
		setCurrency,
		setSelection,
		serialize
	};
}
