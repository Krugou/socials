<template>
  <div
    ref="containerRef"
    :class="[
      'perspective relative m-8 text-center rounded-2xl shadow-xl',
      isDarkMode ? 'bg-background/80' : 'bg-white/10'
    ]"
    role="region"
    style="perspective: 1000px; transform-style: preserve-3d"
  >
    <ParticleSystem />
    <ProfileImage :visible="visible" :isDarkMode="isDarkMode" />
    <HeroContent :visible="visible" :scrollY="scrollY" :language="language" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ParticleSystem from './ParticleSystem.vue';
import ProfileImage from './ProfileImage.vue';
import HeroContent from './HeroContent.vue';
import type { Language } from '../types';

interface Props {
  isDarkMode: boolean;
  language: Language;
}

defineProps<Props>();

const visible = ref(false);
const scrollY = ref(0);
const containerRef = ref<HTMLDivElement | null>(null);

const handleScroll = () => {
  scrollY.value = window.scrollY;
};

onMounted(() => {
  visible.value = true;

  window.addEventListener('scroll', handleScroll, { passive: true });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    { threshold: 0.1 }
  );

  if (containerRef.value) {
    observer.observe(containerRef.value);
  }

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    observer.disconnect();
  });
});
</script>
