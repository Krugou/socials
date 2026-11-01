<script lang="ts">
  import {t} from '../../lib/i18n.js';

  let {visible = false, scrollY = 0}: {visible?: boolean; scrollY?: number} = $props();
</script>

<div class="relative z-10 mt-20" style="transform: translateY({scrollY * 0.1}px)">
  {#if visible}
    <h1
      class="from-primary-80 to-secondary-80 bg-gradient-to-r from-purple-200 to-blue-400 bg-clip-text text-4xl font-bold text-transparent"
    >
      {$t.hero.title}
    </h1>
    <p
      class="from-primary-60 to-secondary-60 hover:from-secondary-80 hover:to-primary-80 mx-auto max-w-2xl bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text px-4 py-4 text-sm leading-relaxed font-bold text-transparent transition-all duration-1000 ease-in-out hover:from-blue-200 hover:to-purple-200 md:text-lg"
    >
      {$t.hero.description}
    </p>
  {:else}
    <div class="bg-white-10 mx-auto mb-4 h-8 w-64 animate-pulse rounded"></div>
    <div class="bg-white-10 mx-auto h-20 w-96 animate-pulse rounded"></div>
  {/if}
</div>
