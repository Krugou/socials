import type {Handle} from '@sveltejs/kit/hooks';
import {sameAs} from './lib/links.js';

const SITE_ORIGIN = 'https://krugou.github.io';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  'name': 'Aleksi Nokelainen',
  'jobTitle': 'Full Stack Developer',
  'url': `${SITE_ORIGIN}/socials/`,
  'image': `${SITE_ORIGIN}/socials/og-image.png`,
  'knowsAbout': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Svelte', 'Python'],
  sameAs,
};

/**
 * Fills the <!--seo--> placeholder in app.html with the canonical URL, og:url and, on the
 * home page, Person structured data. Runs at build time because the site is prerendered.
 */
export const handle: Handle = ({event, resolve}) => {
  const pageUrl = `${SITE_ORIGIN}${event.url.pathname}`;
  // "<" is escaped so the JSON cannot close the script tag early
  const jsonLd = JSON.stringify(personJsonLd).replace(/</g, '\\u003c');
  const isHome = /^\/(socials\/?)?$/.test(event.url.pathname);

  const seo = [
    `<link rel="canonical" href="${pageUrl}" />`,
    `<meta property="og:url" content="${pageUrl}" />`,
    isHome ? `<script type="application/ld+json">${jsonLd}</script>` : '',
  ].join('\n    ');

  return resolve(event, {
    transformPageChunk: ({html}) =>
      html.replace(
        '<!--seo-->',
        `<!--seo-->
    ${seo}`,
      ),
  });
};
