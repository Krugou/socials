<script lang="ts">
  import {fly, slide} from 'svelte/transition';
  import {onMount} from 'svelte';
  import ParticleOverlay from './ParticleOverlay.svelte';
  import type {SocialLink} from '../lib/types.js';
  import {isDarkMode} from '../stores/theme.js';

  /** Primary social links, shown before the projects */
  const primaryLinks: SocialLink[] = [
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
      title: 'LinkedIn',
      url: 'https://www.linkedin.com/in/aleksi-nokelainen-3706b7259/',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/linkedin.svg',
    },
  ];

  /** Project highlighted above the accordion */
  const featuredProject: SocialLink = {
    title: 'AuroraWatcher',
    url: 'https://krugou.github.io/aurorawatcher/',
    icon: 'https://krugou.github.io/aurorawatcher/pwa-192x192.png',
  };

  /** Personal project websites listed in the accordion */
  const projects: SocialLink[] = [
    {
      title: 'Swim',
      url: 'https://krugou.github.io/swim/fi/',
      icon: 'https://krugou.github.io/swim/icon-192x192.png',
    },
    {
      title: 'Bensa',
      url: 'https://krugou-bensa.web.app/fi',
      icon: 'https://krugou-bensa.web.app/pwa-192x192.png',
    },
    {
      title: 'Tuntipalkkalaskuri',
      url: 'https://krugou.github.io/tuntipalkkalaskuri/',
      icon: 'https://krugou.github.io/tuntipalkkalaskuri/apple-touch-icon-180x180.png',
    },
    {
      title: 'Aquatic Harvesting',
      url: 'https://krugou.github.io/aquaticharvesting/',
      icon: 'https://krugou.github.io/aquaticharvesting/icons/icon-192.png',
    },
    {
      title: 'Tieliikenne Video Wall',
      url: 'https://krugou.github.io/tieliikennevideowall/?cities=vantaa%2Cespoo%2Chelsinki',
      icon: 'https://krugou.github.io/tieliikennevideowall/pwa-192.svg',
    },
  ];

  /** Remaining social links, shown after the projects */
  const otherLinks: SocialLink[] = [
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

  let projectsOpen = false;

  let container: HTMLElement;
  let visible = false;
  let scrollY = 0;

  onMount(() => {
    visible = true;
  });
</script>

{#snippet linkRow(link: SocialLink, index: number, featured = false, colorIcon = false)}
  <a
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    in:fly={{y: 20, duration: 1000, delay: index * 100}}
    class="group relative block overflow-hidden rounded-lg border p-2 text-center backdrop-blur-sm transition-all duration-300 md:p-4"
    class:py-4={featured}
    class:md:py-6={featured}
    class:ring-2={featured}
    class:ring-purple-400={featured}
    class:shadow-lg={featured}
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
        class="transition-transform duration-300 group-hover:rotate-12 {featured
          ? 'h-10 w-10'
          : 'h-6 w-6'}"
        class:invert={!featured && !colorIcon}
        loading="lazy"
      />
      <span class={featured ? 'text-base font-semibold md:text-lg' : 'text-sm md:text-base'}>
        {link.title}
      </span>
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
{/snippet}

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
    {#each primaryLinks as link, i (link.title)}
      {@render linkRow(link, i)}
    {/each}

    <div class="space-y-4">
      {@render linkRow(featuredProject, primaryLinks.length, true)}

      <button
        type="button"
        aria-expanded={projectsOpen}
        aria-controls="projects-panel"
        on:click={() => (projectsOpen = !projectsOpen)}
        class="flex w-full items-center justify-between rounded-lg border p-2 text-sm backdrop-blur-sm transition-all duration-300 md:p-4 md:text-base"
        class:bg-card-80={$isDarkMode}
        class:bg-white-10={!$isDarkMode}
        class:text-foreground={$isDarkMode}
        class:text-white={!$isDarkMode}
        class:border-border={$isDarkMode}
        class:border-white-10={!$isDarkMode}
      >
        <span>More projects ({projects.length})</span>
        <svg
          class="h-4 w-4 transition-transform duration-300"
          class:rotate-180={projectsOpen}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      {#if projectsOpen}
        <div id="projects-panel" class="space-y-4" transition:slide={{duration: 300}}>
          {#each projects as link, i (link.title)}
            {@render linkRow(link, i, false, true)}
          {/each}
        </div>
      {/if}
    </div>

    {#each otherLinks as link, i (link.title)}
      {@render linkRow(link, primaryLinks.length + 1 + i)}
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
