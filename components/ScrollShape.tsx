'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

const RINGS = [
  { rotateX: 90, rotateY: 0, rotateZ: 0, opacity: 0.22 },
  { rotateX: 0, rotateY: 55, rotateZ: 0, opacity: 0.18 },
  { rotateX: 0, rotateY: -55, rotateZ: 0, opacity: 0.18 },
  { rotateX: 60, rotateY: 30, rotateZ: 0, opacity: 0.14 },
];

export default function ScrollShape() {
  const { scrollYProgress } = useScroll();
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 1080]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [-15, 55]);
  const rotateZ = useTransform(scrollYProgress, [0, 1], [0, -140]);

  return (
    <div className="scroll-shape-wrap" aria-hidden="true">
      <div className="scroll-shape-scene">
        <motion.div className="scroll-shape-rotor" style={{ rotateX, rotateY, rotateZ }}>
          {RINGS.map((ring, i) => (
            <div
              key={i}
              className="scroll-shape-ring"
              style={{
                transform: `rotateX(${ring.rotateX}deg) rotateY(${ring.rotateY}deg) rotateZ(${ring.rotateZ}deg)`,
                borderColor: `rgba(255,255,255,${ring.opacity})`,
              }}
            />
          ))}
          <div className="scroll-shape-core" />
        </motion.div>
      </div>
    </div>
  );
}
