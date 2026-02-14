import {writable} from 'svelte/store';

export const isDarkMode = writable(
  typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : true,
);

export function toggleTheme() {
  isDarkMode.update((dark) => !dark);
}
