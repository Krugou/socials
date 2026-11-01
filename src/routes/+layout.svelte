<script lang="ts">
  import '../app.css';
  import type {Snippet} from 'svelte';
  import Nav from '../components/Nav.svelte';
  import {isDarkMode} from '../stores/theme.js';
  import {language} from '../lib/stores.js';
  import {t} from '../lib/i18n.js';

  let {children}: {children: Snippet} = $props();

  // Keep <html lang> in sync with the selected language for screen readers and translation tools
  $effect(() => {
    document.documentElement.lang = $language;
  });
</script>

<a
  href="#main"
  class="sr-only z-[100] rounded-lg bg-yellow-300 px-4 py-2 font-bold text-purple-900 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
>
  {$t.skipToContent}
</a>

<div
  class="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]"
  class:bg-background={$isDarkMode}
  class:bg-white={!$isDarkMode}
  class:from-background={$isDarkMode}
  class:from-purple-500-90={!$isDarkMode}
  class:via-background={$isDarkMode}
  class:via-blue-900-90={!$isDarkMode}
  class:to-black={$isDarkMode}
  class:to-blue-900-90={!$isDarkMode}
>
  <Nav />
  <main id="main" tabindex="-1" class="flex-1 focus:outline-none">
    {@render children()}
  </main>
</div>
