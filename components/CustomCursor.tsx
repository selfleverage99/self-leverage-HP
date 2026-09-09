'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);
  const ringXSpring = useSpring(ringX, { damping: 25, stiffness: 300, mass: 0.4 });
  const ringYSpring = useSpring(ringY, { damping: 25, stiffness: 300, mass: 0.4 });

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) {
      document.body.classList.add('touch-device');
      return;
    }

    const handleMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMove);

    const interactive = document.querySelectorAll('a,button,input,textarea,.service-card');
    const ring = document.querySelector<HTMLDivElement>('.cursor-ring');
    const onEnter = () => {
      if (!ring) return;
      ring.style.width = '54px';
      ring.style.height = '54px';
      ring.style.backgroundColor = 'rgba(255,255,255,0.07)';
      ring.style.borderColor = 'rgba(255,255,255,0.75)';
    };
    const onLeave = () => {
      if (!ring) return;
      ring.style.width = '34px';
      ring.style.height = '34px';
      ring.style.backgroundColor = 'transparent';
      ring.style.borderColor = 'rgba(255,255,255,0.4)';
    };
    interactive.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      interactive.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, [dotX, dotY, ringX, ringY]);

  return (
    <>
      <motion.div className="cursor-dot" style={{ left: dotX, top: dotY }} />
      <motion.div className="cursor-ring" style={{ left: ringXSpring, top: ringYSpring }} />
    </>
  );
}
