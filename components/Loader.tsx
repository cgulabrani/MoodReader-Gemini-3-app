
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-10 animate-in fade-in duration-700">
      <div className="relative flex items-center justify-center">
        {/* Breathing Heart Icon - Now Muted */}
        <div className="relative z-10">
          <svg 
            viewBox="0 0 24 24" 
            className="w-16 h-16 text-gray-200 fill-current animate-[pulse_2.5s_cubic-bezier(0.4,0,0.6,1)_infinite]" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        
        {/* Whimsical outer rings */}
        <div className="absolute inset-[-0.5rem] rounded-full border border-gray-100 animate-[ping_3s_linear_infinite] opacity-30"></div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight serif">Consulting the archives</h3>
        <p className="text-gray-400 font-light italic max-w-xs mx-auto text-xs leading-relaxed">
          Tracing the ink to find a story that speaks back to you...
        </p>
      </div>
    </div>
  );
};

export default Loader;
