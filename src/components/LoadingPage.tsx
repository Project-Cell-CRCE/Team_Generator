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
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          setTimeout(onLoadingComplete, 500);
          clearInterval(interval);
          return 100;
        }
        
        const targetStep = Math.floor(newProgress / 20);
        if (targetStep > stepIndex && targetStep < loadingSteps.length) {
          stepIndex = targetStep;
          setLoadingText(loadingSteps[stepIndex]);
        }
        
        return newProgress;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden animate-color-shift">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-accent/10 animate-pulse" />

      <div className="relative z-10 text-center px-4">
        {/* Loading text */}
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 animate-pulse-neon tracking-wider">
          TEAM GENERATOR
        </h1>
        
        <p className="text-lg text-muted-foreground mb-10 animate-float font-medium">
          {loadingText}
        </p>

        {/* Smooth progress bar */}
        <div className="w-72 md:w-96 mx-auto">
          <div className="bg-muted/50 h-2 rounded-full border border-primary/20 overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-primary/80 text-sm mt-3 font-mono tracking-widest">
            {progress}% COMPLETE
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;