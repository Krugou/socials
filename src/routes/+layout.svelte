<script lang="ts">
  import '../app.css';
  import Nav from '../components/Nav.svelte';
  import { isDarkMode } from '../stores/theme.js';
</script>

<div
  class="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]"
  class:bg-background={$isDarkMode}
  class:bg-white={!$isDarkMode}
  class:from-background={$isDarkMode}
  class:from-purple-500\/90={!$isDarkMode}
  class:via-background={$isDarkMode}
  class:via-blue-900\/90={!$isDarkMode}
  class:to-black={$isDarkMode}
  class:to-blue-900\/90={!$isDarkMode}
>
  <Nav />
  <main class="flex-1">
    <slot />
  </main>
</div>
