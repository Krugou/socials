<script lang="ts">
  import {Spring} from 'svelte/motion';
  import {onMount} from 'svelte';
  import Links from '../components/Links.svelte';
  import Footer from '../components/Footer.svelte';
  import Hero from '../components/Hero.svelte';
  import {VisitorTracker} from '../lib/visitorTracking.js';
  import {prefersReducedMotion} from '../lib/device.js';
  import {t} from '../lib/i18n.js';

  let container = $state<HTMLElement | undefined>();
  let hasPointerEvents = $state(false);

  // Spring configuration for smooth mouse movement
  const mousePos = new Spring({x: 0, y: 0}, {stiffness: 0.1, damping: 0.4});

  let frame = 0;
  let pendingEvent: MouseEvent | null = null;

  /**
   * Updates the spotlight position at most once per animation frame
   */
  const updateMousePosition = (): void => {
    frame = 0;
    if (!container || !pendingEvent) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(pendingEvent.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(pendingEvent.clientY - rect.top, rect.height));
    mousePos.target = {x, y};
  };

  const handleMouseMove = (event: MouseEvent): void => {
    pendingEvent = event;
    if (!frame) frame = requestAnimationFrame(updateMousePosition);
  };

  onMount(() => {
    // The mouse-follow spotlight needs a fine pointer and is skipped with reduced motion
    hasPointerEvents = window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion();

    // Log an anonymous page view in production
    void new VisitorTracker().logVisit();

    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  });
</script>

<svelte:head>
  <title>{$t.home.pageTitle}</title>
</svelte:head>

<div class="flex min-h-full flex-col">
  <div class="flex-1 px-4 py-16">
    <div
      class="bg-card/80 border-border relative mx-auto max-w-xl overflow-hidden rounded-2xl border p-8 shadow-2xl backdrop-blur-lg"
      role="presentation"
      bind:this={container}
      onmousemove={handleMouseMove}
    >
      {#if hasPointerEvents}
        <div
          class="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-300"
          style="transform: translate3d(0,0,0); background: radial-gradient(circle at {mousePos
            .current.x}px {mousePos.current.y}px, rgba(139, 92, 246, 0.10), transparent 25%)"
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
