import { useState, useEffect, useRef } from 'react';
import { ParticleSystem } from './ParticleSystem';
import { ProfileImage } from './ProfileImage';
import { HeroContent } from './HeroContent';
import type { Language } from '../types';

interface HeroProps {
  isDarkMode: boolean;
  language: Language;
}

export const Hero: React.FC<HeroProps> = ({ isDarkMode, language }) => {
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(true);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`perspective relative m-8 text-center rounded-2xl shadow-xl ${
        isDarkMode ? 'bg-background/80' : 'bg-white/10'
      }`}
      role="region"
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      <ParticleSystem />
      <ProfileImage visible={visible} isDarkMode={isDarkMode} />
      <HeroContent visible={visible} scrollY={scrollY} language={language} />
    </div>
  );
};
