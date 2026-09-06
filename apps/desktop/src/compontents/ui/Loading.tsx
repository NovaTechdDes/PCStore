import React from 'react';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  text = 'Cargando...',
  fullScreen = false,
  size,
  showText = true,
}) => {
  const currentSize = size || (showText ? 'md' : 'xs');

  const sizeClasses = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-5 h-5 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const containerContent = (
    <div className={`inline-flex items-center justify-center ${showText ? 'flex-col p-6 space-y-4' : ''}`}>
      {/* Animated Spinner with Gradient/Glow effect */}
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div
          className={`${sizeClasses[currentSize]} rounded-full border-blue-500/20 border-t-blue-600 animate-spin`}
        />
        {/* Inner subtle pulsating core */}
        <div className="absolute w-1/2 h-1/2 rounded-full bg-blue-500/30 animate-ping" />
      </div>

      {/* Loading Text */}
      {showText && text && (
        <p className="text-sm font-medium tracking-wide text-gray-600 dark:text-gray-300 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-gray-100 dark:border-slate-700/50">
          {containerContent}
        </div>
      </div>
    );
  }

  return containerContent;
};

export default Loading;