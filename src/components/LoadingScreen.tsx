import React, { useState, useEffect } from 'react';

export default function LoadingScreen({ onLoadComplete }: { onLoadComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [isComplete, setIsComplete] = useState(false);
  const [showLaunchButton, setShowLaunchButton] = useState(false);

  // Preload home page assets
  useEffect(() => {
    const preloadAssets = async () => {
      // Preload components
      const componentsToPreload = [
        '/components/MatrixRain.js',
        '/components/ScrambleText.js',
        '/components/TypewriterText.js',
        '/components/ScrollLink.js',
        '/components/GoToTop.js'
      ];

      // Preload images
      const imagesToPreload = [
        '/favicon.svg',
        'https://via.placeholder.com/200'
      ];

      // Create preload links
      const head = document.head;
      
      // Preload components
      componentsToPreload.forEach(component => {
        const link = document.createElement('link');
        link.rel = 'modulepreload';
        link.href = component;
        head.appendChild(link);
      });

      // Preload images
      imagesToPreload.forEach(image => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = image;
        head.appendChild(link);
      });

      // Preload the home page
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/home';
      head.appendChild(link);
    };

    preloadAssets();
  }, []);

  useEffect(() => {
    const loadingSteps = [
      { text: 'Initializing system...', duration: 1000 },
      { text: 'Establishing secure connection...', duration: 800 },
      { text: 'Loading encryption protocols...', duration: 700 },
      { text: 'Verifying security certificates...', duration: 600 },
      { text: 'Preloading components...', duration: 900 },
      { text: 'Launching secure environment...', duration: 900 }
    ];

    let currentStep = 0;
    let startTime = Date.now();
    const totalDuration = loadingSteps.reduce((acc, step) => acc + step.duration, 0);

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed >= totalDuration) {
        setProgress(100);
        setLoadingText('System Ready. Launch when ready.');
        if (!isComplete) {
          setIsComplete(true);
          setTimeout(() => {
            setShowLaunchButton(true);
          }, 500);
        }
        return;
      }

      // Calculate which step we're on and the progress within that step
      let accumulatedTime = 0;
      let currentStepIndex = 0;
      
      for (let i = 0; i < loadingSteps.length; i++) {
        if (elapsed > accumulatedTime + loadingSteps[i].duration) {
          accumulatedTime += loadingSteps[i].duration;
          currentStepIndex++;
        } else {
          break;
        }
      }

      if (currentStepIndex !== currentStep) {
        currentStep = currentStepIndex;
        setLoadingText(loadingSteps[Math.min(currentStep, loadingSteps.length - 1)].text);
      }

      const stepProgress = elapsed - accumulatedTime;
      const stepPercentage = (stepProgress / loadingSteps[currentStep].duration) * (100 / loadingSteps.length);
      const basePercentage = (currentStep * 100) / loadingSteps.length;

      setProgress(Math.min(basePercentage + stepPercentage, 100));
      requestAnimationFrame(updateProgress);
    };

    requestAnimationFrame(updateProgress);
  }, []);

  const handleLaunch = () => {
    setShowLaunchButton(false);
    onLoadComplete();
  };

  return (
    <div 
      className={`
        loading-screen fixed inset-0 bg-black z-[999] 
        flex flex-col items-center justify-center 
        transition-all duration-1000 ease-in-out
        ${!showLaunchButton && isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}
    >
      <div className="w-64 text-center">
        <div className="mb-8">
          <div className="font-tech-mono text-4xl text-neon-red mb-2 animate-pulse">
            SILENT CODE
          </div>
          <div className="text-sm text-white/80 font-tech-mono h-6">
            {loadingText}
          </div>
        </div>
        
        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-neon-red transition-all duration-300 rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 animate-pulse bg-white/30"></div>
          </div>
        </div>
        
        <div className="mt-2 text-right text-sm font-tech-mono text-neon-red">
          {Math.round(progress)}%
        </div>

        {showLaunchButton && (
          <a
            href="/home"
            className="mt-8 w-full p-4 bg-black border-2 border-neon-red text-neon-red font-tech-mono 
                     rounded transition-all duration-300 hover:bg-neon-red hover:text-black
                     focus:outline-none focus:ring-2 focus:ring-neon-red focus:ring-opacity-50
                     animate-pulse block text-center"
          >
            LAUNCH SYSTEM
          </a>
        )}

        <div className="mt-8 grid grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-full aspect-square bg-black border border-neon-red/30 rounded-sm overflow-hidden"
            >
              <div 
                className="w-full h-full bg-neon-red/50"
                style={{
                  animation: `glitch ${Math.random() * 2 + 1}s infinite ${Math.random() * 1}s`,
                  opacity: Math.random() * 0.5
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 