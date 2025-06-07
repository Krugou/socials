<script lang="ts">
  import {fly} from 'svelte/transition';
  export let visible = false;
</script>

{#if visible}
  <div
    in:fly={{y: 50, duration: 1000}}
    class="relative mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full ring-4 transition-transform hover:scale-105"
    class:ring-purple-500-50={$isDarkMode}
    class:ring-purple-500-30={!$isDarkMode}
    class:bg-background-80={$isDarkMode}
    class:bg-white-10={!$isDarkMode}
  >
    <img
      src="https://avatars.githubusercontent.com/u/59641229?v=4"
      alt="Profile"
      class="h-full w-full object-cover"
    />
  </div>
{:else}
  <div class="mx-auto mb-6 h-32 w-32 rounded-full animate-pulse"
    class:bg-white-10={!$isDarkMode}
    class:bg-card-40={$isDarkMode}
  ></div>
{/if}