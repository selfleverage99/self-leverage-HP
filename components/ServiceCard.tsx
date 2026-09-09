'use client';

import { motion, type Variants } from 'framer-motion';
import ServiceIcon from './ServiceIcon';
import type { Service } from '@/data/services';
import type { Lang } from '@/lib/i18n';

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export default function ServiceCard({ service, lang }: { service: Service; lang: Lang }) {
  return (
    <motion.div className="service-card" variants={item} whileHover="hover" initial="rest">
      <motion.div
        className="service-card-icon"
        variants={{ rest: { opacity: 0.06, scale: 1 }, hover: { opacity: 0.14, scale: 1.08 } }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <ServiceIcon icon={service.icon} />
      </motion.div>
      <div className="service-card-content">
        <span className="service-num">{service.num}</span>
        <h3 className="service-title">{service.title}</h3>
        <p className="service-body">{service.body[lang]}</p>
      </div>
    </motion.div>
  );
}
