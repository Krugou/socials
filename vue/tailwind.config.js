import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#18181b',
          soft: '#232336',
          card: '#232336',
          accent: '#2d2d44',
        },
        primary: {
          DEFAULT: '#8b5cf6',
          dark: '#6d28d9',
        },
        secondary: {
          DEFAULT: '#0ea5e9',
          dark: '#0369a1',
        },
        muted: '#a1a1aa',
        foreground: '#f4f4f5',
        border: '#27272a',
      },
    },
  },
  plugins: [typography, forms, containerQueries, aspectRatio],
}

