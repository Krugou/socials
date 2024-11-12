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
  en: Translation & FooterTranslation;
  fi: Translation & FooterTranslation;
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
