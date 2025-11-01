# Vue Version - Socials

This is a Vue 3 + TypeScript + Vite implementation of the Socials website, converted from the original Svelte version.

## Features

- 🖖 Vue 3 with Composition API
- ⚡️ Vite for fast builds and HMR
- 🎨 Tailwind CSS for styling
- 🔥 Firebase integration for analytics
- 🌐 Multi-language support (EN/FI)
- 🌤️ Weather integration
- 🎭 Particle system animations
- 📱 Fully responsive design

## Tech Stack

- **Vue 3** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Firebase** - Backend services
- **Lodash** - Utilities

## Getting Started

### Install dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Vue components
│   ├── Hero.vue
│   ├── Links.vue
│   ├── Nav.vue
│   ├── Footer.vue
│   └── ...
├── composables/     # Vue composables
│   ├── useTheme.ts
│   └── useLanguage.ts
├── lib/             # Utilities and services
│   ├── constants.ts
│   ├── firebase.ts
│   ├── visitorTracking.ts
│   └── weather.ts
├── types/           # TypeScript types
│   └── index.ts
└── App.vue         # Main app component
```

## Components

### Hero
Main hero section with profile image, particle system, and intro text.

### Links
Social media links with hover effects.

### Nav
Navigation bar with language toggle and weather display.

### Footer
Footer with contact information and build date.

## Composables

### useTheme
Manages dark mode state based on user preferences.

### useLanguage
Manages language state (EN/FI) with toggle functionality.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

MIT
