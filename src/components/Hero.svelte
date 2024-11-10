<script lang="ts">
  import {fly, fade} from 'svelte/transition';
  import {spring} from 'svelte/motion';
  import {onMount, onDestroy} from 'svelte';

  let visible = false;
  let container: HTMLElement;
  let mousePos = spring(
    {x: 0, y: 0},
    {
      stiffness: 0.1,
      damping: 0.4
    }
  );

  function handleMouseMove(event: MouseEvent) {
    const rect = container?.getBoundingClientRect();
    if (rect) {
      mousePos.set({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    }
  }

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

<div
  bind:this={container}
  on:mousemove={handleMouseMove}
  class="perspective relative mb-8 text-center" role="region"
>
  <div
    class="pointer-events-none absolute inset-0 opacity-50"
    style="background: radial-gradient(circle at {$mousePos.x}px {$mousePos.y}px, rgba(139, 92, 246, 0.15), transparent 25%)"
  />

  <!-- Particle background -->
  <div class="absolute inset-0 overflow-hidden">
    {#each Array(20) as _, i}
      <div class="particle absolute h-1 w-1 rounded-full bg-purple-500/30" style="--index: {i}"></div>
    {/each}
  </div>

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

    <div class="relative" style="transform: translateY({scrollY * 0.1}px)">
      <h1
        in:fly={{y: 20, duration: 1000, delay: 300}}
        class="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-4xl font-bold text-transparent"
      >
        Aleksi Nokelainen
      </h1>

      <p
        in:fade={{duration: 1000, delay: 600}}
        class="mx-auto max-w-2xl px-4 py-4 text-lg leading-relaxed text-white/90"
      >
        Full Stack Developer passionate about creating intuitive software solutions. Proficient in
        JavaScript, TypeScript, React, Node.js, Svelte, and Python.
      </p>
    </div>
  {:else}
    <div class="animate-pulse">
      <div class="mx-auto mb-6 h-32 w-32 rounded-full bg-white/10"></div>
      <div class="mx-auto mb-4 h-8 w-64 rounded bg-white/10"></div>
      <div class="mx-auto h-20 w-96 rounded bg-white/10"></div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .perspective {
    perspective: 1000px;
    transform-style: preserve-3d;
  }

  .particle {
    animation: float 20s infinite;
    animation-delay: calc(var(--index) * -1s);
  }

  @keyframes float {
    0%,
    100% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(100px, 100px);
    }
    50% {
      transform: translate(200px, 0);
    }
    75% {
      transform: translate(100px, -100px);
    }
  }

  .in-view {
    animation: appear 1s forwards;
  }

  @keyframes appear {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
