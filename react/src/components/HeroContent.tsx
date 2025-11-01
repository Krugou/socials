import type { Language, Translations } from '../types';

interface HeroContentProps {
  visible: boolean;
  scrollY: number;
  language: Language;
}

const translations: Translations = {
  en: {
    title: 'Aleksi Nokelainen',
    description:
      'Full Stack Developer passionate about creating intuitive software solutions. Proficient in JavaScript, TypeScript, React, Node.js, Svelte, and Python.',
    buildDateError: 'Error calculating build date',
  },
  fi: {
    title: 'Aleksi Nokelainen',
    description:
      'Full Stack -kehittäjä, joka on intohimoinen luomaan intuitiivisia ohjelmistoratkaisuja. Vahva osaaminen JavaScript, TypeScript, React, Node.js, Svelte ja Python -teknologioissa.',
    buildDateError: 'Virhe rakennuspäivämäärän laskemisessa',
  },
};

function getTranslation(lang: Language) {
  return translations[lang] ?? translations.en;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  visible,
  scrollY,
  language,
}) => {
  return (
    <div
      className="relative z-10 mt-20"
      style={{ transform: `translateY(${scrollY * 0.1}px)` }}
    >
      {visible ? (
        <>
          <h1 className="bg-gradient-to-r text-4xl font-bold text-transparent from-purple-200 to-blue-400 from-primary-80 to-secondary-80 bg-clip-text">
            {getTranslation(language).title}
          </h1>
          <p className="mx-auto max-w-2xl bg-gradient-to-r bg-clip-text px-4 py-4 text-sm font-bold leading-relaxed text-transparent transition-all duration-1000 ease-in-out md:text-lg from-purple-400 to-blue-500 from-primary-60 to-secondary-60 hover:from-blue-200 hover:to-purple-200 hover:from-secondary-80 hover:to-primary-80">
            {getTranslation(language).description}
          </p>
        </>
      ) : (
        <>
          <div className="mx-auto mb-4 h-8 w-64 animate-pulse rounded bg-white/10"></div>
          <div className="mx-auto h-20 w-96 animate-pulse rounded bg-white/10"></div>
        </>
      )}
    </div>
  );
};
