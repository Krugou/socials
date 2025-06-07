<script lang="ts">
  import {onMount, onDestroy} from 'svelte';
  import ParticleSystem from './hero/ParticleSystem.svelte';
  import ProfileImage from './hero/ProfileImage.svelte';
  import HeroContent from './hero/HeroContent.svelte';
  import { isDarkMode } from '../stores/theme.js';

  let visible = false;
  let container: HTMLElement;
  let scrollY: number;
  let cleanup: () => void;

  onMount(() => {
    visible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      {threshold: 0.1}
    );

    observer.observe(container);
    cleanup = () => observer.disconnect();
  });

  onDestroy(() => cleanup?.());
</script>

<svelte:window bind:scrollY />

<div bind:this={container} class="perspective relative m-8 text-center"
  class:bg-background/80={$isDarkMode}
  class:bg-white/10={!$isDarkMode}
  class:rounded-2xl={true}
  class:shadow-xl={true}
  role="region">
  <ParticleSystem />
  <ProfileImage {visible} />
  <HeroContent {visible} {scrollY} />
</div>

<style lang="postcss">
  .perspective {
    perspective: 1000px;
    transform-style: preserve-3d;
  }
</style>
