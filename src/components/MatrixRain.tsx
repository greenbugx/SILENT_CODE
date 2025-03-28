import { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = container.clientWidth;
    let height = canvas.height = container.clientHeight;

    const fontSize = 14;
    const cols = Math.floor(width / fontSize);
    const drops: number[] = [];
    for (let i = 0; i < cols; i++) {
      drops[i] = Math.floor(Math.random() * height);
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, width, height);

    function matrix() {
      const context = ctx as CanvasRenderingContext2D;
      context.fillStyle = 'rgba(0, 0, 0, 0.3)';
      context.fillRect(0, 0, width, height);
      context.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = Math.random() > 0.5 ? '1' : '0';
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head of the drop
        context.fillStyle = '#0f0'; // Bright green for the head
        context.fillText(text, x, y);

        // Trail effect
        context.fillStyle = '#0f0';
        for (let j = 1; j < 5; j++) {
          const trailY = y - (j * fontSize);
          if (trailY > 0) {
            context.fillStyle = `rgba(0, 255, 0, ${1 - (j * 0.2)})`;
            context.fillText(Math.random() > 0.5 ? '1' : '0', x, trailY);
          }
        }

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(matrix, 50);

    const handleResize = () => {
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-100"
      />
    </div>
  );
} 