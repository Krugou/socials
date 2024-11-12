import { writable } from 'svelte/store';
import type { Language } from './types';

export const language = writable<Language>('en');