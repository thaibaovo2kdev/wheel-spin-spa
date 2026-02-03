'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];

    const createFirework = (x: number, y: number) => {
      const colors = ['#FCD34D', '#DC2626', '#D97706', '#F59E0B', '#FFFFFF'];
      for (let i = 0; i < 50; i++) {
        const angle = (Math.random() * Math.PI) / 2; // quarter circle base
        let velocityAngle;
        
        // If spawning from left, shoot right-ish
        if (x < canvas.width / 2) {
           velocityAngle = -Math.PI / 4 - (Math.random() * Math.PI / 4); // Shoot up and right
        } else {
           velocityAngle = -Math.PI / 2 - (Math.random() * Math.PI / 4); // Shoot up and left
        }

        // Override angle logic to just explode from point is fine, 
        // but user asked for "shoot from 2 sides". 
        // Let's make them shoot UP and INWARDS.
        
        const speed = 10 + Math.random() * 12; // Higher speed to reach center
        
        // Random spread around the "up-inward" direction
        const spread = (Math.random() - 0.5) * 1; 
        
        let vx, vy;
        if (x < canvas.width / 2) {
             // Left side: shoot right-up
             vx = (Math.random() * 5) + 5; 
             vy = -(Math.random() * 10) - 10;
        } else {
             // Right side: shoot left-up
             vx = -(Math.random() * 5) - 5;
             vy = -(Math.random() * 10) - 10;
        }

        particles.push({
          x,
          y,
          vx: vx * Math.random(),
          vy: vy * Math.random(),
          life: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    // Create multiple fireworks at random positions
    // Create fireworks from both sides
    const createSideFireworks = () => {
      const launch = () => {
        // Left side
        createFirework(0, canvas.height);
        // Right side
        createFirework(canvas.width, canvas.height);
      };

      // Launch multiple volleys
      for (let i = 0; i < 8; i++) {
        setTimeout(launch, i * 300);
      }
    };

    createSideFireworks();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles = particles
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.15,
          life: p.life - 0.015,
        }))
        .filter((p) => p.life > 0);

      particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (particles.length > 0) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={typeof window !== 'undefined' ? window.innerWidth : 800}
      height={typeof window !== 'undefined' ? window.innerHeight : 600}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}
