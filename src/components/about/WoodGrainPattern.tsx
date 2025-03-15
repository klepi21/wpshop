'use client';

import { useEffect, useRef } from 'react';

export function WoodGrainPattern() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Colors for wood grain
    const colors = [
      'rgba(166, 124, 82, 0.2)',
      'rgba(166, 124, 82, 0.15)',
      'rgba(166, 124, 82, 0.1)',
      'rgba(166, 124, 82, 0.05)'
    ];

    // Draw wood grain pattern
    const drawWoodGrain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw curved lines to simulate wood grain
      for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.lineWidth = 1 + Math.random() * 2;

        // Start point
        const startX = Math.random() * canvas.width;
        const startY = 0;
        ctx.moveTo(startX, startY);

        // Control points for curved lines
        const cp1x = startX + (Math.random() * 100 - 50);
        const cp1y = canvas.height / 3;
        const cp2x = startX + (Math.random() * 100 - 50);
        const cp2y = (canvas.height / 3) * 2;
        const endX = startX + (Math.random() * 100 - 50);
        const endY = canvas.height;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        ctx.stroke();
      }
    };

    // Initial draw
    drawWoodGrain();

    // Redraw on resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawWoodGrain();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full -z-10 opacity-30"
    />
  );
} 