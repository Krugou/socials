// src/lib/constants.ts
import type {NavLink} from './types.js';

export const DEFAULT_LANGUAGE = 'en';

export const NAV_LINKS: NavLink[] = [
  {
    translations: {
      en: {text: 'Home', ariaLabel: 'Navigate to home page'},
      fi: {text: 'Etusivu', ariaLabel: 'Siirry etusivulle'},
    },
    href: '/',
  },
  {
    translations: {
      en: {text: 'Repositories', ariaLabel: 'View code repositories'},
      fi: {text: 'Repositoriot', ariaLabel: 'Katso koodivarastot'},
    },
    href: '/repositories',
  },
  {
    translations: {
      en: {text: 'Portfolio', ariaLabel: 'View portfolio'},
      fi: {text: 'Portfolio', ariaLabel: 'Katso portfolio'},
    },
    href: 'https://krugou.github.io',
    external: true,
  },
  {
    translations: {
      en: {text: 'Contact', ariaLabel: 'Contact me'},
      fi: {text: 'Yhteystiedot', ariaLabel: 'Ota yhteyttä'},
    },
    href: 'mailto:aleksi.nokelainen@gmail.com',
    external: true,
  },
];
