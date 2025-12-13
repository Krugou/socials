<template>
  <footer
    :class="[
      'mt-auto w-full px-6 py-4 border-t',
      isDarkMode
        ? 'bg-background/80 border-border'
        : 'bg-white/10 border-white/10'
    ]"
  >
    <div class="mx-auto flex max-w-xl flex-col gap-4">
      <a
        href="mailto:aleksi.nokelainen@gmail.com"
        :class="[
          'flex items-center justify-center text-sm transition-colors duration-300',
          isDarkMode
            ? 'text-muted hover:text-foreground'
            : 'text-white/60 hover:text-white/90'
        ]"
        :aria-label="translations[language].emailAriaLabel"
        :title="translations[language].emailAriaLabel"
      >
        aleksi.nokelainen@gmail.com
      </a>
      <div
        :class="[
          'flex items-center justify-center transition-colors duration-300',
          isDarkMode
            ? 'text-muted hover:text-foreground'
            : 'text-white/60 hover:text-white/90'
        ]"
      >
        <span class="px-2 text-sm">{{ translations[language].madeWith }}</span>
        <svg
          class="animate-spin-slow h-5 w-5"
          viewBox="0 0 261.76 226.69"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Vue logo"
        >
          <path
            fill="currentColor"
            d="M161.096.001l-30.224 52.35L100.647.001H-.005L130.872 226.69 261.749.001z"
          />
        </svg>
        <span class="px-2 text-sm font-medium">Vue</span>
      </div>
      <div
        :class="[
          'text-center text-sm transition-colors duration-300',
          isDarkMode
            ? 'text-muted hover:text-foreground'
            : 'text-white/60 hover:text-white/90'
        ]"
      >
        {{ translations[language].builtOn }}
        <span v-if="formattedDate && !hasError"> {{ formattedDate }}</span>
        <span v-else class="text-red-400" role="alert">
          {{ translations[language].buildDateError }}
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Language, Translations } from '../types';

interface Props {
  language: Language;
  isDarkMode: boolean;
}

const props = defineProps<Props>();

const translations: Pick<Translations, 'en' | 'fi'> = {
  en: {
    madeWith: 'Made with',
    emailAriaLabel: 'Send email to Aleksi Nokelainen',
    builtOn: 'Built on',
    buildDateError: 'Build date unavailable',
  },
  fi: {
    madeWith: 'Tehty käyttäen',
    emailAriaLabel: 'Lähetä sähköpostia Aleksi Nokelaiselle',
    builtOn: 'Rakennettu',
    buildDateError: 'Rakennuspäivämäärä ei saatavilla',
  },
};

const formattedDate = ref<string | null>(null);
const hasError = ref(false);

const updateDate = () => {
  try {
    const date = new Date();
    formattedDate.value = date.toLocaleDateString(props.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting build date:', error);
    hasError.value = true;
  }
};

onMounted(updateDate);

watch(() => props.language, updateDate);
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}
</style>
