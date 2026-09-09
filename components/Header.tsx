'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useLang } from '@/lib/i18n/LanguageContext';
import NavMenu from './NavMenu';

export default function Header() {
  const { dict, label, cycleLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest < 50) {
      setScrolled(false);
    } else if (latest > lastY.current) {
      setScrolled(true);
    }
    lastY.current = latest;
  });

  const links = [
    { href: '#about', label: dict.nav.about },
    { href: '#philosophy', label: dict.nav.philosophy },
    { href: '#services', label: dict.nav.services },
    { href: '#company', label: dict.nav.company },
    { href: '#contact', label: dict.nav.contact },
  ];

  return (
    <>
      <header id="navbar" className={`fixed top-0 left-0 w-full z-50 px-6 py-5 ${scrolled ? 'scrolled' : ''}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="#hero" className="flex items-center gap-3 group relative z-50">
            <Image
              src="/logo.jpg"
              alt="Self Leverage"
              width={32}
              height={32}
              className="rounded-full object-contain mix-blend-screen group-hover:scale-110 transition-transform duration-300"
              priority
            />
            <span className="font-tech text-sm tracking-[.18em] uppercase text-white font-bold">Self Leverage</span>
          </a>

          <div className="flex items-center gap-6">
            <button onClick={cycleLang} className="lang-toggle" aria-label="switch language">
              {label}
            </button>

            <button
              className="hamburger relative z-50 flex flex-col justify-between items-end w-[26px] h-5"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="toggle menu"
              aria-expanded={menuOpen}
            >
              <span className={`hamburger-line ${menuOpen ? 'line-1-open' : ''}`} />
              <span className={`hamburger-line ${menuOpen ? 'line-2-open' : ''}`} />
              <span className={`hamburger-line ${menuOpen ? 'line-3-open' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <NavMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={links} />
    </>
  );
}
