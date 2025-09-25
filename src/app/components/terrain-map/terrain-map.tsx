'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TerrainCell {
    char: string;
    color: string;
}

const TerrainMap: React.FC = () => {
    const [map, setMap] = useState<TerrainCell[][]>([]);
    const frameRef = useRef<number | undefined>(undefined);
    const width = 120;
    const height = 35;
    
    const terrainLevels = React.useMemo(() => [
        { char: '▲', color: '#FF4500', threshold: 0.8 },
        { char: '◆', color: '#FF6B33', threshold: 0.6 },
        { char: '♦', color: '#FF5722', threshold: 0.4 },
        { char: '~', color: '#FF7043', threshold: 0.2 },
        { char: '·', color: '#FF8A65', threshold: 0.0 },
        { char: ' ', color: '#282828', threshold: -1 }
    ], []);

    const generateNoise = React.useCallback((x: number, y: number, time: number) => {
        const scale = 0.05;
        const timeScale = 0.001;
        
        // Multiple layers of noise
        const noise1 = Math.sin(x * scale + time * timeScale) * Math.cos(y * scale + time * timeScale);
        const noise2 = Math.sin((x + y) * scale * 0.5 + time * timeScale * 1.5) * 0.5;
        const noise3 = Math.cos(y * scale * 0.3 - time * timeScale * 0.7) * 0.3;
        
        // Combine noise layers with different weights
        return (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2 + 1) / 2;
    }, []);

    const generateTerrain = React.useCallback(() => {
        const newMap: TerrainCell[][] = [];
        const time = Date.now();
        
        for (let y = 0; y < height; y++) {
            const row: TerrainCell[] = [];
            for (let x = 0; x < width; x++) {
                const noiseValue = generateNoise(x, y, time);
                
                // Find appropriate terrain level based on noise value
                const terrain = terrainLevels.find(level => noiseValue >= level.threshold);
                
                // Add some randomization to characters
                const randomChar = Math.random() > 0.85 ? 
                    terrainLevels[Math.floor(Math.random() * 3)].char : 
                    terrain!.char;
                
                row.push({
                    char: randomChar,
                    color: terrain!.color
                });
            }
            newMap.push(row);
        }
        return newMap;
    }, [height, width, terrainLevels, generateNoise]);

    useEffect(() => {
        const animate = () => {
            setMap(generateTerrain());
            frameRef.current = requestAnimationFrame(animate);
        };
        frameRef.current = requestAnimationFrame(animate);
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [generateTerrain]);

    return (
        <div className="w-full h-full overflow-hidden font-mono">
            <pre style={{ fontSize: '0.65rem', lineHeight: '0.7' }}>
                {map.map((row, i) => (
                    <div key={i}>
                        {row.map((cell, j) => (
                            <span key={`${i}-${j}`} style={{ color: cell.color }}>
                                {cell.char}
                            </span>
                        ))}
                    </div>
                ))}
            </pre>
        </div>
    );
};

export default TerrainMap;