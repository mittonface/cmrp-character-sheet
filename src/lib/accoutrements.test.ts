import { describe, it, expect } from 'vitest';
import {
	ALL_ACCOUTREMENTS,
	ACCOUTREMENTS_BY_SLOT,
	ACCOUTREMENT_MAP,
	getAvailableAccoutrements,
	getExtraAccoutrementOptions
} from './accoutrements';

describe('data integrity', () => {
	it('all accoutrements have unique IDs', () => {
		const ids = ALL_ACCOUTREMENTS.map((a) => a.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('ACCOUTREMENT_MAP contains all accoutrements', () => {
		expect(ACCOUTREMENT_MAP.size).toBe(ALL_ACCOUTREMENTS.length);
		for (const acc of ALL_ACCOUTREMENTS) {
			expect(ACCOUTREMENT_MAP.get(acc.id)).toBe(acc);
		}
	});

	it('ACCOUTREMENTS_BY_SLOT indexes all accoutrements correctly', () => {
		let total = 0;
		for (const [, list] of ACCOUTREMENTS_BY_SLOT) {
			total += list.length;
		}
		expect(total).toBe(ALL_ACCOUTREMENTS.length);
	});

	it('every accoutrement has at least one modifier', () => {
		for (const acc of ALL_ACCOUTREMENTS) {
			expect(acc.modifiers.length).toBeGreaterThan(0);
		}
	});

	it('all valour accoutrements have +1 valour as first modifier', () => {
		const valourAccs = ALL_ACCOUTREMENTS.filter((a) => a.slotId === 'valour');
		for (const acc of valourAccs) {
			expect(acc.modifiers[0]).toEqual({ target: 'valour', value: 1 });
		}
	});

	it('all animal husbandry accoutrements have +1 animal_husbandry as first modifier', () => {
		const ahAccs = ALL_ACCOUTREMENTS.filter((a) => a.slotId === 'animal_husbandry');
		expect(ahAccs.length).toBe(10);
		for (const acc of ahAccs) {
			expect(acc.modifiers[0]).toEqual({ target: 'animal_husbandry', value: 1 });
		}
	});
});

describe('specific accoutrements', () => {
	it('Burlington Wallbanger requires a retainer', () => {
		const bw = ACCOUTREMENT_MAP.get('burlington_wallbanger')!;
		expect(bw.requires).toEqual({ retainer: true });
	});

	it('Burlington Wallbanger has special effects', () => {
		const bw = ACCOUTREMENT_MAP.get('burlington_wallbanger')!;
		expect(bw.specialEffects).toContain('One-time use: bring down a wall of any size');
	});

	it('Burlington Wallbanger has +2 valour total', () => {
		const bw = ACCOUTREMENT_MAP.get('burlington_wallbanger')!;
		const valourTotal = bw.modifiers
			.filter((m) => m.target === 'valour')
			.reduce((sum, m) => sum + m.value, 0);
		expect(valourTotal).toBe(2);
	});

	it('Polearm has conditional modifiers', () => {
		const polearm = ACCOUTREMENT_MAP.get('polearm')!;
		expect(polearm.conditionalModifiers).toHaveLength(1);
		expect(polearm.conditionalModifiers![0].description).toContain('Lower-class');
	});

	it('Vicious Axe has negative decorum modifier', () => {
		const axe = ACCOUTREMENT_MAP.get('vicious_axe')!;
		const decorum = axe.modifiers.find((m) => m.target === 'decorum');
		expect(decorum).toBeDefined();
		expect(decorum!.value).toBe(-1);
	});

	it('Some Filth has conditional modifier and -1 decorum', () => {
		const filth = ACCOUTREMENT_MAP.get('some_filth')!;
		expect(filth.conditionalModifiers).toHaveLength(1);
		expect(filth.conditionalModifiers![0].description).toContain('Lower-Class');
		expect(filth.modifiers.find((m) => m.target === 'decorum')!.value).toBe(-1);
	});

	it('Farm Animal with License has +2 animal husbandry total', () => {
		const farm = ACCOUTREMENT_MAP.get('farm_animal_with_license')!;
		const ahTotal = farm.modifiers
			.filter((m) => m.target === 'animal_husbandry')
			.reduce((sum, m) => sum + m.value, 0);
		expect(ahTotal).toBe(2);
	});

	it('Cloth Sack grants extra accoutrement slot', () => {
		const sack = ACCOUTREMENT_MAP.get('cloth_sack')!;
		expect(sack.grantsExtra).toEqual({ fromAnySlot: true, excludePointy: true });
	});

	it('Pitchfork has conditional modifier vs witches/wizards', () => {
		const fork = ACCOUTREMENT_MAP.get('pitchfork')!;
		expect(fork.conditionalModifiers).toHaveLength(1);
		expect(fork.conditionalModifiers![0].description).toContain('witches');
	});

	it("Sheep's Bladder has special earthquake prevention", () => {
		const bladder = ACCOUTREMENT_MAP.get('sheeps_bladder')!;
		expect(bladder.specialEffects).toHaveLength(1);
		expect(bladder.specialEffects![0]).toContain('earthquake');
	});

	it("Webb's Wonder Lettuce has special detonation effect", () => {
		const lettuce = ACCOUTREMENT_MAP.get('webbs_wonder_lettuce')!;
		expect(lettuce.specialEffects).toHaveLength(1);
		expect(lettuce.specialEffects![0]).toContain('detonates');
	});

	it('all argumentation accoutrements have +1 argumentation as first modifier', () => {
		const argAccs = ALL_ACCOUTREMENTS.filter((a) => a.slotId === 'argumentation');
		expect(argAccs.length).toBe(10);
		for (const acc of argAccs) {
			expect(acc.modifiers[0]).toEqual({ target: 'argumentation', value: 1 });
		}
	});

	it('Sheaf of Contracts has +2 argumentation total', () => {
		const sheaf = ACCOUTREMENT_MAP.get('sheaf_of_contracts')!;
		const argTotal = sheaf.modifiers
			.filter((m) => m.target === 'argumentation')
			.reduce((sum, m) => sum + m.value, 0);
		expect(argTotal).toBe(2);
	});

	it('Portable Lectern has setup special effect', () => {
		const lectern = ACCOUTREMENT_MAP.get('portable_lectern')!;
		expect(lectern.specialEffects).toHaveLength(1);
		expect(lectern.specialEffects![0]).toContain('set up');
	});

	it('Parliament of Fowls has conditional modifier and -1 authority', () => {
		const pof = ACCOUTREMENT_MAP.get('parliament_of_fowls')!;
		expect(pof.conditionalModifiers).toHaveLength(1);
		expect(pof.conditionalModifiers![0].description).toContain('bards');
		expect(pof.modifiers.find((m) => m.target === 'authority')!.value).toBe(-1);
	});

	it('Magna Carta has conditional modifier and sovereign special effect', () => {
		const mc = ACCOUTREMENT_MAP.get('magna_carta')!;
		expect(mc.conditionalModifiers).toHaveLength(1);
		expect(mc.conditionalModifiers![0].description).toContain('upper-class');
		expect(mc.specialEffects).toHaveLength(1);
		expect(mc.specialEffects![0]).toContain('sovereign');
	});

	it('all authority accoutrements have +1 authority as first modifier', () => {
		const authAccs = ALL_ACCOUTREMENTS.filter((a) => a.slotId === 'authority');
		expect(authAccs.length).toBe(10);
		for (const acc of authAccs) {
			expect(acc.modifiers[0]).toEqual({ target: 'authority', value: 1 });
		}
	});

	it('Gonfalon requires a retainer', () => {
		const gonfalon = ACCOUTREMENT_MAP.get('gonfalon')!;
		expect(gonfalon.requires).toEqual({ retainer: true });
	});

	it('Buisine requires a retainer', () => {
		const buisine = ACCOUTREMENT_MAP.get('buisine')!;
		expect(buisine.requires).toEqual({ retainer: true });
	});

	it('Letter of the Marque has conditional modifier vs pirates and -1 decorum', () => {
		const letter = ACCOUTREMENT_MAP.get('letter_of_the_marque')!;
		expect(letter.conditionalModifiers).toHaveLength(1);
		expect(letter.conditionalModifiers![0].description).toContain('pirates');
		expect(letter.modifiers.find((m) => m.target === 'decorum')!.value).toBe(-1);
	});

	it('Applause/Laughs Pennon has studio audience special effect', () => {
		const pennon = ACCOUTREMENT_MAP.get('applause_laughs_pennon')!;
		expect(pennon.specialEffects).toHaveLength(1);
		expect(pennon.specialEffects![0]).toContain('studio audience');
	});

	it('Crown has conditional modifier vs upper-class and -1 luck', () => {
		const crown = ACCOUTREMENT_MAP.get('crown')!;
		expect(crown.conditionalModifiers).toHaveLength(1);
		expect(crown.conditionalModifiers![0].description).toContain('upper-class');
		expect(crown.modifiers.find((m) => m.target === 'luck')!.value).toBe(-1);
	});

	it('Domesday Book has tax levy special effect', () => {
		const book = ACCOUTREMENT_MAP.get('domesday_book')!;
		expect(book.specialEffects).toHaveLength(1);
		expect(book.specialEffects![0]).toContain('levy a tax');
	});

	it('all glibness accoutrements have +1 glibness as first modifier', () => {
		const glibAccs = ALL_ACCOUTREMENTS.filter((a) => a.slotId === 'glibness');
		expect(glibAccs.length).toBe(10);
		for (const acc of glibAccs) {
			expect(acc.modifiers[0]).toEqual({ target: 'glibness', value: 1 });
		}
	});

	it("Johnson's Novelties has +2 glibness total and one-time use special effect", () => {
		const novelties = ACCOUTREMENT_MAP.get('johnsons_novelties')!;
		const glibTotal = novelties.modifiers
			.filter((m) => m.target === 'glibness')
			.reduce((sum, m) => sum + m.value, 0);
		expect(glibTotal).toBe(2);
		expect(novelties.specialEffects).toHaveLength(1);
		expect(novelties.specialEffects![0]).toContain('One-time use');
		expect(novelties.specialEffects![0]).toContain('Glibness roll');
	});

	it('A Box grants extra accoutrement and has setup special effect', () => {
		const box = ACCOUTREMENT_MAP.get('a_box')!;
		expect(box.grantsExtra).toEqual({ fromAnySlot: true, excludePointy: false });
		expect(box.specialEffects).toHaveLength(1);
		expect(box.specialEffects![0]).toContain('stood upon');
	});

	it('Leather Jack of Scum has setup special effect', () => {
		const jack = ACCOUTREMENT_MAP.get('leather_jack_of_scum')!;
		expect(jack.specialEffects).toHaveLength(1);
		expect(jack.specialEffects![0]).toContain('slathered');
	});

	it("Fool's Hat has conditional modifier vs Upper-Class and -1 authority", () => {
		const hat = ACCOUTREMENT_MAP.get('fools_hat')!;
		expect(hat.conditionalModifiers).toHaveLength(1);
		expect(hat.conditionalModifiers![0].description).toContain('Upper-Class');
		expect(hat.modifiers.find((m) => m.target === 'authority')!.value).toBe(-1);
	});

	it('Removable Moustache has conditional modifier vs French persons and -1 chastity', () => {
		const moustache = ACCOUTREMENT_MAP.get('removable_moustache')!;
		expect(moustache.conditionalModifiers).toHaveLength(1);
		expect(moustache.conditionalModifiers![0].description).toContain('French');
		expect(moustache.modifiers.find((m) => m.target === 'chastity')!.value).toBe(-1);
	});

	it('Punch and Judy Puppets has conditional modifier vs Lower-Class and -1 authority', () => {
		const puppets = ACCOUTREMENT_MAP.get('punch_and_judy_puppets')!;
		expect(puppets.conditionalModifiers).toHaveLength(1);
		expect(puppets.conditionalModifiers![0].description).toContain('Lower-Class');
		expect(puppets.modifiers.find((m) => m.target === 'authority')!.value).toBe(-1);
	});

	it('Sir Dagonet Mask has conditional modifier vs Knights of the Round Table', () => {
		const mask = ACCOUTREMENT_MAP.get('sir_dagonet_mask')!;
		expect(mask.conditionalModifiers).toHaveLength(1);
		expect(mask.conditionalModifiers![0].description).toContain('Knights of the Round Table');
	});

	it('all heartiness accoutrements have +1 heartiness as first modifier', () => {
		const heartAccs = ALL_ACCOUTREMENTS.filter((a) => a.slotId === 'heartiness');
		expect(heartAccs.length).toBe(10);
		for (const acc of heartAccs) {
			expect(acc.modifiers[0]).toEqual({ target: 'heartiness', value: 1 });
		}
	});

	it('Wooden Churn of Bodily Substance has conditional modifier vs Gumbys and -1 wisdom', () => {
		const churn = ACCOUTREMENT_MAP.get('wooden_churn_of_bodily_substance')!;
		expect(churn.conditionalModifiers).toHaveLength(1);
		expect(churn.conditionalModifiers![0].description).toContain('Gumbys');
		expect(churn.modifiers.find((m) => m.target === 'wisdom_in_the_ways_of_science')!.value).toBe(-1);
	});

	it('Surgical Stockings has +1 chastity and -1 decorum', () => {
		const stockings = ACCOUTREMENT_MAP.get('surgical_stockings')!;
		expect(stockings.modifiers.find((m) => m.target === 'chastity')!.value).toBe(1);
		expect(stockings.modifiers.find((m) => m.target === 'decorum')!.value).toBe(-1);
	});

	it('Sack of Ano-Weet POW! has +1 purpose and -1 decorum', () => {
		const pow = ACCOUTREMENT_MAP.get('sack_of_ano_weet_pow')!;
		expect(pow.modifiers.find((m) => m.target === 'purpose')!.value).toBe(1);
		expect(pow.modifiers.find((m) => m.target === 'decorum')!.value).toBe(-1);
	});

	it('all lorefulness accoutrements have +1 lorefulness as first modifier', () => {
		const loreAccs = ALL_ACCOUTREMENTS.filter((a) => a.slotId === 'lorefulness');
		expect(loreAccs.length).toBe(10);
		for (const acc of loreAccs) {
			expect(acc.modifiers[0]).toEqual({ target: 'lorefulness', value: 1 });
		}
	});

	it('A Short History of History Books has conditional modifier vs scholars and -1 argumentation', () => {
		const book = ACCOUTREMENT_MAP.get('short_history_of_history_books')!;
		expect(book.conditionalModifiers).toHaveLength(1);
		expect(book.conditionalModifiers![0].description).toContain('scholars');
		expect(book.modifiers.find((m) => m.target === 'argumentation')!.value).toBe(-1);
	});

	it('Short History of Chairs has conditional modifier vs Burghers and -1 glibness', () => {
		const chairs = ACCOUTREMENT_MAP.get('short_history_of_chairs')!;
		expect(chairs.conditionalModifiers).toHaveLength(1);
		expect(chairs.conditionalModifiers![0].description).toContain('Burghers');
		expect(chairs.modifiers.find((m) => m.target === 'glibness')!.value).toBe(-1);
	});

	it('World Encyclopaedia of Carnal Knowledge has +1 wisdom, -1 chastity, and special effects', () => {
		const enc = ACCOUTREMENT_MAP.get('world_encyclopaedia_of_carnal_knowledge')!;
		expect(enc.modifiers.find((m) => m.target === 'wisdom_in_the_ways_of_science')!.value).toBe(1);
		expect(enc.modifiers.find((m) => m.target === 'chastity')!.value).toBe(-1);
		expect(enc.specialEffects).toHaveLength(2);
		expect(enc.specialEffects![0]).toContain('celibates');
		expect(enc.specialEffects![1]).toContain('Naughty Pictures');
	});

	it('Clay Cup Sumerian has Holy Grail special effect', () => {
		const cup = ACCOUTREMENT_MAP.get('clay_cup_sumerian')!;
		expect(cup.specialEffects).toHaveLength(1);
		expect(cup.specialEffects![0]).toContain('Holy Grail');
	});

	it('Immovable-Type Printing Press requires a cart', () => {
		const press = ACCOUTREMENT_MAP.get('immovable_type_printing_press')!;
		expect(press.specialEffects).toHaveLength(1);
		expect(press.specialEffects![0]).toContain('cart');
	});

	it('Book of Armaments has +1 strategy', () => {
		const book = ACCOUTREMENT_MAP.get('book_of_armaments')!;
		expect(book.modifiers.find((m) => m.target === 'strategy')!.value).toBe(1);
	});

	it('all luck accoutrements have +1 luck as first modifier', () => {
		const luckAccs = ALL_ACCOUTREMENTS.filter((a) => a.slotId === 'luck');
		expect(luckAccs.length).toBe(10);
		for (const acc of luckAccs) {
			expect(acc.modifiers[0]).toEqual({ target: 'luck', value: 1 });
		}
	});

	it("Rabbit's Foot has +2 luck total and -1 animal husbandry", () => {
		const foot = ACCOUTREMENT_MAP.get('rabbits_foot')!;
		const luckTotal = foot.modifiers
			.filter((m) => m.target === 'luck')
			.reduce((sum, m) => sum + m.value, 0);
		expect(luckTotal).toBe(2);
		expect(foot.modifiers.find((m) => m.target === 'animal_husbandry')!.value).toBe(-1);
	});

	it('Pagan Goddess Figurine has conditional modifier vs Barbarians and -1 purpose', () => {
		const figurine = ACCOUTREMENT_MAP.get('pagan_goddess_figurine')!;
		expect(figurine.conditionalModifiers).toHaveLength(1);
		expect(figurine.conditionalModifiers![0].description).toContain('Barbarians');
		expect(figurine.modifiers.find((m) => m.target === 'purpose')!.value).toBe(-1);
	});

	it('Garden Gnome has conditional modifier vs Vikings and -1 authority', () => {
		const gnome = ACCOUTREMENT_MAP.get('garden_gnome')!;
		expect(gnome.conditionalModifiers).toHaveLength(1);
		expect(gnome.conditionalModifiers![0].description).toContain('Vikings');
		expect(gnome.modifiers.find((m) => m.target === 'authority')!.value).toBe(-1);
	});

	it("Deer Antler Hat has conditional modifier vs Knights Who Say 'Ni' and -1 subtlety", () => {
		const hat = ACCOUTREMENT_MAP.get('deer_antler_hat')!;
		expect(hat.conditionalModifiers).toHaveLength(1);
		expect(hat.conditionalModifiers![0].description).toContain("Knights Who Say 'Ni'");
		expect(hat.modifiers.find((m) => m.target === 'subtlety')!.value).toBe(-1);
	});

	it('Pouch of 13 Sacred Acorns has Currency special effect', () => {
		const pouch = ACCOUTREMENT_MAP.get('pouch_of_13_sacred_acorns')!;
		expect(pouch.specialEffects).toHaveLength(1);
		expect(pouch.specialEffects![0]).toContain('Currency');
	});

	it('Stone Gargoyle has cart and Monstrosity special effects', () => {
		const gargoyle = ACCOUTREMENT_MAP.get('stone_gargoyle')!;
		expect(gargoyle.specialEffects).toHaveLength(2);
		expect(gargoyle.specialEffects![0]).toContain('cart');
		expect(gargoyle.specialEffects![1]).toContain('Monstrosity');
	});

	it('all nimbleness accoutrements have +1 nimbleness as first modifier', () => {
		const nimbAccs = ALL_ACCOUTREMENTS.filter((a) => a.slotId === 'nimbleness');
		expect(nimbAccs.length).toBe(10);
		for (const acc of nimbAccs) {
			expect(acc.modifiers[0]).toEqual({ target: 'nimbleness', value: 1 });
		}
	});

	it('Halitosis-Brand Body Rub has conditional modifier vs Gumbys and -1 decorum', () => {
		const rub = ACCOUTREMENT_MAP.get('halitosis_brand_body_rub')!;
		expect(rub.conditionalModifiers).toHaveLength(1);
		expect(rub.conditionalModifiers![0].description).toContain('Gumbys');
		expect(rub.modifiers.find((m) => m.target === 'decorum')!.value).toBe(-1);
	});

	it('Split-Crotch Breeches has +2 nimbleness total', () => {
		const breeches = ACCOUTREMENT_MAP.get('split_crotch_breeches')!;
		const nimbTotal = breeches.modifiers
			.filter((m) => m.target === 'nimbleness')
			.reduce((sum, m) => sum + m.value, 0);
		expect(nimbTotal).toBe(2);
	});

	it('Pixie Hat with Pointy Ears is pointy, has -1 sorcery, and pixies attack', () => {
		const hat = ACCOUTREMENT_MAP.get('pixie_hat_with_pointy_ears')!;
		expect(hat.pointy).toBe(true);
		expect(hat.modifiers.find((m) => m.target === 'sorcery')!.value).toBe(-1);
		expect(hat.modifiers.find((m) => m.target === 'druidry')!.value).toBe(1);
		expect(hat.specialEffects).toHaveLength(1);
		expect(hat.specialEffects![0]).toContain('Pixies');
	});

	it('Llama-Skin Gloves has +1 glibness and llamas attack', () => {
		const gloves = ACCOUTREMENT_MAP.get('llama_skin_gloves')!;
		expect(gloves.modifiers.find((m) => m.target === 'glibness')!.value).toBe(1);
		expect(gloves.specialEffects).toHaveLength(1);
		expect(gloves.specialEffects![0]).toContain('Llamas');
	});

	it('Pouch of Rid-a-Weasel has conditional modifier vs woodland creatures, -1 heartiness, and one-time use', () => {
		const pouch = ACCOUTREMENT_MAP.get('pouch_of_rid_a_weasel')!;
		expect(pouch.conditionalModifiers).toHaveLength(1);
		expect(pouch.conditionalModifiers![0].description).toContain('small woodland creatures');
		expect(pouch.modifiers.find((m) => m.target === 'heartiness')!.value).toBe(-1);
		expect(pouch.specialEffects).toHaveLength(2);
		expect(pouch.specialEffects![0]).toContain('talcum powder');
		expect(pouch.specialEffects![1]).toContain('One-time use');
	});
});

describe('getAvailableAccoutrements', () => {
	it('returns all valour accoutrements when player has a retainer', () => {
		const available = getAvailableAccoutrements('valour', true);
		const allValour = ALL_ACCOUTREMENTS.filter((a) => a.slotId === 'valour');
		expect(available).toHaveLength(allValour.length);
	});

	it('excludes retainer-required accoutrements when player has no retainer', () => {
		const available = getAvailableAccoutrements('valour', false);
		const withoutRetainerReq = ALL_ACCOUTREMENTS.filter(
			(a) => a.slotId === 'valour' && !a.requires?.retainer
		);
		expect(available).toHaveLength(withoutRetainerReq.length);
		expect(available.find((a) => a.id === 'burlington_wallbanger')).toBeUndefined();
	});

	it('returns empty for a trait with no accoutrements', () => {
		expect(getAvailableAccoutrements('sorcery', true)).toEqual([]);
	});

	it('returns empty for unknown trait', () => {
		expect(getAvailableAccoutrements('nonexistent', true)).toEqual([]);
	});
});

describe('getExtraAccoutrementOptions', () => {
	it('returns options for Cloth Sack (fromAnySlot, excludePointy)', () => {
		const options = getExtraAccoutrementOptions('cloth_sack', true);
		expect(options.length).toBeGreaterThan(0);
		// Should not include Cloth Sack itself
		expect(options.find((a) => a.id === 'cloth_sack')).toBeUndefined();
	});

	it('excludes pointy accoutrements from Cloth Sack options', () => {
		const options = getExtraAccoutrementOptions('cloth_sack', true);
		for (const acc of options) {
			expect(acc.pointy).toBeFalsy();
		}
	});

	it('returns empty for accoutrements without grantsExtra', () => {
		expect(getExtraAccoutrementOptions('knightly_armour', true)).toEqual([]);
	});

	it('returns empty for unknown accoutrement', () => {
		expect(getExtraAccoutrementOptions('nonexistent', true)).toEqual([]);
	});

	it('excludes retainer-required accoutrements when no retainer', () => {
		const withRetainer = getExtraAccoutrementOptions('cloth_sack', true);
		const withoutRetainer = getExtraAccoutrementOptions('cloth_sack', false);
		expect(withoutRetainer.length).toBeLessThanOrEqual(withRetainer.length);
		expect(withoutRetainer.find((a) => a.requires?.retainer)).toBeUndefined();
	});
});
