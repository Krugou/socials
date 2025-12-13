import { useState } from 'react';
import type { Language } from '../types';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'fi' : 'en'));
  };

  return { language, setLanguage, toggleLanguage };
};
