export default {
  plugins: {
    '@tailwindcss/postcss': {},
    'autoprefixer': {}, // autoprefixer is usually recommended/included but Tailwind 4 might bundle it or not?
    // Tailwind 4 docs say: @tailwindcss/postcss includes vendor prefixing. Autoprefixer is NOT needed usually, but let's check.
    // Actually, docs say: "You don't need autoprefixer...".
  },
};
