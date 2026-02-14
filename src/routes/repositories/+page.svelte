<script lang="ts">
  import {onMount} from 'svelte';
  import {isDarkMode} from '../../stores/theme.js';

  interface Repository {
    name: string;
    html_url: string;
    description: string | null;
    updated_at: string;
  }

  let repositories: Repository[] = [];
  let isLoading = true;
  let error: string | null = null;

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  }

  onMount(async () => {
    try {
      const response = await fetch('https://api.github.com/users/krugou/repos');
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const data = (await response.json()) as Repository[];
      repositories = data.sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error occurred';
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="flex min-h-full flex-col">
  <div class="flex-1 px-4 py-16">
    <div
      class="mx-auto max-w-xl rounded-2xl border p-8 shadow-2xl backdrop-blur-lg"
      class:bg-background-80={$isDarkMode}
      class:bg-white-5={!$isDarkMode}
      class:border-border={$isDarkMode}
      class:border-white-10={!$isDarkMode}
    >
      <h1
        class="mb-4 text-2xl font-bold"
        class:text-foreground={$isDarkMode}
        class:text-white={!$isDarkMode}
      >
        GitHub Repositories
      </h1>
      {#if isLoading}
        <div class="flex justify-center py-8">
          <div
            class="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2"
            class:border-primary={$isDarkMode}
            class:border-white={!$isDarkMode}
          ></div>
        </div>
      {:else if error}
        <p class="rounded-lg bg-red-900/20 p-4 text-red-400">{error}</p>
      {:else}
        <ul class="space-y-4">
          {#each repositories as repo (repo.name)}
            <li
              class="hover:bg-white-20 rounded-lg p-4 transition-colors duration-300"
              class:bg-card-80={$isDarkMode}
              class:bg-white-10={!$isDarkMode}
              class:text-foreground={$isDarkMode}
              class:text-white={!$isDarkMode}
            >
              <div class="flex items-start justify-between">
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
                  class:text-white-60={!$isDarkMode}>Updated {formatDate(repo.updated_at)}</span
                >
              </div>
              {#if repo.description}
                <p class="mt-2" class:text-muted={$isDarkMode} class:text-white-80={!$isDarkMode}>
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
