'use client';

import React from 'react';
import AsciiAppleTreeMedium from '../../ascii-apple-tree-medium';

const BottomPanel: React.FC = () => {

  return (
    <>
      <div 
        className="absolute bottom-10 left-10 z-30 flex gap-8 items-center"
        style={{
          fontFamily: 'Mondwest, sans-serif',
          fontSize: '14px',
          fontWeight: '400'
        }}
      >
        <div style={{ transform: 'scale(0.5)', transformOrigin: 'bottom left' }}>
          <AsciiAppleTreeMedium />
        </div>
        <div 
          className="text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
          style={{
            textShadow: '0 0 2px rgba(255, 100, 0, 0.3)'
          }}
        >
          GitHub
        </div>
        
        <div 
          className="text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
          style={{
            textShadow: '0 0 2px rgba(255, 100, 0, 0.3)'
          }}
        >
          Twitter
        </div>
      </div>
    </>
  );
};

export default BottomPanel;
