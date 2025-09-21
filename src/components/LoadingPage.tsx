import React, { useState, useEffect } from 'react';

const LoadingPage = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing System...");

  useEffect(() => {
    const loadingSteps = [
      "Initializing System...",
      "Loading Game Engine...",
      "Connecting to Server...",
      "Preparing Team Generator...",
      "System Ready!"
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 20;
        if (newProgress >= 100) {
          setTimeout(onLoadingComplete, 500);
          clearInterval(interval);
          return 100;
        }
        
        if (stepIndex < loadingSteps.length - 1) {
          stepIndex++;
          setLoadingText(loadingSteps[stepIndex]);
        }
        
        return newProgress;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background gaming grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
          {Array.from({ length: 96 }).map((_, i) => (
            <div
              key={i}
              className="border border-primary/10 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 text-center">
        {/* Spinning gaming logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-primary/20 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 w-16 h-16 border-4 border-accent rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
            <div className="absolute inset-4 w-8 h-8 bg-gradient-gaming rounded-full animate-pulse-neon"></div>
          </div>
        </div>

        {/* Loading text */}
        <h1 className="text-4xl font-bold text-primary mb-4 animate-pulse-neon">
          TEAM GENERATOR
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 animate-float">
          {loadingText}
        </p>

        {/* Progress bar */}
        <div className="w-80 mx-auto">
          <div className="bg-muted h-3 rounded-full border border-primary/30 overflow-hidden">
            <div 
              className="h-full bg-gradient-gaming transition-all duration-300 ease-out glow-primary"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-primary text-sm mt-2 font-mono">
            {progress}% COMPLETE
          </div>
        </div>

        {/* Gaming particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full animate-float opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;