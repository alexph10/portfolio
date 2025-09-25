'use client';

import React, { useEffect, useRef } from 'react';

const AsciiDonut: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let A = 0; // Rotation around X axis
    let B = 0; // Rotation around Z axis
    let animationFrameId: number;

    const render = () => {
      const width = 120;
      const height = 150;
      
      // Create output buffer and z-buffer
      const output: string[] = new Array(width * height).fill(' ');
      const zbuffer: number[] = new Array(width * height).fill(0);

      // Donut parameters
      const R1 = 1;    // Minor radius (tube radius)
      const R2 = 2;    // Major radius (distance from center to tube center)
      const K2 = 5;    // Distance from viewer
      const K1 = width * K2 * 3 / (8 * (R1 + R2)); // Screen scaling

      // Generate donut with higher density
      for (let theta = 0; theta < 6.28; theta += 0.04) { // Angle around tube (smaller step = more density)
        for (let phi = 0; phi < 6.28; phi += 0.01) {   // Angle around donut (smaller step = more density)
          // 3D coordinates before rotation
          const costheta = Math.cos(theta);
          const sintheta = Math.sin(theta);
          const cosphi = Math.cos(phi);
          const sinphi = Math.sin(phi);

          // 3D coordinates of point on torus
          const circlex = R2 + R1 * costheta;
          const circley = R1 * sintheta;

          // Rotate around Y and X axes
          const x = circlex * (Math.cos(B) * cosphi + Math.sin(A) * Math.sin(B) * sinphi) - circley * Math.cos(A) * Math.sin(B);
          const y = circlex * (Math.sin(B) * cosphi - Math.sin(A) * Math.cos(B) * sinphi) + circley * Math.cos(A) * Math.cos(B);
          const z = K2 + Math.cos(A) * circlex * sinphi + circley * Math.sin(A);
          const ooz = 1 / z; // One over Z (for perspective)

          // Project to 2D screen coordinates
          const xp = Math.floor(width / 2 + K1 * ooz * x);
          const yp = Math.floor(height / 2 - K1 * ooz * y);

          // Calculate luminance (lighting)
          const L = cosphi * costheta * Math.sin(B) - Math.cos(A) * costheta * sinphi - Math.sin(A) * sintheta + Math.cos(B) * (Math.cos(A) * sintheta - costheta * Math.sin(A) * sinphi);

          if (L > 0 && xp >= 0 && xp < width && yp >= 0 && yp < height) {
            const idx = xp + yp * width;
            if (ooz > zbuffer[idx]) {
              zbuffer[idx] = ooz;
              // Choose character based on luminance - using letters and numbers
              const luminance_index = Math.floor(L * 8);
              const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
              output[idx] = chars[Math.min(luminance_index, chars.length - 1)];
            }
          }
        }
      }

      // Convert output buffer to string with line breaks
      let result = '';
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          result += output[j + i * width];
        }
        result += '\n';
      }

      canvas.textContent = result;

      // Update rotation angles (extremely slow)
      A += 0.003;
      B += 0.001;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div 
      className="absolute inset-0 flex items-center z-20"
      style={{
        pointerEvents: 'none',
        justifyContent: 'flex-end',
        paddingRight: '11%' // Position it on the right side with some spacing
      }}
    >
      <div
        ref={canvasRef}
        style={{
          fontFamily: 'monospace',
          fontSize: '7.25px',
          lineHeight: '0.54',
          background: 'linear-gradient(45deg, #FF4500, #FFA000)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 3px rgba(255, 140, 0, 0.6)', // Adjusted shadow color
          whiteSpace: 'pre',
          textAlign: 'center',
          letterSpacing: '0.05em',
          maxHeight: '90vh',
          overflow: 'visible'
        }}
      />
    </div>
  );
};

export default AsciiDonut;
