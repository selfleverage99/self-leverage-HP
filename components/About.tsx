'use client';

import { useLang } from '@/lib/i18n/LanguageContext';
import Reveal from './Reveal';

export default function About() {
  const { dict } = useLang();

  return (
    <section
      id="about"
      className="min-h-screen flex items-center px-[6vw]"
      style={{ paddingTop: 'clamp(5rem,12vh,8rem)', paddingBottom: 'clamp(5rem,12vh,8rem)' }}
    >
      <Reveal className="max-w-[620px]">
        <span className="eyebrow block mb-9">{dict.about.eyebrow}</span>
        <h2 className="sec-heading mb-12" style={{ fontSize: 'clamp(2rem,8.5vw,7.5rem)' }}>
          {dict.about.heading}
        </h2>
        <p
          className="mb-6"
          style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.9', fontSize: 'clamp(.95rem,1.75vw,1.08rem)', whiteSpace: 'pre-line' }}
        >
          {dict.about.body1}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: 'clamp(.88rem,1.55vw,.98rem)', whiteSpace: 'pre-line' }}>
          {dict.about.body2}
        </p>
      </Reveal>
    </section>
  );
}
