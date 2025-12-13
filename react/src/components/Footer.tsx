import { useState, useEffect } from 'react';
import type { Language, Translations } from '../types';

interface FooterProps {
  language: Language;
  isDarkMode: boolean;
}

const translations: Pick<Translations, 'en' | 'fi'> = {
  en: {
    madeWith: 'Made with',
    emailAriaLabel: 'Send email to Aleksi Nokelainen',
    builtOn: 'Built on',
    buildDateError: 'Build date unavailable',
  },
  fi: {
    madeWith: 'Tehty käyttäen',
    emailAriaLabel: 'Lähetä sähköpostia Aleksi Nokelaiselle',
    builtOn: 'Rakennettu',
    buildDateError: 'Rakennuspäivämäärä ei saatavilla',
  },
};

export const Footer: React.FC<FooterProps> = ({ language, isDarkMode }) => {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      const date = new Date();
      setFormattedDate(
        date.toLocaleDateString(language, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      );
    } catch (error) {
      console.error('Error formatting build date:', error);
      setHasError(true);
    }
  }, [language]);

  return (
    <footer
      className={`mt-auto w-full px-6 py-4 border-t ${
        isDarkMode
          ? 'bg-background/80 border-border'
          : 'bg-white/10 border-white/10'
      }`}
    >
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        <a
          href="mailto:aleksi.nokelainen@gmail.com"
          className={`flex items-center justify-center text-sm transition-colors duration-300 ${
            isDarkMode
              ? 'text-muted hover:text-foreground'
              : 'text-white/60 hover:text-white/90'
          }`}
          aria-label={translations[language].emailAriaLabel}
          title={translations[language].emailAriaLabel}
        >
          aleksi.nokelainen@gmail.com
        </a>
        <div
          className={`flex items-center justify-center transition-colors duration-300 ${
            isDarkMode
              ? 'text-muted hover:text-foreground'
              : 'text-white/60 hover:text-white/90'
          }`}
        >
          <span className="px-2 text-sm">{translations[language].madeWith}</span>
          <svg
            className="animate-spin-slow h-5 w-5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="React logo"
            fill="currentColor"
          >
            <circle cx="12" cy="12" r="2.5" />
            <g className="react-orbit">
              <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="currentColor" strokeWidth="1" />
              <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(60 12 12)" />
              <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(120 12 12)" />
            </g>
          </svg>
          <span className="px-2 text-sm font-medium">React</span>
        </div>
        <div
          className={`text-center text-sm transition-colors duration-300 ${
            isDarkMode
              ? 'text-muted hover:text-foreground'
              : 'text-white/60 hover:text-white/90'
          }`}
        >
          {translations[language].builtOn}
          {formattedDate && !hasError ? (
            <span> {formattedDate}</span>
          ) : (
            <span className="text-red-400" role="alert">
              {' '}
              {translations[language].buildDateError}
            </span>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </footer>
  );
};
