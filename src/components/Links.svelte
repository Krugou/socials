<script lang="ts">
  import {fly} from 'svelte/transition';
  import {onMount} from 'svelte';
  import ParticleOverlay from './ParticleOverlay.svelte';
  import type {SocialLink} from '../lib/types.js';
  import {isDarkMode} from '../stores/theme.js';

  /** Social media links configuration */
  const links: SocialLink[] = [
    {
      title: 'GitHub',
      url: 'https://github.com/krugou',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/github.svg',
    },
    {
      title: 'Instagram',
      url: 'https://www.instagram.com/krugou/',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/instagram.svg',
    },
    {
      title: 'AuroraWatcher',
      url: 'https://krugou.github.io/aurorawatcher/',
      icon: 'https://krugou.github.io/aurorawatcher/pwa-192x192.png',
    },
    {
      title: 'LinkedIn',
      url: 'https://www.linkedin.com/in/aleksi-nokelainen-3706b7259/',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/linkedin.svg',
    },
    {
      title: 'Threads',
      url: 'https://threads.net/krugou',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/threads.svg',
    },
    {
      title: 'Twitter',
      url: 'https://x.com/krugou',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/twitter.svg',
    },
    {
      title: 'Bluesky',
      url: 'https://bsky.app/profile/krugou.bsky.social',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/bluesky.svg',
    },
    {
      title: 'YouTube',
      url: 'https://www.youtube.com/@Krugou',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/youtube.svg',
    },
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
  class="perspective relative space-y-4 rounded-2xl p-4 shadow-xl"
  class:bg-background-80={$isDarkMode}
  class:bg-white-10={!$isDarkMode}
  role="region"
  style="transform: translateY({scrollY * 0.1}px)"
>
  {#if visible}
    <ParticleOverlay {container} />
    {#each links as link (link.title)}
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        in:fly={{y: 20, duration: 1000, delay: links.indexOf(link) * 100}}
        class="group relative block overflow-hidden rounded-lg border p-2 text-center backdrop-blur-sm transition-all duration-300 md:p-4"
        class:bg-card-80={$isDarkMode}
        class:bg-white-10={!$isDarkMode}
        class:text-foreground={$isDarkMode}
        class:text-white={!$isDarkMode}
        class:border-border={$isDarkMode}
        class:border-white-10={!$isDarkMode}
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
          class="absolute inset-0 -z-10 transition-opacity duration-300 group-hover:opacity-100"
          class:bg-gradient-to-r={$isDarkMode}
          class:from-primary-10={$isDarkMode}
          class:to-secondary-10={$isDarkMode}
          class:bg-gradient-to-r-alt={!$isDarkMode}
          class:from-purple-500-10={!$isDarkMode}
          class:to-blue-500-10={!$isDarkMode}
          class:opacity-0={true}
        ></div>
      </a>
    {/each}
  {:else}
    <div
      class="h-[68px] animate-pulse rounded-lg"
      class:bg-card-40={$isDarkMode}
      class:bg-white-5={!$isDarkMode}
    ></div>
    <div
      class="h-[68px] animate-pulse rounded-lg"
      class:bg-card-40={$isDarkMode}
      class:bg-white-5={!$isDarkMode}
    ></div>
  {/if}
</div>

<style lang="postcss">
  .perspective {
    perspective: 1000px;
    transform-style: preserve-3d;
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
