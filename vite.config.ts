import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  define: {
    // Use ISO string format for better date parsing
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
});
