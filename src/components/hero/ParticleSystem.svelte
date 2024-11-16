<script lang="ts">
  import {onMount, onDestroy} from 'svelte';
  import type {Particle, ParticleConfig} from '$lib/types';

  /**
   * Custom error for date-related operations
   */
  class DateCalculationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'DateCalculationError';
    }
  }

  /**
   * Calculates age with validation
   */
  const getYearsSinceBirth = (): number => {
    try {
      const birthDate = new Date('1989-05-19');
      const today = new Date();

      if (isNaN(birthDate.getTime())) {
        throw new DateCalculationError('Invalid birth date');
      }

      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 0) {
        throw new DateCalculationError('Calculated age is negative');
      }

      return age;
    } catch (error) {
      console.error('Error calculating age:', error);
      return 20; // Fallback value
    }
  };
  /**
   * Configuration for particle generation
   */
  const MAX_ORBIT = getYearsSinceBirth();

  const MIN_SPEED = 1;
  const MAX_SPEED = Math.max(50, 200 - MAX_ORBIT);

  const PARTICLE_CONFIG: ParticleConfig = {
    minSize: 1,
    maxSize: 4,
    minSpeed: MIN_SPEED,
    maxSpeed: MAX_SPEED,
    minOrbit: 49,
    maxOrbit: MAX_ORBIT * 7
  };

  /**
   * Colors representing Finnish nature and flag
   * Using CSS custom properties for better performance
   */
  const PLANET_COLORS = Object.freeze([
    '#f9d71c', // Sunshine yellow
    '#2d2926', // Dark granite
    '#00a9e0', // Lake blue
    '#f58220', // Autumn orange
    '#006a44' // Forest green
  ] as const);

  /**
   * Generates a random number within bounds
   */
  const randomRange = (min: number, max: number): number => {
    if (min > max) [min, max] = [max, min];
    return Math.random() * (max - min) + min;
  };

  /**
   * Validates particle properties
   */
  const validateParticle = (particle: Particle): boolean => {
    return (
      particle.size >= PARTICLE_CONFIG.minSize &&
      particle.size <= PARTICLE_CONFIG.maxSize &&
      particle.speed >= PARTICLE_CONFIG.minSpeed &&
      particle.speed <= PARTICLE_CONFIG.maxSpeed &&
      particle.orbit >= PARTICLE_CONFIG.minOrbit &&
      particle.orbit <= PARTICLE_CONFIG.maxOrbit
    );
  };

  let particles: Particle[] = [];
  let cleanup: () => void;

  onMount(() => {
    const PARTICLE_COUNT = getYearsSinceBirth();

    particles = Array.from({length: PARTICLE_COUNT}, (_, i): Particle => {
      const particle = {
        id: i,
        size: randomRange(PARTICLE_CONFIG.minSize, PARTICLE_CONFIG.maxSize),
        speed: randomRange(PARTICLE_CONFIG.minSpeed, PARTICLE_CONFIG.maxSpeed),
        orbit: randomRange(PARTICLE_CONFIG.minOrbit, PARTICLE_CONFIG.maxOrbit),
        offset: randomRange(0, 360),
        color: PLANET_COLORS[i % PLANET_COLORS.length]
      };

      if (!validateParticle(particle)) {
        console.warn(`Invalid particle generated: ${JSON.stringify(particle)}`);
      }

      return particle;
    });

    // Optimize animations
    document.body.style.setProperty('--particle-count', PARTICLE_COUNT.toString());

    cleanup = () => {
      document.body.style.removeProperty('--particle-count');
    };
  });

  onDestroy(() => {
    cleanup?.();
  });
</script>

<div
  class="pointer-events-none absolute inset-0 z-0 overflow-visible"
  style="transform: translateY(-50px) rotateX(75deg)"
>
  {#each particles as particle (particle.id)}
    <div
      class="particle absolute rounded-full"
      style="
        --size: {particle.size}rem;
        --speed: {particle.speed}s;
        --orbit: {particle.orbit}px;
        --offset: {particle.offset}deg;
        width: var(--size);
        height: var(--size);
        left: calc(50% - var(--size) / 2);
        top: calc(50% - var(--size) / 2);
        background: radial-gradient(circle at 30% 30%, {particle.color}, #000);
        will-change: transform;
      "
      aria-hidden="true"
    ></div>
  {/each}
</div>

<style lang="postcss">
  .particle {
    animation: orbit var(--speed) linear infinite;
    filter: blur(0.5px);
    transform-style: preserve-3d;
    opacity: 0.9;
    contain: layout style paint;
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

  /* Add will-change hint for better performance */
  @media (prefers-reduced-motion: no-preference) {
    .particle {
      will-change: transform;
    }
  }

  /* Respect user preferences for reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .particle {
      animation: none;
    }
  }
</style>
