'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';

const OFFSETS = {
  up: { y: 40, x: 0 },
  left: { y: 0, x: -40 },
  right: { y: 0, x: 40 },
} as const;

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  as?: ElementType;
  direction?: keyof typeof OFFSETS;
  delay?: number;
  duration?: number;
  children?: ReactNode;
  [key: string]: unknown;
}

export default function Reveal({
  as = 'div',
  direction = 'up',
  delay = 0,
  duration = 0.7,
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const offset = OFFSETS[direction];
  const Component = motion[as as keyof typeof motion] as typeof motion.div;

  const initial = prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: offset.x, y: offset.y };
  const animate = { opacity: 1, x: 0, y: 0 };

  return (
    <Component
      className={className}
      style={style}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: prefersReducedMotion ? 0.3 : duration, delay, ease: 'easeOut' }}
      {...rest}
    >
      {children}
    </Component>
  );
}
