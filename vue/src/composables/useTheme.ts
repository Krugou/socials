import { ref, onMounted, onUnmounted } from 'vue';

export const useTheme = () => {
  const isDarkMode = ref(true);

  const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
    isDarkMode.value = e.matches;
  };

  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    isDarkMode.value = mediaQuery.matches;
    mediaQuery.addEventListener('change', updateTheme);

    onUnmounted(() => {
      mediaQuery.removeEventListener('change', updateTheme);
    });
  });

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
  };

  return { isDarkMode, toggleTheme };
};
