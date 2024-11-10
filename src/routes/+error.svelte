
<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
  <div class="animate-float rounded-2xl bg-white/5 p-8 shadow-2xl backdrop-blur-lg border border-white/10">
    <h1 class="mb-4 text-6xl font-bold text-white">
      {$page.status}
    </h1>
    <p class="mb-8 text-xl text-white/80">
      {$page.error?.message || "Page not found"}
    </p>
    <a
      href="/"
      class="inline-block rounded-lg bg-yellow-300 px-6 py-3 text-lg font-semibold text-purple-900 transition-all duration-300 hover:bg-yellow-400 hover:scale-105"
    >
      Go Home
    </a>
  </div>
</div>

<style>
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
</style>