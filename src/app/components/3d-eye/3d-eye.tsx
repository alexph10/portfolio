'use client';

import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';
import { 
  EffectComposer, 
  Bloom, 
  Pixelation,
  HueSaturation,
  ToneMapping
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

function Eye() {
  const eyeRef = useRef<Group>(null);
  const { scene } = useGLTF('/3D/eye.glb', true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Corrected mouse position calculations
      setMousePosition({
        x: -(event.clientX / window.innerWidth) * 2 - 1,  // Removed negative sign
        y: -(event.clientY / window.innerHeight) * 2 - 1  // Added back negative sign
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (eyeRef.current) {
      // Corrected rotation calculations
      const targetRotationY = mousePosition.x * 0.2;
      const targetRotationX = mousePosition.y * 0.2;
      
      eyeRef.current.rotation.y += (targetRotationY - eyeRef.current.rotation.y) * 0.1;
      eyeRef.current.rotation.x += (targetRotationX - eyeRef.current.rotation.x) * 0.1;
    }
  });

  return (
    <primitive
      ref={eyeRef}
      object={scene}
      scale={1.75}
      position={[0, 0, 0]}
    />
  );
}

export default function EyeScene() {
  return (
    <div className="absolute right-16 bottom-16 w-32 h-32">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.7} color="#ff4040" />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff0000" />
        <Suspense fallback={null}>
          <Eye />
        </Suspense>
        
        <EffectComposer>
          <Bloom 
            intensity={3.0}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.9}
            blendFunction={BlendFunction.SCREEN}
            mipmapBlur
          />
          <HueSaturation
            saturation={0.67} // Increase saturation
            hue={0.03} // Slight shift towards red
          />
          <ToneMapping
            adaptive
            resolution={256}
            middleGrey={0.6}
            maxLuminance={16.0}
          />
          <Pixelation
            granularity={6}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}