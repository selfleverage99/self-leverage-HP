'use client';

import { useLang } from '@/lib/i18n/LanguageContext';

export default function Footer() {
  const { dict } = useLang();

  return (
    <footer className="py-9 px-10 flex justify-between items-center flex-wrap gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <span className="font-tech font-bold uppercase" style={{ fontSize: '.9rem', letterSpacing: '.18em', color: '#fff' }}>
        Self Leverage
      </span>
      <span className="font-tech" style={{ fontSize: '.6rem', letterSpacing: '.12em', color: 'rgba(255,255,255,0.25)' }}>
        {dict.footer.copyright}
      </span>
    </footer>
  );
}
