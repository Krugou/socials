<script lang="ts">
  import {fade, fly} from 'svelte/transition';
  import {spring} from 'svelte/motion';
  import {onMount} from 'svelte';

  const links = [
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

  let visible = false;
  onMount(() => {
    visible = true;
  });

  let scrollY: number;
</script>

<svelte:window bind:scrollY />

<div
  bind:this={container}
  on:mousemove={handleMouseMove}
  class="perspective relative space-y-4 p-4"
  role="region"
  style="transform: translateY({scrollY * 0.1}px)"
>
  <div
    class="pointer-events-none fixed inset-0 opacity-50"
    style="background: radial-gradient(circle at {$mousePos.x}px {$mousePos.y}px, rgba(139, 92, 246, 0.15), transparent 25%)"
  ></div>

  <!-- Particle background -->
  <div class="absolute inset-0 overflow-visible">
    {#each Array(20) as _, i}
      <div
        class="particle absolute h-3 w-3 rounded-full bg-purple-800/20"
        style="--index: {i}; --x-range: 300; --y-range: 200;"
      ></div>
    {/each}
  </div>

  {#if visible}
    {#each links as link, i}
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        in:fly={{
          y: 20,
          duration: 1000,
          delay: i * 100
        }}
        class="group relative block overflow-hidden rounded-lg bg-white/10 p-4 text-center text-white backdrop-blur-sm"
      >
        <div
          class="relative z-10 flex items-center justify-center space-x-3 transition-transform duration-300 group-hover:scale-105"
        >
          <img
            src={link.icon}
            alt={link.title}
            class="h-6 w-6 invert transition-transform duration-300 group-hover:rotate-12"
          />
          <span>{link.title}</span>
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
    animation: float 40s infinite;
    animation-delay: calc(var(--index) * -2s);
    filter: blur(1px);
  }

  @keyframes float {
    0%,
    100% {
      transform: translate(0, 0) scale(0.5);
    }
    25% {
      transform: translate(calc(var(--x-range) * 1px), calc(var(--y-range) * 1px)) scale(1);
    }
    50% {
      transform: translate(calc(var(--x-range) * -1px), calc(var(--y-range) * -0.5px)) scale(0.75);
    }
    75% {
      transform: translate(calc(var(--x-range) * -0.5px), calc(var(--y-range) * -1px)) scale(1);
    }
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
