# React Version - Socials

This is a React + TypeScript + Vite implementation of the Socials website, converted from the original Svelte version.

## Features

- ⚛️ React 18 with TypeScript
- ⚡️ Vite for fast builds and HMR
- 🎨 Tailwind CSS for styling
- 🔥 Firebase integration for analytics
- 🌐 Multi-language support (EN/FI)
- 🌤️ Weather integration
- �� Particle system animations
- 📱 Fully responsive design

## Tech Stack

- **React** - UI framework
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
├── components/       # React components
│   ├── Hero.tsx
│   ├── Links.tsx
│   ├── Nav.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/             # Utilities and services
│   ├── constants.ts
│   ├── firebase.ts
│   ├── visitorTracking.ts
│   └── weather.ts
├── stores/          # State management hooks
│   ├── useTheme.ts
│   └── useLanguage.ts
├── types/           # TypeScript types
│   └── index.ts
└── App.tsx         # Main app component
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

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT
