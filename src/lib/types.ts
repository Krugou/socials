export interface Translation {
  title: string;
  description: string;
}

export interface Translations {
  en: Translation;
  fi: Translation;
}

export type Language = keyof Translations;