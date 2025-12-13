<script lang="ts">
  import {base} from '$app/paths';
  import {language} from '../lib/stores.js';
  import {NAV_LINKS, DEFAULT_LANGUAGE} from '../lib/constants.js';
  import type {Language, NavLink} from '../lib/types.js';
  import { logNavigationEvent } from '../lib/visitorTracking.js';
  import { get } from 'svelte/store';
  import { fetchNorwayWeather, WeatherError, type WeatherData } from '../lib/weather.js';
  import { onMount } from 'svelte';
  import { db } from '../lib/firebase.js';
  import { collection, addDoc } from 'firebase/firestore';

  /**
   * Safely gets translation for the current language with fallback
   * @param link - Navigation link object
   * @param currentLang - Current language code
   * @returns Translated text and aria label
   */
  function getTranslation(link: NavLink, currentLang: Language) {
    return link.translations[currentLang] || link.translations[DEFAULT_LANGUAGE];
  }

  /**
   * Constructs URL with base path for internal links
   * @throws {Error} If href is empty
   */
  function getUrl(href: string, external?: boolean): string {
    if (!href?.trim()) {
      throw new Error('URL href cannot be empty');
    }
    return external ? href : `${base}${href}`;
  }

  /**
   * Toggles between available languages
   */
  function toggleLanguage(): void {
    language.update((l: Language) => (l === 'en' ? 'fi' : 'en'));
  }

  /**
   * Handles navigation link click and logs event to Firestore
   */
  const handleNavClick = async (link: NavLink) => {
    try {
      await logNavigationEvent({
        navHref: link.href,
        navText: getTranslation(link, get(language)).text,
        language: get(language),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        platform: navigator.platform
      });
    } catch (error) {
      // Defensive: log error but do not block navigation
      console.error('Navigation event logging failed:', error);
    }
  };

  // Weather state
  let weather: WeatherData | null = null;
  let weatherError: string | null = null;
  let weatherLoading = true;

  /**
   * Gets user's current position with error handling
   * @returns Promise<{lat: number, lon: number}>
   */
  const getCurrentPosition = async (): Promise<{ lat: number; lon: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new WeatherError('Geolocation is not supported by this browser.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        (err) => {
          reject(new WeatherError('Failed to get location: ' + err.message));
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
      );
    });
  };

  /**
   * Save accepted GPS location to Firestore
   * @param lat Latitude
   * @param lon Longitude
   * @param navData Navigation event data
   */
  const saveGpsLocation = async (
    lat: number,
    lon: number,
    navData: Record<string, any>
  ): Promise<void> => {
    try {
      // Defensive: Validate input
      if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
        throw new Error('Invalid coordinates for GPS save');
      }
      await addDoc(collection(db, 'savedgps'), {
        lat,
        lon,
        ...navData,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        platform: navigator.platform
      });
    } catch (error) {
      console.error('Failed to save GPS location:', error);
    }
  };

  onMount(async () => {
    try {
      const { lat, lon } = await getCurrentPosition();
      weather = await fetchNorwayWeather(lat, lon);
      // Save GPS location to Firestore with nav data if permission granted
      await saveGpsLocation(lat, lon, {
        navPage: 'weather',
        language: get(language),
        event: 'accepted_gps',
      });
    } catch (error) {
      weatherError = error instanceof WeatherError ? error.message : 'Weather unavailable';
    } finally {
      weatherLoading = false;
    }
  });
</script>

<nav
  class="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-br from-purple-500/90 to-blue-900/90 p-6 text-white shadow-xl backdrop-blur-md"
  role="navigation"
  aria-label="Main navigation"
>
  <div class="container mx-auto max-w-7xl">
    <ul class="flex items-center justify-between">
      <div class="flex items-center space-x-8">
        {#each NAV_LINKS as link (link.href)}
          <li>
            <a
              href={getUrl(link.href, link.external)}
              class="group text-base font-bold tracking-wide md:text-xl"
              aria-label={getTranslation(link, $language).ariaLabel}
              title={getTranslation(link, $language).ariaLabel}
              on:click={() => handleNavClick(link)}
              {...link.external
                ? {
                    target: '_blank',
                    rel: 'noopener noreferrer'
                  }
                : {}}
            >
              <span
                class="break-all bg-gradient-to-r from-white to-yellow-300 bg-clip-text text-[0.6rem] text-transparent transition-all duration-300 ease-in-out hover:from-yellow-300 hover:to-white md:text-base"
              >
                {getTranslation(link, $language).text}
              </span>
              <span
                class="block h-0.5 max-w-0 bg-yellow-300 transition-all duration-300 group-hover:max-w-full"
                aria-hidden="true"
              />
            </a>
          </li>
        {/each}
      </div>
      <div class="flex items-center justify-center space-x-2">
        <li>
          <a
            href="https://github.com/krugou"
            target="_blank"
            rel="noopener noreferrer"
            class="flex h-10 w-full items-center justify-center rounded-full bg-white/10 p-1 transition-all duration-300 hover:scale-110 hover:bg-white/20 md:h-16 md:p-3"
            aria-label={$language === 'en' ? 'Visit GitHub Profile' : 'Siirry GitHub profiiliin'}
            title={$language === 'en' ? 'Visit GitHub Profile' : 'Siirry GitHub profiiliin'}
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
            on:click={toggleLanguage}
            class="rounded-lg bg-white/10 p-1 font-bold transition-all hover:bg-white/20 md:px-4 md:py-2"
            aria-label={$language === 'en' ? 'Switch to Finnish' : 'Vaihda Englantiin'}
            title={$language === 'en' ? 'Switch to Finnish' : 'Vaihda Englantiin'}
          >
            {$language === 'en' ? 'FI' : 'EN'}
          </button>
        </li>
        <li>
          {#if weatherLoading}
            <span class="ml-2 text-xs animate-pulse">Loading weather...</span>
          {:else if weatherError}
            <span class="ml-2 text-xs text-red-300" title={weatherError}>🌧️</span>
          {:else if weather}
            <span class="ml-2 flex items-center text-xs" title={weather.description}>
             
              <span class="mx-1">|</span>
              <span>{weather.temperature.toFixed(1)}°C</span>
              <span class="mx-1">|</span>
              <span class="capitalize">{weather.description}</span>
            </span>
          {/if}
        </li>
      </div>
    </ul>
  </div>
</nav>
