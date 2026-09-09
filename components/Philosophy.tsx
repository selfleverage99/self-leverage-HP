'use client';

import { useLang } from '@/lib/i18n/LanguageContext';
import Reveal from './Reveal';

export default function Philosophy() {
  const { dict } = useLang();

  return (
    <section
      id="philosophy"
      className="min-h-screen flex flex-col justify-center px-[6vw]"
      style={{ paddingTop: 'clamp(5rem,12vh,8rem)', paddingBottom: 'clamp(5rem,12vh,8rem)' }}
    >
      <Reveal as="span" className="eyebrow block mb-14">
        {dict.philosophy.eyebrow}
      </Reveal>
      <Reveal
        as="blockquote"
        className="font-serif italic"
        delay={0.1}
        style={{ fontSize: 'clamp(1.5rem,5.5vw,5rem)', lineHeight: '1.3', color: '#fff', maxWidth: '880px', marginBottom: '3.5rem' }}
      >
        {dict.philosophy.quote}
      </Reveal>
      <Reveal
        as="p"
        delay={0.2}
        style={{ color: 'rgba(255,255,255,0.48)', lineHeight: '1.9', fontSize: 'clamp(.9rem,1.65vw,1.03rem)', maxWidth: '560px', whiteSpace: 'pre-line' }}
      >
        {dict.philosophy.body}
      </Reveal>
    </section>
  );
}
