'use client';

import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import { services } from '@/data/services';
import Reveal from './Reveal';
import ServiceCard from './ServiceCard';

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export default function Services() {
  const { dict, lang } = useLang();

  return (
    <section
      id="services"
      className="px-[6vw]"
      style={{ paddingTop: 'clamp(5rem,12vh,8rem)', paddingBottom: 'clamp(5rem,12vh,8rem)' }}
    >
      <div className="max-w-[1200px] mx-auto">
        <Reveal as="span" className="eyebrow block mb-8">
          {dict.services.eyebrow}
        </Reveal>
        <div className="flex justify-between items-end mb-14 pb-4" style={{ borderBottom: '1px solid var(--line)' }}>
          <Reveal as="h2" className="sec-heading" style={{ fontSize: 'clamp(2.2rem,9vw,8rem)' }}>
            {dict.services.heading}
          </Reveal>
          <span
            className="font-tech uppercase hidden sm:inline"
            style={{ fontSize: '.6rem', letterSpacing: '.2em', color: 'rgba(255,255,255,0.85)' }}
          >
            {dict.services.expertise}
          </span>
        </div>

        <motion.div
          className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
        >
          {services.map((service) => (
            <ServiceCard key={service.num} service={service} lang={lang} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
