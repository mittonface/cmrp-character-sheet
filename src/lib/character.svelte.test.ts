import { describe, it, expect } from 'vitest';
import { flushSync } from 'svelte';
import { createCharacter } from './character.svelte';

describe('createCharacter', () => {
	it('creates a character with default empty state', () => {
		const char = createCharacter();
		expect(char.name).toBe('');
		expect(char.situationId).toBe('');
		expect(char.slots).toEqual([]);
		expect(char.traitValues).toEqual({});
		expect(char.modifiers).toEqual([]);
	});

	it('creates a character from initial data', () => {
		const char = createCharacter({
			name: 'Sir Lancelot',
			situation: 'knight',
			socialClass: 'upper',
			deathStatus: 'mr_neutron',
			loonyStatus: 'daft',
			slots: [{ type: 'trait', traitId: 'valour', required: true }],
			traitValues: { valour: 12 },
			accoutrements: {},
			currencies: {},
			selections: {}
		});
		expect(char.name).toBe('Sir Lancelot');
		expect(char.situationId).toBe('knight');
		expect(char.slots).toHaveLength(1);
	});
});

describe('setSituation', () => {
	it('sets up required slots for knight', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		expect(char.situationId).toBe('knight');
		expect(char.slots).toHaveLength(3); // 2 traits + 1 retainer
		expect(char.slots.every((s) => s.required)).toBe(true);
	});

	it('resets trait values and accoutrements', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.setTraitValue('valour', 18);
		char.setSituation('knight');
		flushSync();

		expect(char.traitValues).toEqual({});
		expect(char.accoutrements).toEqual({});
	});

	it('sets starting death status from situation', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		expect(char.deathStatus).toBe('mr_neutron');
	});

	it('resets death status when situation changes', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.setSituation('');
		flushSync();

		expect(char.deathStatus).toBe('');
	});

	it('allows manually changing death status', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.setDeathStatus('not_dead_yet');
		flushSync();

		expect(char.deathStatus).toBe('not_dead_yet');
	});

	it('sets starting loony status from situation', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		expect(char.loonyStatus).toBe('daft');
	});

	it('exposes starting currency from situation', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		expect(char.startingCurrency).toEqual({ currency: 'gold', roll: { count: 1, sides: 30 } });
	});

	it('resets currencies when situation changes', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.setCurrency('eggs', 5);
		flushSync();

		char.setSituation('knight');
		flushSync();

		expect(char.currencies).toEqual({});
	});

	it('clears starting currency when situation cleared', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.setSituation('');
		flushSync();

		expect(char.currencies).toEqual({});
		expect(char.startingCurrency).toBeNull();
	});

	it('resets loony status when situation changes', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.setSituation('');
		flushSync();

		expect(char.loonyStatus).toBe('');
	});

	it('allows manually changing loony status', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.setLoonyStatus('barmy');
		flushSync();

		expect(char.loonyStatus).toBe('barmy');
	});

	it('clears old situation modifiers', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		// No situation effects currently, but modifiers should be clean
		expect(char.modifiers).toEqual([]);
	});

	it('provides correct dice pool', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		expect(char.dicePool).toEqual([18, 12, 12, 6]);
	});

	it('setting empty string clears the situation', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();
		char.setSituation('');
		flushSync();

		expect(char.situationId).toBe('');
		expect(char.slots).toEqual([]);
	});
});

