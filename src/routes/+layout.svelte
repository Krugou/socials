<script lang="ts">
  import '../app.css';
  import Nav from '../components/Nav.svelte';
  let {children} = $props();
</script>

<div
  class="flex min-h-screen flex-col bg-background from-background via-background to-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]"
>
  <Nav />
  <main class="flex-1">
    {@render children()}
  </main>
</div>
