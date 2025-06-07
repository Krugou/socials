import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		// Extend with custom dark palette
		extend: {
			colors: {
				background: {
					DEFAULT: '#18181b', // true dark
					soft: '#232336',
					card: '#232336',
					accent: '#2d2d44',
				},
				primary: {
					DEFAULT: '#8b5cf6', // purple-500
					dark: '#6d28d9',
				},
				secondary: {
					DEFAULT: '#0ea5e9', // sky-500
					dark: '#0369a1',
				},
				muted: '#a1a1aa',
				foreground: '#f4f4f5',
				border: '#27272a',
			}
		}
	},

	plugins: [typography, forms, containerQueries, aspectRatio]
} satisfies Config;
