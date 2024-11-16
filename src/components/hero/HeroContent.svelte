<script lang="ts">
  import {fly, fade} from 'svelte/transition';
  import {language} from '../../lib/stores.js';
  import type {Translations} from '../../lib/types.js';

  export let visible = false;
  export let scrollY = 0;

  const translations: Translations = {
    en: {
      title: 'Aleksi Nokelainen',
      description:
        'Full Stack Developer passionate about creating intuitive software solutions. Proficient in JavaScript, TypeScript, React, Node.js, Svelte, and Python.'
    },
    fi: {
      title: 'Aleksi Nokelainen',
      description:
        'Full Stack -kehittäjä, joka on intohimoinen luomaan intuitiivisia ohjelmistoratkaisuja. Vahva osaaminen JavaScript, TypeScript, React, Node.js, Svelte ja Python -teknologioissa.'
    }
  };

  function getTranslation(lang: string): (typeof translations)['en'] {
    return translations[lang as keyof typeof translations] ?? translations.en;
  }
</script>

<div class="relative z-10 mt-20" style="transform: translateY({scrollY * 0.1}px)">
  {#if visible}
    <h1
      in:fly={{y: 20, duration: 1000, delay: 300}}
      class="bg-gradient-to-r from-purple-200 to-blue-400 bg-clip-text text-4xl font-bold text-transparent"
    >
      {getTranslation($language).title}
    </h1>

    <p
      in:fade={{duration: 1000, delay: 600}}
      class="mx-auto max-w-2xl bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text px-4 py-4 text-sm font-bold leading-relaxed text-transparent transition-all duration-1000 ease-in-out hover:from-blue-200 hover:to-purple-200 md:text-lg"
    >
      {getTranslation($language).description}
    </p>
  {:else}
    <div class="mx-auto mb-4 h-8 w-64 animate-pulse rounded bg-white/10"></div>
    <div class="mx-auto h-20 w-96 animate-pulse rounded bg-white/10"></div>
  {/if}
</div>
