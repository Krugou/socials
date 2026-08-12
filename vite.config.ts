import {sveltekit} from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  define: {
    // Use ISO string format for better date parsing
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
