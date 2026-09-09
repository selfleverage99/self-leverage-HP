'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  decay: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;

    function resize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function spawnBurst(x: number, y: number) {
      const count = 90;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 14 + 2;
        particles.push({
          x,
          y,
          size: Math.random() * 2.5 + 0.5,
          speedX: Math.cos(angle) * velocity,
          speedY: Math.sin(angle) * velocity,
          life: 1,
          decay: Math.random() * 0.02 + 0.012,
        });
      }
    }

    function onClick(e: MouseEvent) {
      spawnBurst(e.clientX, e.clientY);
    }
    function onTouch(e: TouchEvent) {
      const touch = e.touches[0];
      if (touch) spawnBurst(touch.clientX, touch.clientY);
    }
    window.addEventListener('click', onClick);
    window.addEventListener('touchstart', onTouch, { passive: true });

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      particles = particles.filter((p) => p.life > 0);
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedX *= 0.92;
        p.speedY *= 0.92;
        p.life -= p.decay;

        ctx.fillStyle = `rgba(255,255,255,${p.life})`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(255,255,255,${p.life * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', onClick);
      window.removeEventListener('touchstart', onTouch);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="bg-canvas"
      className="fixed top-0 left-0 w-full h-screen pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
