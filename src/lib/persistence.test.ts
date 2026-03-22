import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  saveCharacter,
  loadCharacter,
  clearSavedCharacter,
} from './persistence';
import type { CharacterData } from './types';

const mockCharacter: CharacterData = {
  name: 'Sir Robin',
  situation: 'knight',
  socialClass: 'upper',
  deathStatus: 'mr_neutron',
  loonyStatus: 'reginald_maudling',
  slots: [{ type: 'trait', traitId: 'valour', required: true }],
  traitValues: { valour: 12 },
  accoutrements: {},
  currencies: {},
  choiceSelections: {},
  selections: {},
};

// Mock localStorage
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key];
  }),
};

beforeEach(() => {
  for (const key of Object.keys(store)) delete store[key];
  vi.stubGlobal('localStorage', localStorageMock);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('persistence', () => {
  describe('saveCharacter / loadCharacter', () => {
    it('round-trips character data through localStorage', () => {
      saveCharacter(mockCharacter);
      const loaded = loadCharacter();
      expect(loaded).toEqual(mockCharacter);
    });

    it('returns undefined when nothing is saved', () => {
      expect(loadCharacter()).toBeUndefined();
    });

    it('returns undefined for corrupted data', () => {
      store['cmrp-character-data'] = 'not json';
      expect(loadCharacter()).toBeUndefined();
    });

    it('returns undefined for data missing situation field', () => {
      store['cmrp-character-data'] = JSON.stringify({ name: 'test' });
      expect(loadCharacter()).toBeUndefined();
    });
  });

  describe('clearSavedCharacter', () => {
    it('removes saved data', () => {
      saveCharacter(mockCharacter);
      clearSavedCharacter();
      expect(loadCharacter()).toBeUndefined();
    });
  });
});
