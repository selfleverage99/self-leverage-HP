'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface Link {
  href: string;
  label: string;
}

export default function NavMenu({ open, onClose, links }: { open: boolean; onClose: () => void; links: Link[] }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mobile-menu flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {links.map((l, i) => (
            <motion.a
              key={l.href}
              href={l.href}
              className="mobile-link"
              onClick={onClose}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * i }}
            >
              {l.label}
            </motion.a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
