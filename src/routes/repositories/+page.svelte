<script lang="ts">
  import {onMount} from 'svelte';
  import {language} from '../../lib/stores.js';
  import {t} from '../../lib/i18n.js';
  import {isDarkMode} from '../../stores/theme.js';

  interface Repository {
    name: string;
    html_url: string;
    description: string | null;
    updated_at: string;
    fork: boolean;
  }

  const CACHE_KEY = 'github_repos';
  const CACHE_TTL = 1000 * 60 * 10; // 10 minutes, keeps well under the unauthenticated API limit

  let repositories = $state<Repository[]>([]);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return $t.repos.today;
    } else if (days === 1) {
      return $t.repos.yesterday;
    } else if (days < 7) {
      return $t.repos.daysAgo(days);
    } else {
      return date.toLocaleDateString($language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  }

  const readCache = (): Repository[] | null => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      const {savedAt, data} = JSON.parse(cached) as {savedAt: number; data: Repository[]};
      return Date.now() - savedAt < CACHE_TTL ? data : null;
    } catch {
      return null;
    }
  };

  const writeCache = (data: Repository[]): void => {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({savedAt: Date.now(), data}));
    } catch {
      // Storage unavailable, the list is simply fetched again next time
    }
  };

  onMount(async () => {
    try {
      let data = readCache();
      if (!data) {
        const response = await fetch(
          'https://api.github.com/users/krugou/repos?per_page=100&sort=updated',
        );
        if (!response.ok) {
          throw new Error($t.repos.fetchError);
        }
        data = (await response.json()) as Repository[];
        writeCache(data);
      }
      repositories = data
        .filter((repo) => !repo.fork)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } catch (e) {
      error = e instanceof Error ? e.message : $t.repos.unknownError;
    } finally {
      isLoading = false;
    }
  });
</script>

<svelte:head>
  <title>{$t.repos.pageTitle}</title>
  <meta name="description" content={$t.repos.pageDescription} />
</svelte:head>

<div class="flex min-h-full flex-col">
  <div class="flex-1 px-4 py-16">
    <div
      class="mx-auto max-w-xl rounded-2xl border p-8 shadow-2xl backdrop-blur-lg"
      class:bg-white-5={!$isDarkMode}
      class:border-border={$isDarkMode}
      class:border-white-10={!$isDarkMode}
    >
      <h1
        class="mb-4 text-2xl font-bold"
        class:text-foreground={$isDarkMode}
        class:text-white={!$isDarkMode}
      >
        {$t.repos.heading}
      </h1>
      {#if isLoading}
        <div class="flex justify-center py-8" role="status" aria-label={$t.repos.loading}>
          <div
            class="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2"
            class:border-primary={$isDarkMode}
            class:border-white={!$isDarkMode}
          ></div>
        </div>
      {:else if error}
        <p class="rounded-lg bg-red-900/20 p-4 text-red-400" role="alert">{error}</p>
      {:else if repositories.length === 0}
        <p class:text-muted={$isDarkMode} class:text-white={!$isDarkMode}>{$t.repos.empty}</p>
      {:else}
        <ul class="space-y-4">
          {#each repositories as repo (repo.name)}
            <li
              class="rounded-lg p-4 transition-colors duration-300 hover:bg-white/10"
              class:text-foreground={$isDarkMode}
              class:text-white={!$isDarkMode}
            >
              <div class="flex items-start justify-between gap-2">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:text-primary font-bold transition-colors"
                  class:text-primary={$isDarkMode}
                  class:text-yellow-300={!$isDarkMode}
                >
                  {repo.name}
                </a>
                <span
                  class="text-sm"
                  class:text-muted={$isDarkMode}
                  class:text-white-60={!$isDarkMode}
                  >{$t.repos.updated} {formatDate(repo.updated_at)}</span
                >
              </div>
              {#if repo.description}
                <p class="mt-2" class:text-muted={$isDarkMode} class:text-white={!$isDarkMode}>
                  {repo.description}
                </p>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>
