import adapter from '@sveltejs/adapter-static';
import {sveltekit} from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      adapter: adapter({
        pages: 'build',
        assets: 'build',
        fallback: '404.html',
        precompress: false,
        strict: false,
      }),
      paths: {
        base: process.env.NODE_ENV === 'production' ? '/socials' : '',
      },
      preprocess: vitePreprocess(),
    }),
  ],
  define: {
    // Use ISO string format for better date parsing
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
