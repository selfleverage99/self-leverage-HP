'use client';

import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import Reveal from './Reveal';

export default function Contact() {
  const { dict } = useLang();

  return (
    <section
      id="contact"
      className="min-h-screen flex flex-col justify-center px-[6vw]"
      style={{
        paddingTop: 'clamp(5rem,12vh,8rem)',
        paddingBottom: 'clamp(5rem,12vh,8rem)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <Reveal as="span" className="eyebrow block mb-8">
        {dict.contact.eyebrow}
      </Reveal>
      <Reveal as="h2" className="sec-heading mb-16" style={{ fontSize: 'clamp(2.6rem,11vw,10rem)' }}>
        {dict.contact.heading}
      </Reveal>

      <Reveal as="form" className="max-w-[600px] flex flex-col gap-10" action="https://formspree.io/f/mpwvbrdl" method="POST">
        <div className="field-wrap">
          <input type="text" id="name" name="name" required placeholder=" " />
          <label htmlFor="name" className="field-label">{dict.contact.fieldName}</label>
        </div>
        <div className="field-wrap">
          <input type="email" id="email" name="email" required placeholder=" " />
          <label htmlFor="email" className="field-label">{dict.contact.fieldEmail}</label>
        </div>
        <div className="field-wrap">
          <textarea id="message" name="message" rows={5} required placeholder=" " />
          <label htmlFor="message" className="field-label">{dict.contact.fieldMessage}</label>
        </div>
        <div className="pt-2">
          <motion.button type="submit" className="btn-outline" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <span>{dict.contact.send}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </motion.button>
        </div>
      </Reveal>
    </section>
  );
}
