<script lang="ts">
  import {onMount} from 'svelte';
  import type {ParticleConfig} from '../../lib/types/particles.js';
  import {getParticleBudget} from '../../lib/device.js';

  interface OrbitParticle {
    id: string;
    size: number;
    speed: number;
    orbit: number;
    offset: number;
    color: string;
  }

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
      return 30; // Fallback value
    }
  };
  /**
   * Configuration for particle generation
   */
  const MAX_ORBIT = getYearsSinceBirth();

  const MIN_SPEED = 25;
  const MAX_SPEED = Math.max(50, 200 - MAX_ORBIT);

  const PARTICLE_CONFIG: ParticleConfig = {
    minSize: 1,
    maxSize: 4,
    minSpeed: MIN_SPEED,
    maxSpeed: MAX_SPEED,
    minOrbit: 49,
    maxOrbit: MAX_ORBIT * 7,
  };

  /**
   * Colors representing Finnish nature and flag
   */
  const PLANET_COLORS = Object.freeze([
    '#FFFFFF',
    '#002F6C',
    '#00a9e0',
    '#f0f0f0',
    '#ffcc00',
    '#006a44',
  ] as const);

  /**
   * Generates a random number within bounds
   */
  const randomRange = (min: number, max: number): number => {
    if (min > max) [min, max] = [max, min];
    return Math.random() * (max - min) + min;
  };

  let particles = $state<OrbitParticle[]>([]);
  let paused = $state(false);

  onMount(() => {
    // Fewer particles on low-power devices, none with reduced motion
    const particleCount = getParticleBudget(getYearsSinceBirth());

    particles = Array.from({length: particleCount}, (_, i) => ({
      id: i.toString(),
      size: randomRange(PARTICLE_CONFIG.minSize, PARTICLE_CONFIG.maxSize),
      speed: randomRange(PARTICLE_CONFIG.minSpeed, PARTICLE_CONFIG.maxSpeed),
      orbit: randomRange(PARTICLE_CONFIG.minOrbit, PARTICLE_CONFIG.maxOrbit),
      offset: randomRange(0, 360),
      color: PLANET_COLORS[i % PLANET_COLORS.length],
    }));

    // Pause the CSS animations while the tab is in the background
    const onVisibilityChange = () => {
      paused = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  });
</script>

<div
  class="pointer-events-none absolute inset-0 z-0 overflow-visible"
  class:paused
  style="transform: translateY(-50px) rotateX(75deg)"
  aria-hidden="true"
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
        height: calc(1.2 * var(--size));
        left: calc(50% - var(--size) / 2);
        top: calc(50% - var(--size) / 2);
        background: radial-gradient(circle at 30% 30%, {particle.color}, #002F6C);
      "
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
    will-change: transform;
  }

  .paused .particle {
    animation-play-state: paused;
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

  /* Respect user preferences for reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .particle {
      animation: none;
    }
  }
</style>
