import {writable} from 'svelte/store';

// The design is dark-only: the light variants have white text on a white page and are unreadable,
// so the theme does not follow prefers-color-scheme.
export const isDarkMode = writable(true);

export function toggleTheme() {
  isDarkMode.update((dark) => !dark);
}
