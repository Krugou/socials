<script>
  import {base} from '$app/paths';
  const links = [
    {
      title: 'GitHub',
      url: 'https://github.com/krugou',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/github.svg'
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
      title: 'Portfolio',
      url: 'https://krugou.github.io',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@3.13.0/icons/googlechrome.svg'
    }
  ];
</script>

<nav>
  <a href="{base}/">Home</a>
  <a href="{base}/about">About</a>
  <a href="{base}/blog">Blog</a>
  <a href="{base}/contact">Contact</a>
</nav>
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
          class="block rounded-lg bg-white/10 p-4 text-center text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <img src={link.icon} alt={link.title} class="mr-2 inline-block h-6 w-6 invert" />
          {link.title}
        </a>
      {/each}
    </div>
  </div>
</div>
