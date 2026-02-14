<script lang="ts">
  import {onMount, onDestroy} from 'svelte';
  import {particleStore} from '../lib/stores/particleStore.js';
  import type {Particle} from '../lib/types/particles.js';

  export let container: HTMLElement;
  let rafId: number;
  let particles: Particle[] = [];

  particleStore.subscribe((value) => {
    particles = value;
  });

  const animate = () => {
    particleStore.updateParticles(container);
    rafId = requestAnimationFrame(animate);
  };

  onMount(() => {
    particleStore.initializeParticles(container);
    rafId = requestAnimationFrame(animate);
  });

  onDestroy(() => {
    if (rafId) cancelAnimationFrame(rafId);
  });
</script>

<div class="pointer-events-none absolute inset-0 overflow-hidden">
  {#each particles as particle (particle.id)}
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
