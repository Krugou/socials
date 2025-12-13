<template>
  <div
    v-if="!visible"
    :class="['mx-auto mb-6 h-32 w-32 rounded-full animate-pulse', isDarkMode ? 'bg-card/40' : 'bg-white/5']"
  ></div>
  <div
    v-else
    :class="[
      'relative mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full ring-4 transition-transform hover:scale-105',
      isDarkMode ? 'ring-purple-500/50 bg-background/80' : 'ring-purple-500/30 bg-white/10'
    ]"
  >
    <img
      src="https://avatars.githubusercontent.com/u/59641229?v=4"
      alt="Profile"
      class="h-full w-full object-cover"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean;
  isDarkMode: boolean;
}

defineProps<Props>();
</script>
