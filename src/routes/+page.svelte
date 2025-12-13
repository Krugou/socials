<script lang="ts">
  import {spring} from 'svelte/motion';
  import {onMount, onDestroy} from 'svelte';
  import {throttle} from 'lodash-es';
  import Links from '../components/Links.svelte';
  import Footer from '../components/Footer.svelte';
  import Hero from '../components/Hero.svelte';
  import type {MousePosition, SpringOptions} from '../lib/types.js';
  import {VisitorTracker} from '../lib/visitorTracking.js';
  import {browser} from '$app/environment';

  let container: HTMLElement;
  let visible = false;
  let scrollY: number;
  let hasPointerEvents = true;
  let visitorTracker: VisitorTracker | null = null;

  // Spring configuration for smooth mouse movement
  const springConfig: SpringOptions = {
    stiffness: 0.1,
    damping: 0.4
  };

  const mousePos = spring<MousePosition>({x: 0, y: 0}, springConfig);

  /**
   * Handles mouse movement with throttling for performance
   * @param event Mouse event from DOM
   */
  const handleMouseMove = throttle((event: MouseEvent): void => {
    try {
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));

      mousePos.set({x, y});
    } catch (error) {
      console.error('Error tracking mouse position:', error);
      hasPointerEvents = false;
    }
  }, 16); // ~60fps

  onMount(async () => {
    visible = true;
    // Check if device supports pointer events
    hasPointerEvents = window.matchMedia('(pointer: fine)').matches;

    // Log visitor in production
    if (browser) {
      visitorTracker = new VisitorTracker();
      await visitorTracker.logVisit();
    }
  });

  onDestroy(() => {
    handleMouseMove.cancel();
    visitorTracker = null;
  });
</script>

<div class="flex min-h-full flex-col">
  <div class="flex-1 px-4 py-16">
    <div
      class="relative mx-auto max-w-xl overflow-hidden rounded-2xl border border-border bg-card/80 p-8 shadow-2xl backdrop-blur-lg"
      role="presentation"
      bind:this={container}
      on:mousemove|passive={handleMouseMove}
    >
      {#if hasPointerEvents}
        <div
          class="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-300"
          style="transform: translate3d(0,0,0); background: radial-gradient(circle at {$mousePos.x}px {$mousePos.y}px, rgba(139, 92, 246, 0.10), transparent 25%)"
        ></div>
      {/if}

      <Hero />
      <Links />
    </div>
  </div>
  <Footer />
</div>

<style>
  /* Add will-change to optimize performance */
  .pointer-events-none {
    will-change: transform;
    backface-visibility: hidden;
  }
</style>
