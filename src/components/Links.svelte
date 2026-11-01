<script lang="ts">
  import {fly, slide} from 'svelte/transition';
  import {onMount} from 'svelte';
  import type {Component} from 'svelte';
  import type {ProjectLink, SocialLink} from '../lib/types.js';
  import {featuredProject, otherLinks, primaryLinks, projects} from '../lib/links.js';
  import {getParticleBudget, motionDuration, whenIdle} from '../lib/device.js';
  import {language} from '../lib/stores.js';
  import {t} from '../lib/i18n.js';
  import {isDarkMode} from '../stores/theme.js';

  let container = $state<HTMLElement | undefined>();
  let visible = $state(false);
  let projectsOpen = $state(false);
  let Overlay = $state<Component<{container: HTMLElement}> | null>(null);

  onMount(() => {
    visible = true;
    // The particle layer is decorative, so load it after first paint and only when affordable
    if (getParticleBudget(3) > 0) {
      whenIdle(() => {
        import('./ParticleOverlay.svelte').then((module) => {
          Overlay = module.default;
        });
      });
    }
  });
</script>

{#snippet socialRow(link: SocialLink, index: number)}
  <a
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    in:fly={{y: 20, duration: motionDuration(1000), delay: motionDuration(index * 100)}}
    class="group relative block overflow-hidden rounded-lg border p-2 text-center backdrop-blur-sm transition-all duration-300 md:p-4"
    class:text-foreground={$isDarkMode}
    class:text-white={!$isDarkMode}
    class:border-border={$isDarkMode}
    class:border-white-10={!$isDarkMode}
  >
    <div
      class="relative z-10 flex items-center justify-center space-x-2 transition-transform duration-300 motion-safe:group-hover:scale-105"
    >
      <img
        src={link.icon}
        alt=""
        width="24"
        height="24"
        class="h-6 w-6 invert transition-transform duration-300 motion-safe:group-hover:rotate-12"
        loading="lazy"
      />
      <span class="text-sm md:text-base">{link.title}</span>
    </div>
    <div
      class="absolute inset-0 -z-10 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      class:from-primary-10={$isDarkMode}
      class:to-secondary-10={$isDarkMode}
      class:from-purple-500-10={!$isDarkMode}
      class:to-blue-500-10={!$isDarkMode}
    ></div>
  </a>
{/snippet}

{#snippet projectCard(project: ProjectLink, index: number, featured: boolean)}
  <div
    in:fly={{y: 20, duration: motionDuration(1000), delay: motionDuration(index * 100)}}
    class="group relative overflow-hidden rounded-lg border text-left backdrop-blur-sm transition-all duration-300"
    class:ring-2={featured}
    class:ring-purple-400={featured}
    class:shadow-lg={featured}
    class:text-foreground={$isDarkMode}
    class:text-white={!$isDarkMode}
    class:border-border={$isDarkMode}
    class:border-white-10={!$isDarkMode}
  >
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center gap-3 p-3 md:p-4"
    >
      <img
        src={project.icon}
        alt=""
        width={featured ? 48 : 40}
        height={featured ? 48 : 40}
        class="shrink-0 rounded-md motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:rotate-6 {featured
          ? 'h-12 w-12'
          : 'h-10 w-10'}"
        loading="lazy"
      />
      <span class="min-w-0 flex-1">
        <span
          class="block font-semibold {featured ? 'text-base md:text-lg' : 'text-sm md:text-base'}"
        >
          {project.title}
        </span>
        <span
          class="block text-xs md:text-sm"
          class:text-muted={$isDarkMode}
          class:text-white={!$isDarkMode}
        >
          {project.description[$language]}
        </span>
      </span>
    </a>
    <div class="flex flex-wrap items-center gap-1 px-3 pb-3 md:px-4">
      {#each project.tags as tag (tag)}
        <span
          class="rounded-full border px-2 py-0.5 text-xs"
          class:border-border={$isDarkMode}
          class:border-white-10={!$isDarkMode}
        >
          {tag}
        </span>
      {/each}
      <a
        href={project.repo}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="{$t.links.sourceCode}: {project.title}"
        class="ml-auto rounded px-1 text-xs underline underline-offset-2"
      >
        {$t.links.source}
      </a>
    </div>
  </div>
{/snippet}

<div
  bind:this={container}
  class="relative space-y-4 rounded-2xl p-4 shadow-xl"
  class:bg-white-10={!$isDarkMode}
  role="region"
  aria-label="Links"
>
  {#if visible}
    {#if Overlay && container}
      <Overlay {container} />
    {/if}
    {#each primaryLinks as link, i (link.title)}
      {@render socialRow(link, i)}
    {/each}

    <div class="space-y-4">
      {@render projectCard(featuredProject, primaryLinks.length, true)}

      <button
        type="button"
        aria-expanded={projectsOpen}
        aria-controls="projects-panel"
        onclick={() => (projectsOpen = !projectsOpen)}
        class="flex w-full items-center justify-between rounded-lg border p-2 text-sm backdrop-blur-sm transition-all duration-300 md:p-4 md:text-base"
        class:text-foreground={$isDarkMode}
        class:text-white={!$isDarkMode}
        class:border-border={$isDarkMode}
        class:border-white-10={!$isDarkMode}
      >
        <span>{$t.links.moreProjects(projects.length)}</span>
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
        <div
          id="projects-panel"
          class="space-y-4"
          transition:slide={{duration: motionDuration(300)}}
        >
          {#each projects as project, i (project.title)}
            {@render projectCard(project, i, false)}
          {/each}
        </div>
      {/if}
    </div>

    {#each otherLinks as link, i (link.title)}
      {@render socialRow(link, primaryLinks.length + 1 + i)}
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
  /* Apply hover effect on devices that support hover and allow motion */
  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    a {
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    a:hover {
      transform: translateY(-2px);
    }
  }
</style>
