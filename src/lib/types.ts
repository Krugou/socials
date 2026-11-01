export type Language = 'en' | 'fi';

export type NavLinkId = 'home' | 'repositories' | 'contact';

export interface NavLink {
  id: NavLinkId;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  title: string;
  url: string;
  /** Path of a self-hosted icon under static/icons */
  icon: string;
}

export interface ProjectLink extends SocialLink {
  description: Record<Language, string>;
  tags: string[];
  /** Source repository */
  repo: string;
}

export interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
}
