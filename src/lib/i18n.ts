import {derived} from 'svelte/store';
import {language} from './stores.js';
import type {Language, NavLinkId} from './types.js';

const en = {
  skipToContent: 'Skip to content',
  profileAlt: 'Portrait of Aleksi Nokelainen',
  nav: {
    links: {
      home: {text: 'Home', ariaLabel: 'Navigate to home page'},
      repositories: {text: 'Repositories', ariaLabel: 'View code repositories'},
      contact: {text: 'Contact', ariaLabel: 'Contact me'},
    } satisfies Record<NavLinkId, {text: string; ariaLabel: string}>,
    github: 'Visit GitHub Profile',
    switchLanguage: 'Switch to Finnish',
    languageButton: 'FI',
    weatherLoading: 'Loading weather...',
    weatherUnavailable: 'Weather unavailable',
  },
  hero: {
    title: 'Aleksi Nokelainen',
    description:
      'Full Stack Developer passionate about creating intuitive software solutions. Proficient in JavaScript, TypeScript, React, Node.js, Svelte, and Python.',
  },
  links: {
    moreProjects: (count: number) => `More personal projects (${count})`,
    source: 'Source',
    sourceCode: 'Source code',
  },
  footer: {
    madeWith: 'Made with',
    emailAriaLabel: 'Send email to Aleksi Nokelainen',
    builtOn: 'Built on',
    buildDateError: 'Build date unavailable',
  },
  repos: {
    pageTitle: 'GitHub Repositories | Aleksi Nokelainen',
    pageDescription:
      'Public GitHub repositories by Aleksi Nokelainen, most recently updated first.',
    heading: 'GitHub Repositories',
    loading: 'Loading repositories',
    updated: 'Updated',
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: (days: number) => `${days} days ago`,
    fetchError: 'Failed to fetch repositories',
    unknownError: 'Unknown error occurred',
    empty: 'No repositories found.',
  },
  error: {
    notFound: 'Page not found',
    goHome: 'Go Home',
  },
  home: {
    pageTitle: 'Aleksi Nokelainen | Full Stack Developer',
  },
};

type Strings = typeof en;

const fi: Strings = {
  skipToContent: 'Siirry sisältöön',
  profileAlt: 'Muotokuva Aleksi Nokelaisesta',
  nav: {
    links: {
      home: {text: 'Etusivu', ariaLabel: 'Siirry etusivulle'},
      repositories: {text: 'Repositoriot', ariaLabel: 'Katso koodivarastot'},
      contact: {text: 'Yhteystiedot', ariaLabel: 'Ota yhteyttä'},
    },
    github: 'Siirry GitHub profiiliin',
    switchLanguage: 'Vaihda englantiin',
    languageButton: 'EN',
    weatherLoading: 'Ladataan säätä...',
    weatherUnavailable: 'Sää ei saatavilla',
  },
  hero: {
    title: 'Aleksi Nokelainen',
    description:
      'Full Stack -kehittäjä, joka on intohimoinen luomaan intuitiivisia ohjelmistoratkaisuja. Vahva osaaminen JavaScript, TypeScript, React, Node.js, Svelte ja Python -teknologioissa.',
  },
  links: {
    moreProjects: (count: number) => `Lisää omia projekteja (${count})`,
    source: 'Koodi',
    sourceCode: 'Lähdekoodi',
  },
  footer: {
    madeWith: 'Tehty käyttäen',
    emailAriaLabel: 'Lähetä sähköpostia Aleksi Nokelaiselle',
    builtOn: 'Rakennettu',
    buildDateError: 'Rakennuspäivämäärä ei saatavilla',
  },
  repos: {
    pageTitle: 'GitHub-repositoriot | Aleksi Nokelainen',
    pageDescription: 'Aleksi Nokelaisen julkiset GitHub-repositoriot, viimeksi päivitetyt ensin.',
    heading: 'GitHub-repositoriot',
    loading: 'Ladataan repositorioita',
    updated: 'Päivitetty',
    today: 'Tänään',
    yesterday: 'Eilen',
    daysAgo: (days: number) => `${days} päivää sitten`,
    fetchError: 'Repositorioiden haku epäonnistui',
    unknownError: 'Tuntematon virhe',
    empty: 'Repositorioita ei löytynyt.',
  },
  error: {
    notFound: 'Sivua ei löytynyt',
    goHome: 'Etusivulle',
  },
  home: {
    pageTitle: 'Aleksi Nokelainen | Full Stack -kehittäjä',
  },
};

export const translations: Record<Language, Strings> = {en, fi};

/** Strings for the current language */
export const t = derived(language, ($language) => translations[$language]);
