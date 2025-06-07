<script lang="ts">
  import {fly, fade} from 'svelte/transition';
  import {language} from '../../lib/stores.js';
  import type {Translations} from '../../lib/types.js';
  import { isDarkMode } from '../../stores/theme.js';

  export let visible = false;
  export let scrollY = 0;

  const translations: Translations = {
    en: {
      title: 'Aleksi Nokelainen',
      description:
        'Full Stack Developer passionate about creating intuitive software solutions. Proficient in JavaScript, TypeScript, React, Node.js, Svelte, and Python.',
      buildDateError: 'Error calculating build date'
    },
    fi: {
      title: 'Aleksi Nokelainen',
      description:
        'Full Stack -kehittäjä, joka on intohimoinen luomaan intuitiivisia ohjelmistoratkaisuja. Vahva osaaminen JavaScript, TypeScript, React, Node.js, Svelte ja Python -teknologioissa.',
      buildDateError: 'Virhe rakennuspäivämäärän laskemisessa'
    }
  };

  function getTranslation(lang: string): (typeof translations)['en'] {
    return translations[lang as keyof typeof translations] ?? translations.en;
  }
</script>

<div class="relative z-10 mt-20" style="transform: translateY({scrollY * 0.1}px)">
  {#if visible}
    <h1
      class="bg-gradient-to-r text-4xl font-bold text-transparent"
      class:from-purple-200={!$isDarkMode}
      class:to-blue-400={!$isDarkMode}
      class:from-primary/80={$isDarkMode}
      class:to-secondary/80={$isDarkMode}
      bg-clip-text
    >
      {getTranslation($language).title}
    </h1>
    <p
      class="mx-auto max-w-2xl bg-gradient-to-r bg-clip-text px-4 py-4 text-sm font-bold leading-relaxed text-transparent transition-all duration-1000 ease-in-out md:text-lg"
      class:from-purple-400={!$isDarkMode}
      class:to-blue-500={!$isDarkMode}
      class:from-primary/60={$isDarkMode}
      class:to-secondary/60={$isDarkMode}
      class:hover:from-blue-200={!$isDarkMode}
      class:hover:to-purple-200={!$isDarkMode}
      class:hover:from-secondary/80={$isDarkMode}
      class:hover:to-primary/80={$isDarkMode}
    >
      {getTranslation($language).description}
    </p>
  {:else}
    <div class="mx-auto mb-4 h-8 w-64 animate-pulse rounded" class:bg-white/10={!$isDarkMode} class:bg-card/40={$isDarkMode}></div>
    <div class="mx-auto h-20 w-96 animate-pulse rounded" class:bg-white/10={!$isDarkMode} class:bg-card/40={$isDarkMode}></div>
  {/if}
</div>
