<script lang="ts">
  import {resolve} from '$app/paths';
  import {language} from '../lib/stores.js';
  import {t} from '../lib/i18n.js';
  import {NAV_LINKS} from '../lib/constants.js';
  import type {Language, NavLink} from '../lib/types.js';
  import {logNavigationEvent} from '../lib/visitorTracking.js';
  import {get} from 'svelte/store';
  import {fetchNorwayWeather, WeatherError, type WeatherData} from '../lib/weather.js';
  import {onMount} from 'svelte';

  /**
   * Constructs URL with base path for internal links
   * @throws {Error} If href is empty
   */
  function getUrl(href: string, external?: boolean): string {
    if (!href?.trim()) {
      throw new Error('URL href cannot be empty');
    }
    if (external) {
      return href;
    }

    if (href === '/' || href === '/repositories') {
      return resolve(href);
    }

    throw new Error(`Unsupported internal navigation path: ${href}`);
  }

  /**
   * Toggles between available languages
   */
  function toggleLanguage(): void {
    language.update((l: Language) => (l === 'en' ? 'fi' : 'en'));
  }

  /**
   * Handles navigation link click and logs an anonymous event to Firestore
   */
  const handleNavClick = async (link: NavLink) => {
    try {
      const lang = get(language);
      await logNavigationEvent({
        navHref: link.href,
        navText: $t.nav.links[link.id].text,
        language: lang,
      });
    } catch (error) {
      // Defensive: log error but do not block navigation
      console.error('Navigation event logging failed:', error);
    }
  };

  // Fixed location, so no geolocation permission is requested from visitors
  const ESPOO = {lat: 60.21, lon: 24.66, name: 'Espoo'};

  // Weather state
  let weather = $state<WeatherData | null>(null);
  let weatherError = $state<string | null>(null);
  let weatherLoading = $state(true);

  onMount(async () => {
    try {
      weather = await fetchNorwayWeather(ESPOO.lat, ESPOO.lon, ESPOO.name);
    } catch (error) {
      weatherError = error instanceof WeatherError ? error.message : 'Weather unavailable';
    } finally {
      weatherLoading = false;
    }
  });
</script>

<nav
  class="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-br from-purple-500/90 to-blue-900/90 p-6 text-white shadow-xl backdrop-blur-md"
  aria-label="Main navigation"
>
  <div class="container mx-auto flex max-w-7xl items-center justify-between">
    <ul class="flex items-center space-x-8">
      {#each NAV_LINKS as link (link.href)}
        <li>
          <a
            href={getUrl(link.href, link.external)}
            class="group text-base font-bold tracking-wide md:text-xl"
            aria-label={$t.nav.links[link.id].ariaLabel}
            title={$t.nav.links[link.id].ariaLabel}
            onclick={() => handleNavClick(link)}
            {...link.external && !link.href.startsWith('mailto:')
              ? {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                }
              : {}}
          >
            <span
              class="bg-gradient-to-r from-white to-yellow-300 bg-clip-text text-[0.6rem] break-all text-transparent transition-all duration-300 ease-in-out hover:from-yellow-300 hover:to-white md:text-base"
            >
              {$t.nav.links[link.id].text}
            </span>
            <span
              class="block h-0.5 max-w-0 bg-yellow-300 transition-all duration-300 group-hover:max-w-full"
              aria-hidden="true"
            ></span>
          </a>
        </li>
      {/each}
    </ul>
    <ul class="flex items-center justify-center space-x-2">
      <li>
        <a
          href="https://github.com/krugou"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-10 w-full items-center justify-center rounded-full bg-white/10 p-1 transition-all duration-300 hover:bg-white/20 motion-safe:hover:scale-110 md:h-16 md:p-3"
          aria-label={$t.nav.github}
          title={$t.nav.github}
        >
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
        </a>
      </li>
      <li>
        <button
          type="button"
          onclick={toggleLanguage}
          class="rounded-lg bg-white/10 p-1 font-bold transition-all hover:bg-white/20 md:px-4 md:py-2"
          title={$t.nav.switchLanguage}
        >
          {$t.nav.languageButton}<span class="sr-only"> – {$t.nav.switchLanguage}</span>
        </button>
      </li>
      <li>
        {#if weatherLoading}
          <span class="ml-2 animate-pulse text-xs">{$t.nav.weatherLoading}</span>
        {:else if weatherError}
          <span class="ml-2 text-xs text-red-300" title={$t.nav.weatherUnavailable}>🌧️</span>
        {:else if weather}
          <span
            class="ml-2 flex items-center text-xs"
            title="{weather.location}: {weather.description}"
          >
            <span class="mx-1">|</span>
            <span>{weather.temperature.toFixed(1)}°C</span>
            <span class="mx-1">|</span>
            <span class="capitalize">{weather.description}</span>
          </span>
        {/if}
      </li>
    </ul>
  </div>
</nav>
