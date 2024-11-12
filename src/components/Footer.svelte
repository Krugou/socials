<script lang="ts">
  import {language} from '../lib/stores.js';
  import type {Translations} from '../lib/types.js';

  const translations: Pick<Translations, 'en' | 'fi'> = {
    en: {
      madeWith: 'Made with',
      emailAriaLabel: 'Send email to Aleksi Nokelainen',
      builtOn: 'Built on'
    },
    fi: {
      madeWith: 'Tehty käyttäen',
      emailAriaLabel: 'Lähetä sähköpostia Aleksi Nokelaiselle',
      builtOn: 'Rakennettu'
    }
  };
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
</script>

<footer class="mt-auto w-full px-6 py-4">
  <div class="mx-auto max-w-xl">
    <a
      href="mailto:aleksi.nokelainen@gmail.com"
      class="mb-2 flex items-center justify-center text-sm text-white/60 transition-colors duration-300 hover:text-white/90"
      aria-label={translations[$language].emailAriaLabel}
      title={translations[$language].emailAriaLabel}
    >
      aleksi.nokelainen@gmail.com
    </a>
    <div
      class="flex items-center justify-center space-x-2 text-white/60 transition-colors duration-300 hover:text-white/90"
    >
      <span class="text-sm">{translations[$language].madeWith}</span>
      <svg
        class="animate-spin-slow h-5 w-5"
        viewBox="0 0 98.1 118"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Svelte logo"
      >
        <path
          fill="currentColor"
          d="M91.8 15.6C80.9-.1 59.2-4.7 43.6 5.2L16.1 22.8C8.6 27.5 3.4 35.2 1.9 43.9c-1.3 7.3-.2 14.8 3.3 21.3-2.4 3.6-4 7.6-4.7 11.8-1.6 8.9.5 18.1 5.7 25.4 11 15.7 32.6 20.3 48.2 10.4l27.5-17.5c7.5-4.7 12.7-12.4 14.2-21.1 1.3-7.3.2-14.8-3.3-21.3 2.4-3.6 4-7.6 4.7-11.8 1.7-9-.4-18.2-5.7-25.5"
        />
      </svg>
      <span class="text-sm font-medium">Svelte</span>
    </div>

    <div class="mt-4 text-center text-sm text-white/60">
      {translations[$language].builtOn}
      {new Date().toLocaleDateString($language, dateFormatOptions)}
    </div>
  </div>
</footer>

<style>
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
</style>
