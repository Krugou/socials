<script lang="ts">
  import {fade, fly} from 'svelte/transition';
  import {onMount} from 'svelte';
  import ParticleOverlay from './ParticleOverlay.svelte';
  import type {SocialLink} from '../lib/types.js';

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
  let scrollY = 0;

  onMount(() => {
    visible = true;
  });
</script>

<div
  bind:this={container}
  class="perspective relative space-y-4 p-4 bg-background/80 rounded-2xl shadow-xl"
  role="region"
  style="transform: translateY({scrollY * 0.1}px)"
>
  {#if visible}
    <ParticleOverlay {container} />
    {#each links as link, i}
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        in:fly={{y: 20, duration: 1000, delay: i * 100}}
        class="group relative block overflow-hidden rounded-lg bg-card/80 p-2 text-center text-foreground backdrop-blur-sm transition-all duration-300 md:p-4 border border-border"
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
          class="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        ></div>
      </a>
    {/each}
  {:else}
    <div class="h-[68px] animate-pulse rounded-lg bg-card/40"></div>
    <div class="h-[68px] animate-pulse rounded-lg bg-card/40"></div>
  {/if}
</div>

<style lang="postcss">
  .perspective {
    perspective: 1000px;
    transform-style: preserve-3d;
  }

  .particle {
    will-change: transform;
    transition: transform 0.008s linear;
  }

  /* Apply hover effect on devices that support hover */
  @media (hover: hover) {
    a {
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    a:hover {
      transform: translateY(-2px);
    }
  }
</style>
