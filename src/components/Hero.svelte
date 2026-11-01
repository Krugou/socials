<script lang="ts">
  import {onMount} from 'svelte';
  import type {Component} from 'svelte';
  import ProfileImage from './hero/ProfileImage.svelte';
  import HeroContent from './hero/HeroContent.svelte';
  import {getParticleBudget, prefersReducedMotion, whenIdle} from '../lib/device.js';
  import {isDarkMode} from '../stores/theme.js';

  let visible = $state(false);
  let scrollY = $state(0);
  let ParticleSystem = $state<Component | null>(null);

  // Parallax is skipped when the visitor prefers reduced motion
  const parallaxY = $derived(prefersReducedMotion() ? 0 : scrollY);

  onMount(() => {
    visible = true;
    // The orbiting particles are decorative: load them after first paint and only when affordable
    if (getParticleBudget(1) > 0) {
      whenIdle(() => {
        import('./hero/ParticleSystem.svelte').then((module) => {
          ParticleSystem = module.default;
        });
      });
    }
  });
</script>

<svelte:window bind:scrollY />

<div
  class="perspective relative m-8 rounded-2xl text-center shadow-xl"
  class:bg-white-10={!$isDarkMode}
  role="region"
  aria-label="Introduction"
>
  {#if ParticleSystem}
    <ParticleSystem />
  {/if}
  <ProfileImage {visible} />
  <HeroContent {visible} scrollY={parallaxY} />
</div>

<style lang="postcss">
  .perspective {
    perspective: 1000px;
    transform-style: preserve-3d;
  }
</style>
