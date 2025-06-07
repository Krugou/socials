<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
  <div class="animate-float rounded-2xl bg-card/80 p-8 shadow-2xl backdrop-blur-lg border border-border">
    <h1 class="mb-4 text-6xl font-bold text-foreground">
      {$page.status}
    </h1>
    <p class="mb-8 text-xl text-muted">
      {$page.error?.message || "Page not found"}
    </p>
    <a
      href="/"
      class="inline-block rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-background transition-all duration-300 hover:bg-primary-dark hover:scale-105"
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