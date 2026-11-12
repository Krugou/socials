// src/lib/links.ts
// Content for the link list. Edit this file to add or change links, no UI code needed.
import {asset} from '$app/paths';
import type {AssetPath} from '$app/types';
import type {ProjectLink, SocialLink} from './types.js';

type IconAsset = Extract<AssetPath, `icons/${string}`>;

const icon = (path: IconAsset): string => asset(path);

/** Social links shown before the projects */
export const primaryLinks: SocialLink[] = [
  {title: 'GitHub', url: 'https://github.com/krugou', icon: icon('icons/github.svg')},
  {
    title: 'Instagram',
    url: 'https://www.instagram.com/krugou/',
    icon: icon('icons/instagram.svg'),
  },
  {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/aleksi-nokelainen-3706b7259/',
    icon: icon('icons/linkedin.svg'),
  },
];

/** Project shown on its own above the accordion */
export const featuredProject: ProjectLink = {
  title: 'AuroraWatcher',
  url: 'https://krugou.github.io/aurorawatcher/',
  icon: icon('icons/aurorawatcher.png'),
  repo: 'https://github.com/Krugou/aurorawatcher',
  description: {
    en: 'Aurora forecasts, magnetic data and live observatory cameras for Finland, with a Discord bot.',
    fi: 'Revontuliennusteet, magneettikenttädata ja observatorioiden livekamerat Suomesta sekä Discord-botti.',
  },
  tags: ['React', 'TypeScript', 'Vite', 'Discord bot'],
};

/** Personal project websites listed in the accordion */
export const projects: ProjectLink[] = [
  {
    title: 'Swim',
    url: 'https://krugou.github.io/swim/fi/',
    icon: icon('icons/swim.png'),
    repo: 'https://github.com/Krugou/swim',
    description: {
      en: 'Live reservation schedules for Espoo swimming halls, so you can see when a pool is free.',
      fi: 'Espoon uimahallien varaustilanne livenä, jotta näet milloin allas on vapaana.',
    },
    tags: ['Next.js', 'TypeScript', 'Tailwind'],
  },
  {
    title: 'Bensa',
    url: 'https://krugou-bensa.web.app/fi',
    icon: icon('icons/bensa.png'),
    repo: 'https://github.com/Krugou/bensa',
    description: {
      en: 'Real-time fuel prices for the Helsinki region with a station map and price history.',
      fi: 'Pääkaupunkiseudun polttoaineiden hinnat reaaliajassa, asemakartta ja hintahistoria.',
    },
    tags: ['React', 'Firebase', 'Puppeteer'],
  },
  {
    title: 'Tuntipalkkalaskuri',
    url: 'https://krugou.github.io/tuntipalkkalaskuri/',
    icon: icon('icons/tuntipalkkalaskuri.png'),
    repo: 'https://github.com/Krugou/tuntipalkkalaskuri',
    description: {
      en: 'Hourly wage calculator with Finnish net-pay estimates. Installable and works offline.',
      fi: 'Tuntipalkkalaskuri suomalaisilla nettopalkka-arvioilla. Asennettava ja toimii offline-tilassa.',
    },
    tags: ['Svelte', 'TypeScript', 'PWA'],
  },
  {
    title: 'Aquatic Harvesting',
    url: 'https://krugou.github.io/aquaticharvesting/',
    icon: icon('icons/aquaticharvesting.png'),
    repo: 'https://github.com/Krugou/aquaticharvesting',
    description: {
      en: 'Browser game about clearing overgrown lakes with a harvesting boat and upgrading your fleet.',
      fi: 'Selainpeli, jossa raivataan umpeenkasvaneita järviä ruoppausveneellä ja päivitetään kalustoa.',
    },
    tags: ['Three.js', 'TypeScript', 'Game'],
  },
  {
    title: 'Tieliikenne Video Wall',
    url: 'https://krugou.github.io/tieliikennevideowall/?cities=vantaa%2Cespoo%2Chelsinki',
    icon: icon('icons/tieliikennevideowall.svg'),
    repo: 'https://github.com/Krugou/tieliikennevideowall',
    description: {
      en: 'Full-screen wall of Finnish traffic cameras from Digitraffic, by city.',
      fi: 'Koko näytön seinä Digitrafficin liikennekameroista kaupungeittain.',
    },
    tags: ['React', 'Vite', 'Tailwind'],
  },
  {
    title: 'Saunatime',
    url: 'https://krugou.github.io/saunatime/',
    icon: icon('icons/saunatime.svg'),
    repo: 'https://github.com/Krugou/saunatime',
    description: {
      en: 'Average cost of a sauna session in Finland, calculated from spot electricity prices.',
      fi: 'Saunomisen keskimääräinen hinta Suomessa pörssisähkön hinnoista laskettuna.',
    },
    tags: ['TypeScript', 'Sauna'],
  },
];

/** Remaining social links, shown after the projects */
export const otherLinks: SocialLink[] = [
  {title: 'Threads', url: 'https://threads.net/krugou', icon: icon('icons/threads.svg')},
  {title: 'Twitter', url: 'https://x.com/krugou', icon: icon('icons/twitter.svg')},
  {
    title: 'Bluesky',
    url: 'https://bsky.app/profile/krugou.bsky.social',
    icon: icon('icons/bluesky.svg'),
  },
  {title: 'YouTube', url: 'https://www.youtube.com/@Krugou', icon: icon('icons/youtube.svg')},
];

/** Profile URLs for structured data (schema.org sameAs) */
export const sameAs: string[] = [...primaryLinks, ...otherLinks].map((link) => link.url);