describe('slot management', () => {
	it('adds a trait slot', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.addSlot({ type: 'trait', traitId: 'strategy', required: false });
		flushSync();

		expect(char.slots).toHaveLength(4);
		expect(char.traitIds).toContain('strategy');
	});

	it('adds a retainer slot', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.addSlot({ type: 'retainer', retainerId: 'squire', required: false, name: '' });
		flushSync();

		expect(char.retainerSlots).toHaveLength(2); // manservant + squire
	});

	it('does not add slots beyond SLOT_COUNT', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		// Already 3 required, add 2 more to fill
		char.addSlot({ type: 'trait', traitId: 'strategy', required: false });
		char.addSlot({ type: 'trait', traitId: 'heartiness', required: false });
		flushSync();

		expect(char.slots).toHaveLength(5);
		expect(char.slotsComplete).toBe(true);

		// Try to add one more
		char.addSlot({ type: 'trait', traitId: 'luck', required: false });
		flushSync();

		expect(char.slots).toHaveLength(5);
	});

	it('removes a non-required slot', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.addSlot({ type: 'trait', traitId: 'strategy', required: false });
		flushSync();

		char.removeSlot(3); // index of strategy (after 3 required)
		flushSync();

		expect(char.slots).toHaveLength(3);
		expect(char.traitIds).not.toContain('strategy');
	});

	it('does not remove required slots', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.removeSlot(0); // valour is required
		flushSync();

		expect(char.slots).toHaveLength(3);
	});

	it('cleans up trait value and accoutrement when removing a trait slot', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.addSlot({ type: 'trait', traitId: 'strategy', required: false });
		char.setTraitValue('strategy', 8);
		char.setAccoutrement('strategy', 'shield'); // won't actually apply (no strategy accoutrements)
		flushSync();

		char.removeSlot(3);
		flushSync();

		expect(char.traitValues['strategy']).toBeUndefined();
	});
});

describe('derived values', () => {
	it('computes freeSlotCount correctly', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		expect(char.freeSlotCount).toBe(2); // 5 - 3 required
	});

	it('computes remainingChoices correctly', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		expect(char.remainingChoices).toBe(2);

		char.addSlot({ type: 'trait', traitId: 'strategy', required: false });
		flushSync();

		expect(char.remainingChoices).toBe(1);
	});

	it('computes slotsComplete correctly', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		expect(char.slotsComplete).toBe(false);

		char.addSlot({ type: 'trait', traitId: 'strategy', required: false });
		char.addSlot({ type: 'trait', traitId: 'heartiness', required: false });
		flushSync();

		expect(char.slotsComplete).toBe(true);
	});

	it('computes traitCount correctly', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		expect(char.traitCount).toBe(2); // valour + chastity

		char.addSlot({ type: 'trait', traitId: 'strategy', required: false });
		flushSync();

		expect(char.traitCount).toBe(3);
	});

	it('computes pickableTraits excluding already-chosen', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		const initial = char.pickableTraits.length;
		char.addSlot({ type: 'trait', traitId: 'strategy', required: false });
		flushSync();

		expect(char.pickableTraits.length).toBe(initial - 1);
		expect(char.pickableTraits.find((t) => t.id === 'strategy')).toBeUndefined();
	});

	it('computes hasRetainer correctly', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		expect(char.hasRetainer).toBe(true); // manservant is required
	});

	it('computes requiredTraitIds correctly', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		expect(char.requiredTraitIds).toEqual(new Set(['valour', 'chastity']));
	});
});

describe('trait values', () => {
	it('sets and retrieves trait values', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.setTraitValue('valour', 18);
		flushSync();

		expect(char.traitValues['valour']).toBe(18);
	});
});

describe('accoutrement management', () => {
	it('tracks selected accoutrement', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.setAccoutrement('valour', 'knightly_armour');
		flushSync();

		expect(char.accoutrements['valour']).toBe('knightly_armour');
	});

	it('computes roll modifiers from accoutrements', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.setAccoutrement('valour', 'knightly_armour'); // +1 valour, +1 authority
		flushSync();

		expect(char.rollModifiers['valour']).toBe(1);
		expect(char.rollModifiers['authority']).toBe(1);
	});

	it('replaces roll modifiers when changing accoutrement', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.setAccoutrement('valour', 'knightly_armour'); // +1 valour, +1 authority
		flushSync();

		char.setAccoutrement('valour', 'shield'); // +1 valour, +1 strategy
		flushSync();

		expect(char.accoutrements['valour']).toBe('shield');
		expect(char.rollModifiers['valour']).toBe(1);
		expect(char.rollModifiers['strategy']).toBe(1);
		expect(char.rollModifiers['authority']).toBeUndefined();
	});

	it('clears accoutrement and its roll modifiers', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.setAccoutrement('valour', 'knightly_armour');
		flushSync();

		char.clearAccoutrement('valour');
		flushSync();

		expect(char.accoutrements['valour']).toBeUndefined();
		expect(char.rollModifiers['valour']).toBeUndefined();
	});

	it('setting empty accoutrement ID clears it', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.setAccoutrement('valour', 'shield');
		flushSync();

		char.setAccoutrement('valour', '');
		flushSync();

		expect(char.accoutrements['valour']).toBeUndefined();
		expect(char.rollModifiers['valour']).toBeUndefined();
	});

	it('does not modify die size (no accoutrement modifiers in main modifiers)', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.setAccoutrement('valour', 'knightly_armour');
		flushSync();

		// Accoutrements should NOT add to main modifier stack
		expect(char.modifiers).toEqual([]);
	});
});

