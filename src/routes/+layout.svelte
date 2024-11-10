<script lang="ts">
  import '../app.css';
  import Nav from '../components/Nav.svelte';
  let {children} = $props();
</script>

<div
  class="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500 via-blue-900 to-black"
>
  <Nav />
  <main class="flex-1">
    {@render children()}
  </main>
</div>
