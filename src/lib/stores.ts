import {writable} from 'svelte/store';
import type {Language} from './types.js';

const STORAGE_KEY = 'language';

/**
 * Picks the saved language, falling back to the browser language (Finnish or English)
 */
const detectLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'fi') return saved;
  } catch {
    // Storage unavailable, fall through to browser language
  }
  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('fi')
    ? 'fi'
    : 'en';
};

export const language = writable<Language>(detectLanguage());

language.subscribe((value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage unavailable, the choice just is not remembered
  }
});