describe('final values with modifiers', () => {
	it('accoutrement modifiers do not change die size', () => {
		const char = createCharacter();
		char.setSituation('knight');
		flushSync();

		char.setTraitValue('valour', 12);
		char.setAccoutrement('valour', 'knightly_armour'); // +1 valour roll modifier
		flushSync();

		// Die size stays 12 — the +1 is a roll modifier, not a die size change
		expect(char.finalTraits['valour']).toBe(12);
		expect(char.rollModifiers['valour']).toBe(1);
	});
});

describe('currency management', () => {
	it('starts with no currencies', () => {
		const char = createCharacter();
		expect(char.currencies).toEqual({});
	});

	it('sets a currency amount', () => {
		const char = createCharacter();
		char.setCurrency('gold', 10);
		flushSync();

		expect(char.currencies['gold']).toBe(10);
	});

	it('sets multiple currencies independently', () => {
		const char = createCharacter();
		char.setCurrency('gold', 5);
		char.setCurrency('eggs', 12);
		flushSync();

		expect(char.currencies['gold']).toBe(5);
		expect(char.currencies['eggs']).toBe(12);
	});

	it('removes currency when set to zero', () => {
		const char = createCharacter();
		char.setCurrency('gold', 10);
		flushSync();

		char.setCurrency('gold', 0);
		flushSync();

		expect(char.currencies['gold']).toBeUndefined();
	});

	it('removes currency when set to negative', () => {
		const char = createCharacter();
		char.setCurrency('gold', 10);
		flushSync();

		char.setCurrency('gold', -1);
		flushSync();

		expect(char.currencies['gold']).toBeUndefined();
	});

	it('loads currencies from initial data', () => {
		const char = createCharacter({
			name: '',
			situation: '',
			socialClass: '',
			deathStatus: '',
			loonyStatus: '',
			slots: [],
			traitValues: {},
			accoutrements: {},
			currencies: { gold: 5, cheese: 3 },
			selections: {}
		});

		expect(char.currencies['gold']).toBe(5);
		expect(char.currencies['cheese']).toBe(3);
	});

	it('serializes currencies', () => {
		const char = createCharacter();
		char.setCurrency('lupins', 7);
		char.setCurrency('gemstones', 2);
		flushSync();

		const data = char.serialize();
		expect(data.currencies).toEqual({ lupins: 7, gemstones: 2 });
	});
});

describe('serialize', () => {
	it('serializes character data correctly', () => {
		const char = createCharacter();
		char.name = 'Sir Lancelot';
		char.setSituation('knight');
		flushSync();

		char.addSlot({ type: 'trait', traitId: 'strategy', required: false });
		char.setTraitValue('valour', 18);
		char.setTraitValue('chastity', 12);
		char.setAccoutrement('valour', 'shield');
		flushSync();

		const data = char.serialize();
		expect(data.name).toBe('Sir Lancelot');
		expect(data.situation).toBe('knight');
		expect(data.deathStatus).toBe('mr_neutron');
		expect(data.loonyStatus).toBe('daft');
		expect(data.slots).toHaveLength(4);
		expect(data.traitValues['valour']).toBe(18);
		expect(data.traitValues['chastity']).toBe(12);
		expect(data.accoutrements['valour']).toBe('shield');
	});

	it('returns a deep copy (mutations do not affect original)', () => {
		const char = createCharacter();
		char.name = 'Test';
		char.setSituation('knight');
		flushSync();

		const data = char.serialize();
		data.name = 'Mutated';
		data.slots.push({ type: 'trait', traitId: 'luck', required: false });

		expect(char.name).toBe('Test');
		expect(char.slots).toHaveLength(3);
	});
});
