<script lang="ts">
  import {language} from '../lib/stores.js';
  import type {Translations} from '../lib/types.js';
  import {onMount} from 'svelte';
  import {isDarkMode} from '../stores/theme.js';

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
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const getBuildDate = (): Date => {
    try {
      // @ts-expect-error: BUILD_TIME is injected during build
      const buildTime = __BUILD_TIME__;
      if (!buildTime) throw new Error('No build time defined');

      const date = new Date(buildTime);
      // Validate the date is valid
      if (isNaN(date.getTime())) throw new Error('Invalid build time');

      return date;
    } catch (error) {
      console.warn('Build time not available:', error);
      return new Date();
    }
  };

  let formattedDate: string | null = null;
  let hasError = false;

  onMount(() => {
    try {
      const date = getBuildDate();
      formattedDate = date.toLocaleDateString($language, dateFormatOptions);
    } catch (error) {
      console.error('Error formatting build date:', error);
      hasError = true;
    }
  });
</script>

<footer
  class="mt-auto w-full border-t px-6 py-4"
  class:bg-background-80={$isDarkMode}
  class:bg-white-10={!$isDarkMode}
  class:border-border={$isDarkMode}
  class:border-white-10={!$isDarkMode}
>
  <div class="mx-auto flex max-w-xl flex-col gap-4">
    <a
      href="mailto:aleksi.nokelainen@gmail.com"
      class="flex items-center justify-center text-sm transition-colors duration-300"
      class:text-muted={$isDarkMode}
      class:text-white-60={!$isDarkMode}
      class:hover:text-foreground={$isDarkMode}
      class:hover:text-white-90={!$isDarkMode}
      aria-label={translations[$language].emailAriaLabel}
      title={translations[$language].emailAriaLabel}
    >
      aleksi.nokelainen@gmail.com
    </a>
    <div
      class="flex items-center justify-center transition-colors duration-300"
      class:text-muted={$isDarkMode}
      class:text-white-60={!$isDarkMode}
      class:hover:text-foreground={$isDarkMode}
      class:hover:text-white-90={!$isDarkMode}
    >
      <span class="px-2 text-sm">{translations[$language].madeWith}</span>
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
      <span class="px-2 text-sm font-medium">Svelte</span>
    </div>
    <div
      class="text-center text-sm transition-colors duration-300"
      class:text-muted={$isDarkMode}
      class:text-white-60={!$isDarkMode}
      class:hover:text-foreground={$isDarkMode}
      class:hover:text-white-90={!$isDarkMode}
    >
      {translations[$language].builtOn}
      {#if formattedDate && !hasError}
        {formattedDate}
      {:else}
        <span class="text-red-400" role="alert">
          {translations[$language].buildDateError}
        </span>
      {/if}
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
