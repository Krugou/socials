<script>
  import Links from '../components/Links.svelte';
  import Footer from '../components/Footer.svelte';
  import Hero from '../components/Hero.svelte';
</script>

<div class="flex min-h-full flex-col">
  <div class="flex-1 px-4 py-16">
    <div class="mx-auto max-w-xl rounded-2xl bg-white/5 p-8 shadow-2xl backdrop-blur-lg border border-white/10">
      <Hero />
      <Links />
    </div>
  </div>
  <Footer />
</div>
