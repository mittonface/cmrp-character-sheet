import type { CharacterData } from './types';

const STORAGE_KEY = 'cmrp-character-data';

/**
 * Save character data to localStorage.
 */
export function saveCharacter(data: CharacterData): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch {
		// localStorage may be unavailable (SSR, private browsing quota, etc.)
	}
}

/**
 * Load character data from localStorage.
 * Returns undefined if nothing is saved or data is invalid.
 */
export function loadCharacter(): CharacterData | undefined {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return undefined;
		const data = JSON.parse(raw);
		// Basic shape validation
		if (typeof data === 'object' && data !== null && typeof data.situation === 'string') {
			return data as CharacterData;
		}
	} catch {
		// Corrupted or unavailable
	}
	return undefined;
}

/**
 * Clear saved character data from localStorage.
 */
export function clearSavedCharacter(): void {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {
		// localStorage may be unavailable
	}
}
