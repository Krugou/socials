import { ref } from 'vue';
import type { Language } from '../types';

export const useLanguage = () => {
  const language = ref<Language>('en');

  const toggleLanguage = () => {
    language.value = language.value === 'en' ? 'fi' : 'en';
  };

  return { language, toggleLanguage };
};
