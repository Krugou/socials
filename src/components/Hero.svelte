<script lang="ts">
  import {fly, fade} from 'svelte/transition';
  import {spring} from 'svelte/motion';
  import {onMount, onDestroy} from 'svelte';
  import {language} from '../lib/stores.js';
  import type {Translations} from '../lib/types.js';
  let visible = false;
  let container: HTMLElement;
  let mousePos = spring(
    {x: 0, y: 0},
    {
      stiffness: 0.1,
      damping: 0.4
    }
  );

  const translations: Translations = {
    en: {
      title: 'Aleksi Nokelainen',
      description:
        'Full Stack Developer passionate about creating intuitive software solutions. Proficient in JavaScript, TypeScript, React, Node.js, Svelte, and Python.'
    },
    fi: {
      title: 'Aleksi Nokelainen',
      description:
        'Full Stack -kehittäjä, joka on intohimoinen luomaan intuitiivisia ohjelmistoratkaisuja. Vahva osaaminen JavaScript, TypeScript, React, Node.js, Svelte ja Python -teknologioissa.'
    }
  };

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
  function getTranslation(lang: string): (typeof translations)['en'] {
    return translations[lang as keyof typeof translations] ?? translations.en;
  }

  /** Calculate years since birth date */
  const getYearsSinceBirth = (): number => {
    // my birth date
    const birthDate = new Date('1989-05-19');
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  /** Number of particles matching age */
  const PARTICLE_COUNT = getYearsSinceBirth();
  const randomRange = (min: number, max: number): number => Math.random() * (max - min) + min;
  /** Configuration for particle system */
  const particles = Array.from({length: PARTICLE_COUNT}, (_, i) => ({
    id: i,
    size: randomRange(0.5, 2),
    speed: Math.random() * 100 + 20,
    orbit: Math.random() * 60 + 50,
    offset: Math.random() * 360
  }));
</script>

<svelte:window bind:scrollY />

<div bind:this={container} class="perspective relative m-8 text-center" role="region">
  <!-- Particle system -->
  <div
    class="pointer-events-none absolute inset-0 overflow-visible"
    style="transform: translateY(-50px)"
  >
    {#each particles as particle (particle.id)}
      <div
        class="particle absolute h-1 w-1 rounded-full bg-gradient-to-br from-purple-300/70 to-blue-700/70"
        style="
          --size: {particle.size}rem;
          --speed: {particle.speed}s;
          --orbit: {particle.orbit}px;
          --offset: {particle.offset}deg;
          width: var(--size);
          height: var(--size);
          left: calc(50% - var(--size) / 2);
          top: calc(50% - var(--size) / 2);
        "
      ></div>
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
        class="bg-gradient-to-r from-purple-200 to-blue-400 bg-clip-text text-4xl font-bold text-transparent"
      >
        {getTranslation($language).title}
      </h1>

      <p
        in:fade={{duration: 1000, delay: 600}}
        class="mx-auto max-w-2xl bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text px-4 py-4 text-sm font-bold leading-relaxed text-transparent transition-all duration-1000 ease-in-out hover:from-blue-200 hover:to-purple-200 md:text-lg"
      >
        {getTranslation($language).description}
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
    animation: orbit var(--speed) linear infinite;
    filter: blur(1px);
  }

  @keyframes orbit {
    from {
      transform: rotate(var(--offset)) translateX(var(--orbit)) rotate(calc(var(--offset) * -1));
    }
    to {
      transform: rotate(calc(360deg + var(--offset))) translateX(var(--orbit))
        rotate(calc((360deg + var(--offset)) * -1));
    }
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
