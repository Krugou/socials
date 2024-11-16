
<script lang="ts">
  import {fly} from 'svelte/transition';
  export let visible = false;
</script>

{#if visible}
  <div
    in:fly={{y: 50, duration: 1000}}
    class="relative mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full ring-4 ring-purple-500/50 transition-transform hover:scale-105"
  >
    <img
      src="https://avatars.githubusercontent.com/u/59641229?v=4"
      alt="Profile"
      class="h-full w-full object-cover"
    />
  </div>
{:else}
  <div class="mx-auto mb-6 h-32 w-32 rounded-full bg-white/10 animate-pulse"></div>
{/if}