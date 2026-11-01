// src/lib/constants.ts
import type {NavLink} from './types.js';

export const DEFAULT_LANGUAGE = 'en';

export const NAV_LINKS: NavLink[] = [
  {id: 'home', href: '/'},
  {id: 'repositories', href: '/repositories'},
  {id: 'contact', href: 'mailto:aleksi.nokelainen@gmail.com', external: true},
];
