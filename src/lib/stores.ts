import {writable} from 'svelte/store';
import type {Language} from './types.js';

export const language = writable<Language>('en');
