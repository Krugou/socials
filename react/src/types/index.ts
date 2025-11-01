export interface Translation {
  title?: string;
  description?: string;
}

export interface FooterTranslation {
  madeWith?: string;
  emailAriaLabel?: string;
  builtOn?: string;
}

export interface Translations {
  en: {
    title?: string;
    description?: string;
    madeWith?: string;
    emailAriaLabel?: string;
    builtOn?: string;
    buildDateError: string;
  };
  fi: {
    title?: string;
    description?: string;
    madeWith?: string;
    emailAriaLabel?: string;
    builtOn?: string;
    buildDateError: string;
  };
}

export type Language = keyof Translations;

export interface NavLinkTranslation {
  text: string;
  ariaLabel?: string;
}

export interface NavLink {
  translations: Record<Language, NavLinkTranslation>;
  href: string;
  external?: boolean;
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface SpringOptions {
  stiffness: number;
  damping: number;
}

export interface SocialLink {
  title: string;
  url: string;
  icon: string;
}

export interface Particle {
  id: number;
  size: number;
  speed: number;
  orbit: number;
  offset: number;
  color: string;
}

export interface ParticleConfig {
  minSize: number;
  maxSize: number;
  minSpeed: number;
  maxSpeed: number;
  minOrbit: number;
  maxOrbit: number;
}

export interface WeatherData {
  temperature: number;
  description: string;
}
