<script lang="ts">
  import {onMount} from 'svelte';
  import {particleStore} from '../lib/stores/particleStore.js';

  let {container}: {container: HTMLElement} = $props();

  onMount(() => {
    particleStore.initializeParticles(container);
    particleStore.startAnimation(container);

    // Do not animate while the tab is in the background
    const onVisibilityChange = () => {
      if (document.hidden) {
        particleStore.stopAnimation();
      } else {
        particleStore.startAnimation(container);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      particleStore.stopAnimation();
    };
  });
</script>

<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
  {#each $particleStore as particle (particle.id)}
    <div
      class="particle absolute h-24 w-24"
      style="
        transform: translate({particle.x}px, {particle.y}px);
        background: radial-gradient(circle at center, {particle.color}, transparent 70%);
        filter: blur(20px);
        will-change: transform;
      "
    ></div>
  {/each}
</div>

<style>
  .particle {
    will-change: transform;
    transition: transform 0.008s linear;
  }
</style>
