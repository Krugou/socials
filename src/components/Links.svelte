<script lang="ts">
  import {fade, fly} from 'svelte/transition';
  import {spring} from 'svelte/motion';
  import {onMount, onDestroy} from 'svelte';
  import type {SocialLink, Particle} from '../lib/types.js';

  /** Social media links configuration */
  const links: SocialLink[] = [
    {
      title: 'GitHub',
      url: 'https://github.com/krugou',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/github.svg'
    },
    {
      title: 'Instagram',
      url: 'https://www.instagram.com/krugou/',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/instagram.svg'
    },
    {
      title: 'Threads',
      url: 'https://threads.net/krugou',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/threads.svg'
    },
    {
      title: 'Twitter',
      url: 'https://twitter.com/krugou',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/twitter.svg'
    },
    {
      title: 'Bluesky',
      url: 'https://bsky.app/profile/krugou.bsky.social',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/bluesky.svg'
    },
    {
      title: 'YouTube',
      url: 'https://www.youtube.com/@Krugou',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/youtube.svg'
    },
    {
      title: 'LinkedIn',
      url: 'https://www.linkedin.com/in/aleksi-nokelainen-3706b7259/',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/linkedin.svg'
    },
    {
      title: 'Facebook',
      url: 'https://www.facebook.com/aleksi.nokelainen.7',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/facebook.svg'
    }
  ];

  let container: HTMLElement;
  let visible = false;
  let rafId: number;
  let scrollY = 0;

  /** Particle configuration */
  const particles: Particle[] = [
    {x: 50, y: 50, dx: 2, dy: 2, color: 'rgba(139, 92, 246, 1)'},
    {x: 150, y: 150, dx: -2, dy: -2, color: 'rgba(59, 130, 246, 0.5)'}
  ];

  /**
   * Updates particle positions with bounds checking
   */
  const updateParticles = () => {
    if (!container) return;

    const bounds = container.getBoundingClientRect();

    particles.forEach((p) => {
      // Increased speed multiplier from 2 to 4
      p.x += p.dx * 4;
      p.y += p.dy * 4;

      // Bounce off edges
      if (p.x <= 0 || p.x >= bounds.width - 100) p.dx *= -1;
      if (p.y <= 0 || p.y >= bounds.height - 100) p.dy *= -1;
    });

    rafId = requestAnimationFrame(updateParticles);
  };

  onMount(() => {
    visible = true;
    rafId = requestAnimationFrame(updateParticles);
  });

  onDestroy(() => {
    if (rafId) cancelAnimationFrame(rafId);
  });
</script>

<div
  bind:this={container}
  class="perspective relative space-y-4 p-4"
  role="region"
  style="transform: translateY({scrollY * 0.1}px)"
>
  <!-- Floating particles -->

  <!-- Links with hover effects -->
  {#if visible}
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      {#each particles as particle}
        <div
          class="particle absolute h-24 w-24"
          style="
          left: {particle.x}px;
          top: {particle.y}px;
          background: radial-gradient(circle at center, {particle.color}, transparent 70%);
          filter: blur(20px);
          will-change: transform;
        "
        ></div>
      {/each}
    </div>
    {#each links as link, i}
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        in:fly={{y: 20, duration: 1000, delay: i * 100}}
        class="group relative block overflow-hidden rounded-lg bg-white/10 p-2 text-center text-white backdrop-blur-sm transition-all duration-300 md:p-4"
      >
        <div
          class="relative z-10 flex items-center justify-center space-x-2 transition-transform duration-300 group-hover:scale-105"
        >
          <img
            src={link.icon}
            alt={link.title}
            class="h-6 w-6 invert transition-transform duration-300 group-hover:rotate-12"
            loading="lazy"
          />
          <span class="text-sm md:text-base">{link.title}</span>
        </div>
        <div
          class="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        ></div>
      </a>
    {/each}
  {:else}
    <div class="h-[68px] animate-pulse rounded-lg bg-white/5"></div>
    <div class="h-[68px] animate-pulse rounded-lg bg-white/5"></div>
  {/if}
</div>

<style lang="postcss">
  .perspective {
    perspective: 1000px;
    transform-style: preserve-3d;
  }

  .particle {
    will-change: transform;
    transition: transform 0.008s linear; /* Reduced from 0.016s for smoother animation */
  }

  /* Apply hover effect on devices that support hover */
  @media (hover: hover) {
    a {
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    a:hover {
      transform: translateY(-2px);
    }
  }
</style>
