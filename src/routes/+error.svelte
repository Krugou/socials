<script lang="ts">
  import {base} from '$app/paths';
  import {page} from '$app/state';
  import {t} from '../lib/i18n.js';
  import {isDarkMode} from '../stores/theme.js';
</script>

<svelte:head>
  <title>{page.status} | Aleksi Nokelainen</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
  <div
    class="animate-float rounded-2xl border p-8 shadow-2xl backdrop-blur-lg"
    class:border-border={$isDarkMode}
    class:border-white-10={!$isDarkMode}
    class:bg-white-10={!$isDarkMode}
  >
    <h1
      class="mb-4 text-6xl font-bold"
      class:text-foreground={$isDarkMode}
      class:text-white={!$isDarkMode}
    >
      {page.status}
    </h1>
    <p class="mb-8 text-xl" class:text-muted={$isDarkMode} class:text-white={!$isDarkMode}>
      {page.status === 404 ? $t.error.notFound : page.error?.message || $t.error.notFound}
    </p>
    <a
      href="{base}/"
      class="inline-block rounded-lg px-6 py-3 text-lg font-semibold transition-all duration-300 motion-safe:hover:scale-105"
      class:bg-primary={$isDarkMode}
      class:bg-yellow-300={!$isDarkMode}
      class:text-background={$isDarkMode}
      class:text-purple-900={!$isDarkMode}
      class:hover:bg-primary-dark={$isDarkMode}
      class:hover:bg-yellow-400={!$isDarkMode}
    >
      {$t.error.goHome}
    </a>
  </div>
</div>

<style>
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
</style>
