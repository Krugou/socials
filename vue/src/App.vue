<template>
  <div
    :class="[
      'flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]',
      isDarkMode
        ? 'bg-background from-background via-background to-black'
        : 'bg-white from-purple-500/90 via-blue-900/90 to-blue-900/90'
    ]"
  >
    <Nav :language="language" :onToggleLanguage="toggleLanguage" />
    <main class="flex-1">
      <div class="flex min-h-full flex-col">
        <div class="flex-1 px-4 py-16">
          <div
            ref="containerRef"
            class="relative mx-auto max-w-xl overflow-hidden rounded-2xl border border-border bg-card/80 p-8 shadow-2xl backdrop-blur-lg"
            role="presentation"
            @mousemove="handleMouseMove"
          >
            <div
              v-if="hasPointerEvents"
              class="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-300"
              :style="{
                transform: 'translate3d(0,0,0)',
                background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.10), transparent 25%)`,
              }"
            ></div>

            <Hero :isDarkMode="isDarkMode" :language="language" />
            <Links :isDarkMode="isDarkMode" />
          </div>
        </div>
        <Footer :language="language" :isDarkMode="isDarkMode" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { throttle } from 'lodash-es';
import Hero from './components/Hero.vue';
import Links from './components/Links.vue';
import Footer from './components/Footer.vue';
import Nav from './components/Nav.vue';
import { useTheme } from './composables/useTheme';
import { useLanguage } from './composables/useLanguage';
import { VisitorTracker } from './lib/visitorTracking';
import type { MousePosition } from './types';

const { isDarkMode } = useTheme();
const { language, toggleLanguage } = useLanguage();

const mousePos = ref<MousePosition>({ x: 0, y: 0 });
const hasPointerEvents = ref(true);
const containerRef = ref<HTMLDivElement | null>(null);

const handleMouseMoveThrottled = throttle((event: MouseEvent) => {
  try {
    if (!containerRef.value) return;

    const rect = containerRef.value.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));

    mousePos.value = { x, y };
  } catch (error) {
    console.error('Error tracking mouse position:', error);
    hasPointerEvents.value = false;
  }
}, 16);

const handleMouseMove = (event: MouseEvent) => {
  handleMouseMoveThrottled(event);
};

onMounted(() => {
  hasPointerEvents.value = window.matchMedia('(pointer: fine)').matches;

  const visitorTracker = new VisitorTracker();
  visitorTracker.logVisit();
});

onUnmounted(() => {
  handleMouseMoveThrottled.cancel();
});
</script>
