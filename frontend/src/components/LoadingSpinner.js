import React from 'react';
import { Loader2, Globe } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
        <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-radial from-neon-blue/10 via-transparent to-transparent"></div>
      </div>

      {/* Floating Particles */}
      <div className="particles">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Loading Content */}
      <div className="relative z-10 text-center">
        <div className="relative">
          {/* Outer Ring */}
          <div className={`${sizeClasses[size]} border-2 border-neon-blue/30 rounded-full animate-spin`}></div>
          
          {/* Inner Ring */}
          <div className={`${sizeClasses[size]} border-2 border-neon-purple/50 rounded-full animate-spin absolute inset-0`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          
          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe className={`${size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-8 w-8'} text-neon-blue animate-pulse`} />
          </div>
        </div>
        
        {text && (
          <div className="mt-6">
            <p className="text-neon-blue font-mono font-semibold tracking-wider animate-pulse">
              {text}
            </p>
            <div className="mt-2 flex justify-center space-x-1">
              <div className="w-1 h-1 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1 h-1 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner; 