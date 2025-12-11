import React, { useMemo } from 'react';
import NavigationBar from './NavigationBar';

interface PageLayoutProps {
  children: React.ReactNode;
  showStars?: boolean;
}

const PageLayout = ({ children, showStars = true }: PageLayoutProps) => {
  // Memoize stars so they don't regenerate on re-renders
  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDelay: Math.random() * 20,
      animationDuration: 20 + Math.random() * 10,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden galaxy-bg">
      <NavigationBar />
      
      {/* Animated galaxy background with stars */}
      {showStars && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {stars.map((star, i) => (
            <div
              key={i}
              className="star"
              style={{
                width: `${star.width}px`,
                height: `${star.height}px`,
                top: `${star.top}%`,
                left: `${star.left}%`,
                animationDelay: `${star.animationDelay}s`,
                animationDuration: `${star.animationDuration}s`,
              }}
            />
          ))}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-secondary/10 rounded-full blur-2xl animate-float"></div>
        </div>
      )}

      <div className="relative z-10 pt-20 p-6">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
