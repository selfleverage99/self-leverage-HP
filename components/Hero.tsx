'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import HeroSphere from './HeroSphere';

const LABELS = [
  'System', 'AI', 'Subsidy', 'Power', 'Sales', 'Global', 'Japan', 'Vietnam', 'Data', 'Cloud',
  'API', 'Plan', 'Contract', 'Grant', 'Lead', 'Web', 'App', 'Agent', 'Energy', 'Tariff',
  'DX', 'Call', 'Deal', 'Growth', 'Match', 'Leverage', 'Code', 'Report', 'Apply', 'Retail',
];
const SHAPES = ['rect', 'pill', 'circle'] as const;
const TONES = ['dark', 'dark', 'gray', 'light', 'glow'] as const;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Chip {
  id: number;
  label: string;
  shape: (typeof SHAPES)[number];
  tone: (typeof TONES)[number];
  left: number;
  top: number;
  dx: number;
  dy: number;
  duration: number;
  delay: number;
}

const CIRCLE_LABELS = ['AI', 'DX', 'IN', 'OUT', 'OK', 'API'];

function inCopyZone(left: number, top: number) {
  return left > 12 && left < 88 && top > 26 && top < 78;
}

function buildChips(): Chip[] {
  const rand = mulberry32(20260108);
  const chips: Chip[] = [];
  let guard = 0;
  while (chips.length < 46 && guard < 600) {
    guard++;
    const left = 2 + rand() * 96;
    const top = 6 + rand() * 90;
    if (inCopyZone(left, top)) continue;
    if (chips.some((c) => Math.abs(c.left - left) < 7 && Math.abs(c.top - top) < 8)) continue;
    chips.push({
      id: chips.length,
      label: LABELS[Math.floor(rand() * LABELS.length)],
      shape: SHAPES[Math.floor(rand() * SHAPES.length)],
      tone: TONES[Math.floor(rand() * TONES.length)],
      left,
      top,
      dx: (rand() - 0.5) * 34,
      dy: (rand() - 0.5) * 34,
      duration: 7 + rand() * 7,
      delay: rand() * 2.4,
    });
  }
  return chips;
}

function buildTraces(chips: Chip[]): string[] {
  const paths: string[] = [];
  const seen = new Set<string>();
  chips.forEach((a) => {
    const b = chips
      .filter((c) => c.id !== a.id)
      .sort((p, q) => Math.hypot(p.left - a.left, p.top - a.top) - Math.hypot(q.left - a.left, q.top - a.top))[0];
    if (!b) return;
    const key = a.id < b.id ? `${a.id}-${b.id}` : `${b.id}-${a.id}`;
    if (seen.has(key)) return;
    seen.add(key);
    const minX = Math.min(a.left, b.left);
    const maxX = Math.max(a.left, b.left);
    const minY = Math.min(a.top, b.top);
    const maxY = Math.max(a.top, b.top);
    if (minX < 88 && maxX > 12 && minY < 78 && maxY > 26) return;
    const ax = a.left * 16;
    const ay = a.top * 10;
    const bx = b.left * 16;
    const by = b.top * 10;
    const mx = (ax + bx) / 2;
    paths.push(`M${ax.toFixed(0)} ${ay.toFixed(0)} H${mx.toFixed(0)} V${by.toFixed(0)} H${bx.toFixed(0)}`);
  });
  return paths;
}

const CHIPS = buildChips();
const TRACES = buildTraces(CHIPS);

export default function Hero() {
  const { dict } = useLang();
  const prefersReducedMotion = useReducedMotion();

  const wordVariant: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 1.6, delay: 0.5, ease: 'easeOut' } },
  };
  const lineVariant: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: 1.1, delay: 1.2, ease: 'easeOut' } },
  };
  const metaVariant: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 1.2, delay: 1.7, ease: 'easeOut' } },
  };

  return (
    <section id="hero" className="hero-light">
      <svg className="hero-traces" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {TRACES.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>

      <HeroSphere />

      <div className="hero-chips" aria-hidden="true">
        {CHIPS.map((c) => (
          <span
            key={c.id}
            className={`hero-chip hero-chip-${c.shape} hero-chip-${c.tone}`}
            style={
              {
                left: `${c.left}%`,
                top: `${c.top}%`,
                '--dx': `${c.dx}px`,
                '--dy': `${c.dy}px`,
                '--dur': `${c.duration}s`,
                '--delay': `${c.delay}s`,
              } as React.CSSProperties
            }
          >
            {c.shape === 'circle' ? CIRCLE_LABELS[c.id % CIRCLE_LABELS.length] : c.label}
          </span>
        ))}
      </div>

      <div className="hero-copy">
        <motion.div className="hero-tag" initial="hidden" animate="show" variants={metaVariant}>
          {dict.hero.tag}
        </motion.div>
        <motion.div className="hero-word" initial="hidden" animate="show" variants={wordVariant}>
          SELF LEVERAGE
        </motion.div>
        <motion.h1 className="hero-line" initial="hidden" animate="show" variants={lineVariant}>
          {dict.hero.sub}
        </motion.h1>
        <motion.div className="hero-meta" initial="hidden" animate="show" variants={metaVariant}>
          {dict.hero.meta}
        </motion.div>
      </div>

      <div className="scroll-hint">
        <span>Scroll</span>
        <div className="line" />
      </div>
    </section>
  );
}
