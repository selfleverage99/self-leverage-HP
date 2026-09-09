'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';

export default function Hero() {
  const { dict } = useLang();
  const prefersReducedMotion = useReducedMotion();

  const tagVariant: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.2, ease: 'easeOut' } },
  };
  const titleVariant: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 70 },
    show: { opacity: 1, y: 0, transition: { duration: 1.3, delay: 0.4, ease: [0.17, 0.55, 0.55, 1] } },
  };
  const subVariant: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    show: { opacity: 1, y: 0, transition: { duration: 1, delay: 1.1, ease: 'easeOut' } },
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden px-[6vw] py-0">
      <div className="relative z-10 max-w-[1100px]">
        <motion.p
          className="font-tech uppercase mb-9"
          style={{ fontSize: 'clamp(.58rem,1.1vw,.72rem)', letterSpacing: '.48em', color: 'rgba(255,255,255,0.9)' }}
          initial="hidden"
          animate="show"
          variants={tagVariant}
        >
          {dict.hero.tag}
        </motion.p>
        <motion.h1
          className="font-tech font-black uppercase text-white"
          style={{ lineHeight: '.88', letterSpacing: '-0.025em', fontSize: 'clamp(2.4rem,9.5vw,8.5rem)' }}
          initial="hidden"
          animate="show"
          variants={titleVariant}
        >
          SELF LEVERAGE
        </motion.h1>
        <motion.p
          className="mt-11 font-light"
          style={{
            fontFamily: 'var(--font-inter), var(--font-noto-sans-jp), sans-serif',
            fontSize: 'clamp(.88rem,1.75vw,1.05rem)',
            color: 'rgba(255,255,255,0.78)',
            lineHeight: '1.85',
            letterSpacing: '.02em',
            maxWidth: '500px',
            whiteSpace: 'pre-line',
          }}
          initial="hidden"
          animate="show"
          variants={subVariant}
        >
          {dict.hero.sub}
        </motion.p>
      </div>

      <div className="scroll-hint">
        <span>Scroll</span>
        <div className="line" />
      </div>
    </section>
  );
}
