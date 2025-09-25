'use client';

import React, { useEffect, useRef } from 'react';

// Medium 3D ASCII Apple Tree - Center variation
const AsciiAppleTreeMedium: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = 25; // Increased size
        const height = 15;  // Increased size
        let grid: string[][] = [];
        let depthGrid: number[][] = [];
        let time = 0;
        let animationFrameId: number;
        
        const GROWTH_STAGES = {
            SEED: 0,
            SPROUT: 120,
            SAPLING: 320,
            YOUNG: 650,
            MATURE: 1100,
            FULL: 1600
        };

        const DEPTH_CHARS = {
            CLOSEST: ['█', '▓', '▒', '░'],
            NEAR: ['#', '@', '*', '%'],
            MEDIUM: ['+', '=', '-', '~'],
            FAR: ['.', ':', "'", '`'],
            TRUNK: ['║', '│', '|'],
            BRANCHES: ['╔', '╗', '╚', '╝', '═', '─', '/', '\\'],
            APPLES: ['●', '◉', '○', '◯'],
            GROUND: ['═', '─', '_', '~']
        };

        function initGrids() {
            grid = [];
            depthGrid = [];
            for (let y = 0; y < height; y++) {
                const row = [];
                const depthRow = [];
                for (let x = 0; x < width; x++) {
                    row.push(' ');
                    depthRow.push(0);
                }
                grid.push(row);
                depthGrid.push(depthRow);
            }
        }

        function getDepthChar(depth: number, type: 'foliage' | 'trunk' | 'branch' | 'apple' | 'ground'): string {
            const normalizedDepth = Math.max(0, Math.min(1, depth));
            
            switch (type) {
                case 'foliage':
                    if (normalizedDepth > 0.8) return DEPTH_CHARS.CLOSEST[Math.floor(normalizedDepth * 4) % 4];
                    if (normalizedDepth > 0.6) return DEPTH_CHARS.NEAR[Math.floor(normalizedDepth * 4) % 4];
                    if (normalizedDepth > 0.3) return DEPTH_CHARS.MEDIUM[Math.floor(normalizedDepth * 4) % 4];
                    return DEPTH_CHARS.FAR[Math.floor(normalizedDepth * 4) % 4];
                case 'trunk':
                    return DEPTH_CHARS.TRUNK[Math.floor(normalizedDepth * 3) % 3];
                case 'branch':
                    return DEPTH_CHARS.BRANCHES[Math.floor(normalizedDepth * 8) % 8];
                case 'apple':
                    return DEPTH_CHARS.APPLES[Math.floor(normalizedDepth * 4) % 4];
                case 'ground':
                    return DEPTH_CHARS.GROUND[Math.floor(normalizedDepth * 4) % 4];
                default:
                    return ' ';
            }
        }

        function drawTrunk(centerX: number, baseY: number, trunkHeight: number, growth: number) {
            const actualHeight = Math.floor(trunkHeight * growth);
            
            for (let i = 0; i < actualHeight; i++) {
                const y = baseY - i;
                if (y >= 0 && y < height) {
                    if (centerX >= 0 && centerX < width) {
                        const depth = 0.85 + Math.sin(i * 0.25) * 0.1;
                        grid[y][centerX] = getDepthChar(depth, 'trunk');
                        depthGrid[y][centerX] = depth;
                    }
                    
                    // Wider trunk for medium tree
                    if (i < actualHeight * 0.4) {
                        if (centerX - 1 >= 0) {
                            grid[y][centerX - 1] = getDepthChar(0.65, 'trunk');
                            depthGrid[y][centerX - 1] = 0.65;
                        }
                        if (centerX + 1 < width) {
                            grid[y][centerX + 1] = getDepthChar(0.65, 'trunk');
                            depthGrid[y][centerX + 1] = 0.65;
                        }
                    }
                }
            }
        }

        function drawBranch(startX: number, startY: number, length: number, angle: number, depth: number, growth: number, rotationAngle: number = 0) {
            const actualLength = Math.floor(length * growth);
            
            for (let i = 0; i <= actualLength; i++) {
                const progress = i / length;
                const rotatedAngle = angle + rotationAngle;
                const x = Math.floor(startX + Math.cos(rotatedAngle) * i);
                const y = Math.floor(startY + Math.sin(rotatedAngle) * i);
                
                if (x >= 0 && x < width && y >= 0 && y < height) {
                    const branchDepth = depth * (1 - progress * 0.25);
                    grid[y][x] = getDepthChar(branchDepth, 'branch');
                    depthGrid[y][x] = branchDepth;
                }
            }
        }

        function drawFoliage(centerX: number, centerY: number, radius: number, density: number, growth: number, rotationAngle: number = 0) {
            const actualRadius = radius * growth;
            
            for (let dy = -actualRadius; dy <= actualRadius; dy++) {
                for (let dx = -actualRadius; dx <= actualRadius; dx++) {
                    // Apply rotation to foliage position
                    const rotatedDx = dx * Math.cos(rotationAngle) - dy * Math.sin(rotationAngle);
                    const rotatedDy = dx * Math.sin(rotationAngle) + dy * Math.cos(rotationAngle);
                    
                    const x = Math.floor(centerX + rotatedDx);
                    const y = Math.floor(centerY + rotatedDy);
                    
                    if (x >= 0 && x < width && y >= 0 && y < height) {
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance <= actualRadius) {
                            const noise = Math.sin(x * 0.45 + time * 0.009) * Math.cos(y * 0.28 + time * 0.013);
                            const foliageDensity = (1 - distance / actualRadius) * density + noise * 0.18;
                            
                            if (foliageDensity > 0.28) {
                                const baseDepth = 0.45 + (1 - distance / actualRadius) * 0.45;
                                const layerDepth = baseDepth + Math.sin(dx * 0.7) * Math.cos(dy * 0.5) * 0.18;
                                
                                grid[y][x] = getDepthChar(layerDepth, 'foliage');
                                depthGrid[y][x] = layerDepth;
                            }
                        }
                    }
                }
            }
        }

        function drawApples(centerX: number, centerY: number, radius: number, growth: number, rotationAngle: number = 0) {
            if (growth < 0.78) return;
            
            const applePositions = [
                { dx: -7, dy: -2, depth: 0.85 },
                { dx: 5, dy: -4, depth: 0.65 },
                { dx: -2, dy: 1, depth: 0.75 },
                { dx: 8, dy: -1, depth: 0.55 }
            ];
            
            applePositions.forEach(apple => {
                // Apply rotation to apple position
                const rotatedDx = apple.dx * Math.cos(rotationAngle) - apple.dy * Math.sin(rotationAngle);
                const rotatedDy = apple.dx * Math.sin(rotationAngle) + apple.dy * Math.cos(rotationAngle);
                
                const x = centerX + Math.floor(rotatedDx);
                const y = centerY + Math.floor(rotatedDy);
                
                if (x >= 0 && x < width && y >= 0 && y < height) {
                    const appleGrowth = Math.max(0, (growth - 0.78) * 4.5);
                    if (appleGrowth > 0.25) {
                        grid[y][x] = getDepthChar(apple.depth, 'apple');
                        depthGrid[y][x] = apple.depth;
                    }
                }
            });
        }

        function drawGround(baseY: number) {
            for (let x = 0; x < width; x++) {
                if (baseY >= 0 && baseY < height) {
                    const depth = 0.28 + Math.sin(x * 0.18) * 0.09;
                    grid[baseY][x] = getDepthChar(depth, 'ground');
                    depthGrid[baseY][x] = depth;
                }
            }
        }

        function update() {
            initGrids();
            
            const centerX = Math.floor(width / 2);
            const baseY = height - 2;
            const growth = Math.min(1, time / GROWTH_STAGES.FULL);
            
            // Calculate rotation angle if tree is fully grown
            const isFullyGrown = time > GROWTH_STAGES.FULL;
            const rotationAngle = isFullyGrown ? (time - GROWTH_STAGES.FULL) * 0.01 : 0;
            
            drawGround(baseY);
            
            if (time > GROWTH_STAGES.SEED) {
                const trunkGrowth = Math.max(0, Math.min(1, (time - GROWTH_STAGES.SPROUT) / 350));
                drawTrunk(centerX, baseY, 24, trunkGrowth); // Taller trunk for higher resolution
            }
            
            if (time > GROWTH_STAGES.SAPLING) {
                const branchGrowth = Math.max(0, Math.min(1, (time - GROWTH_STAGES.SAPLING) / 280));
                
                // Main branches
                drawBranch(centerX, baseY - 14, 24, -Math.PI/4, 0.75, branchGrowth, rotationAngle);
                drawBranch(centerX, baseY - 14, 20, Math.PI/4, 0.65, branchGrowth, rotationAngle);
                drawBranch(centerX, baseY - 10, 18, -Math.PI/3, 0.55, branchGrowth, rotationAngle);
                drawBranch(centerX, baseY - 10, 15, Math.PI/3, 0.45, branchGrowth, rotationAngle);
                
                // Additional smaller branches for more detail
                drawBranch(centerX, baseY - 18, 16, -Math.PI/6, 0.6, branchGrowth, rotationAngle);
                drawBranch(centerX, baseY - 18, 14, Math.PI/6, 0.5, branchGrowth, rotationAngle);
                drawBranch(centerX, baseY - 12, 12, -Math.PI/2.5, 0.4, branchGrowth, rotationAngle);
                drawBranch(centerX, baseY - 12, 10, Math.PI/2.5, 0.35, branchGrowth, rotationAngle);
                drawBranch(centerX, baseY - 8, 8, -Math.PI/1.8, 0.3, branchGrowth, rotationAngle);
                drawBranch(centerX, baseY - 8, 6, Math.PI/1.8, 0.25, branchGrowth, rotationAngle);
            }
            
            if (time > GROWTH_STAGES.YOUNG) {
                const foliageGrowth = Math.max(0, Math.min(1, (time - GROWTH_STAGES.YOUNG) / 350));
                
                drawFoliage(centerX - 12, baseY - 20, 10, 0.75, foliageGrowth, rotationAngle); // Larger foliage clusters
                drawFoliage(centerX + 8, baseY - 18, 9, 0.65, foliageGrowth, rotationAngle);
                drawFoliage(centerX - 3, baseY - 25, 12, 0.85, foliageGrowth, rotationAngle);
                drawFoliage(centerX + 14, baseY - 15, 8, 0.55, foliageGrowth, rotationAngle);
            }
            
            if (time > GROWTH_STAGES.MATURE) {
                drawApples(centerX, baseY - 11, 8, growth, rotationAngle);
            }
            
            time += 1;
            
            if (time > GROWTH_STAGES.FULL + 450) {
                time = 0;
            }
        }

        function render() {
            let html = '';
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    html += grid[y][x];
                }
                html += '<br>';
            }
            if (canvas) {
                canvas.innerHTML = html;
            }
        }

        function animate() {
            update();
            render();
            animationFrameId = requestAnimationFrame(animate);
        }

        initGrids();
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (canvas) {
                canvas.innerHTML = '';
            }
        };
    }, []);

    return (
        <div style={{ 
            margin: 0,
            background: 'transparent',
            overflow: 'hidden',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            height: '100%',
            position: 'relative',
            width: '100%',
            zIndex: 5,
            pointerEvents: 'none',
            border: 'none',
            boxShadow: 'none'
        }}>
            <div style={{
                padding: '0',
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'stretch',
                background: 'transparent',
                border: 'none'
            }}>
                <div 
                    ref={canvasRef}
                    style={{
                        lineHeight: '0.5', // Even tighter line spacing
                        letterSpacing: '0.02em',
                        color: 'rgba(255, 140, 0, 1)', // Orange color
                        userSelect: 'none',
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        fontSize: '12px', // Increased font size
                        textAlign: 'center',
                        padding: '4px',
                        textShadow: '0 0 6px rgba(255, 140, 0, 0.4), 0 0 12px rgba(255, 140, 0, 0.2)' // Orange glow
                    }}
                />
            </div>
        </div>
    );
};

export default AsciiAppleTreeMedium;
