<script>
  import {base} from '$app/paths';
  const links = [
    {
      title: 'GitHub',
      url: 'https://github.com/krugou',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/github.svg'
    },
    {
      title: 'Instagram',
      url: 'https://www.instagram.com/krugou/',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/instagram.svg'
    },
    {
      title: 'Threads',
      url: 'https://threads.net/krugou',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/threads.svg'
    },
    {
      title: 'Twitter',
      url: 'https://twitter.com/krugou',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/twitter.svg'
    },
    // bluesky
    {
      title: 'Bluesky',
      url: 'https://bsky.app/profile/krugou.bsky.social',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/bluesky.svg'
    },
    {
      title: 'YouTube',
      url: 'https://www.youtube.com/channel/krugou',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/youtube.svg'
    },
    {
      title: 'LinkedIn',
      url: 'https://www.linkedin.com/in/aleksi-nokelainen-3706b7259/',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/linkedin.svg'
    },
    {
      title: 'Facebook',
      url: 'https://www.facebook.com/aleksi.nokelainen.7',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/facebook.svg'
    },

    {
      title: 'Portfolio',
      url: 'https://krugou.github.io',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@3.13.0/icons/googlechrome.svg'
    }
  ];
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-500 to-blue-900 px-4 py-8">
  <div class="mx-auto max-w-xl">
    <div class="mb-8 text-center">
      <img
        src="https://avatars.githubusercontent.com/u/59641229?v=4"
        alt="Profile"
        class="mx-auto mb-4 h-24 w-24 rounded-full"
      />
      <h1 class="text-2xl font-bold text-white">Aleksi Nokelainen</h1>
      <p class="text-white/80">
        Full Stack Developer passionate about creating intuitive software solutions. Proficient in
        JavaScript, TypeScript, React, Node.js,Svelte, and Python.
      </p>
    </div>

    <div class="space-y-4">
      {#each links as link}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          class="block rounded-lg bg-white/10 p-4 text-center text-white backdrop-blur-sm transition-colors duration-1000 hover:scale-105 hover:bg-white/20"
        >
          <img src={link.icon} alt={link.title} class="mr-2 inline-block h-6 w-6 invert" />
          {link.title}
        </a>
      {/each}
    </div>
  </div>

  <footer class="absolute bottom-0 left-0 right-0 px-6 py-4">
    <div class="mx-auto max-w-xl">
      <div
        class="flex items-center justify-center space-x-2 text-white/60 transition-colors duration-300 hover:text-white/90"
      >
        <span class="text-sm">Made with</span>
        <svg
          class="animate-spin-slow h-5 w-5"
          viewBox="0 0 98.1 118"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M91.8 15.6C80.9-.1 59.2-4.7 43.6 5.2L16.1 22.8C8.6 27.5 3.4 35.2 1.9 43.9c-1.3 7.3-.2 14.8 3.3 21.3-2.4 3.6-4 7.6-4.7 11.8-1.6 8.9.5 18.1 5.7 25.4 11 15.7 32.6 20.3 48.2 10.4l27.5-17.5c7.5-4.7 12.7-12.4 14.2-21.1 1.3-7.3.2-14.8-3.3-21.3 2.4-3.6 4-7.6 4.7-11.8 1.7-9-.4-18.2-5.7-25.5"
          />
        </svg>
        <span class="text-sm font-medium">Svelte</span>
      </div>
    </div>
  </footer>
</div>

<style>
  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin-slow {
    animation: spin-slow 20s linear infinite;
  }
</style>
