import { useState, useEffect } from 'react';
import type { SocialLink } from '../types';

const links: SocialLink[] = [
  {
    title: 'GitHub',
    url: 'https://github.com/krugou',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/github.svg',
  },
  {
    title: 'Instagram',
    url: 'https://www.instagram.com/krugou/',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/instagram.svg',
  },
  {
    title: 'Threads',
    url: 'https://threads.net/krugou',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/threads.svg',
  },
  {
    title: 'Twitter',
    url: 'https://twitter.com/krugou',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/twitter.svg',
  },
  {
    title: 'Bluesky',
    url: 'https://bsky.app/profile/krugou.bsky.social',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/bluesky.svg',
  },
  {
    title: 'YouTube',
    url: 'https://www.youtube.com/@Krugou',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/youtube.svg',
  },
  {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/aleksi-nokelainen-3706b7259/',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/linkedin.svg',
  },
  {
    title: 'Facebook',
    url: 'https://www.facebook.com/aleksi.nokelainen.7',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/facebook.svg',
  },
];

interface LinksProps {
  isDarkMode: boolean;
}

export const Links: React.FC<LinksProps> = ({ isDarkMode }) => {
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`perspective relative space-y-4 p-4 rounded-2xl shadow-xl ${
        isDarkMode ? 'bg-background/80' : 'bg-white/10'
      }`}
      role="region"
      style={{
        transform: `translateY(${scrollY * 0.1}px)`,
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {visible ? (
        links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative block overflow-hidden rounded-lg p-2 text-center backdrop-blur-sm transition-all duration-300 md:p-4 border ${
              isDarkMode
                ? 'bg-card/80 text-foreground border-border'
                : 'bg-white/10 text-white border-white/10'
            }`}
            style={{
              animation: `fly-in 1s ease-out ${i * 100}ms both`,
            }}
          >
            <div className="relative z-10 flex items-center justify-center space-x-2 transition-transform duration-300 group-hover:scale-105">
              <img
                src={link.icon}
                alt={link.title}
                className="h-6 w-6 invert transition-transform duration-300 group-hover:rotate-12"
                loading="lazy"
              />
              <span className="text-sm md:text-base">{link.title}</span>
            </div>
            <div
              className={`absolute inset-0 -z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-primary/10 to-secondary/10'
                  : 'bg-gradient-to-r from-purple-500/10 to-blue-500/10'
              }`}
            ></div>
          </a>
        ))
      ) : (
        <>
          <div
            className={`h-[68px] animate-pulse rounded-lg ${
              isDarkMode ? 'bg-card/40' : 'bg-white/5'
            }`}
          ></div>
          <div
            className={`h-[68px] animate-pulse rounded-lg ${
              isDarkMode ? 'bg-card/40' : 'bg-white/5'
            }`}
          ></div>
        </>
      )}
      <style>{`
        @keyframes fly-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (hover: hover) {
          a {
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }
          a:hover {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </div>
  );
};
