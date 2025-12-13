import { useState, useEffect, useRef } from 'react';
import { throttle } from 'lodash-es';
import { Hero } from './components/Hero';
import { Links } from './components/Links';
import { Footer } from './components/Footer';
import { Nav } from './components/Nav';
import { useTheme } from './stores/useTheme';
import { useLanguage } from './stores/useLanguage';
import { VisitorTracker } from './lib/visitorTracking';
import type { MousePosition } from './types';

function App() {
  const { isDarkMode } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [hasPointerEvents, setHasPointerEvents] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useRef(
    throttle((event: React.MouseEvent<HTMLDivElement>) => {
      try {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));

        setMousePos({ x, y });
      } catch (error) {
        console.error('Error tracking mouse position:', error);
        setHasPointerEvents(false);
      }
    }, 16)
  ).current;

  useEffect(() => {
    setHasPointerEvents(window.matchMedia('(pointer: fine)').matches);

    const visitorTracker = new VisitorTracker();
    visitorTracker.logVisit();

    return () => {
      handleMouseMove.cancel();
    };
  }, [handleMouseMove]);

  return (
    <div
      className={`flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${
        isDarkMode
          ? 'bg-background from-background via-background to-black'
          : 'bg-white from-purple-500/90 via-blue-900/90 to-blue-900/90'
      }`}
    >
      <Nav language={language} onToggleLanguage={toggleLanguage} />
      <main className="flex-1">
        <div className="flex min-h-full flex-col">
          <div className="flex-1 px-4 py-16">
            <div
              className="relative mx-auto max-w-xl overflow-hidden rounded-2xl border border-border bg-card/80 p-8 shadow-2xl backdrop-blur-lg"
              role="presentation"
              ref={containerRef}
              onMouseMove={handleMouseMove}
            >
              {hasPointerEvents && (
                <div
                  className="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-300"
                  style={{
                    transform: 'translate3d(0,0,0)',
                    background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.10), transparent 25%)`,
                  }}
                ></div>
              )}

              <Hero isDarkMode={isDarkMode} language={language} />
              <Links isDarkMode={isDarkMode} />
            </div>
          </div>
          <Footer language={language} isDarkMode={isDarkMode} />
        </div>
      </main>
    </div>
  );
}

export default App;
