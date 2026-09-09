'use client';

import { useLang } from '@/lib/i18n/LanguageContext';
import { services } from '@/data/services';
import Reveal from './Reveal';

export default function Company() {
  const { dict } = useLang();
  const businessList = services.map((s) => s.title).join('\n');

  return (
    <section
      id="company"
      className="px-[6vw]"
      style={{
        paddingTop: 'clamp(5rem,12vh,8rem)',
        paddingBottom: 'clamp(5rem,12vh,8rem)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="max-w-[960px] mx-auto">
        <Reveal as="span" className="eyebrow block mb-8">
          {dict.company.eyebrow}
        </Reveal>
        <div className="flex justify-between items-end mb-10 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Reveal as="h2" className="sec-heading" style={{ fontSize: 'clamp(2rem,7vw,6rem)', letterSpacing: '-0.015em' }}>
            {dict.company.heading}
          </Reveal>
          <span className="font-tech uppercase" style={{ fontSize: '.6rem', letterSpacing: '.2em', color: 'rgba(255,255,255,0.35)' }}>
            {dict.company.tag}
          </span>
        </div>

        <Reveal as="dl" style={{ borderTop: '1px solid var(--line)' }}>
          {dict.company.rows.map((row) => (
            <div className="tbl-row" key={row.label}>
              <dt className="tbl-dt">{row.label}</dt>
              <dd className="tbl-dd">{row.value}</dd>
            </div>
          ))}
          <div className="tbl-row">
            <dt className="tbl-dt">{dict.company.businessLabel}</dt>
            <dd className="tbl-dd">{businessList}</dd>
          </div>
        </Reveal>

        <Reveal as="div" className="mt-24 pt-16" style={{ borderTop: '1px solid var(--line)' }}>
          <h3 className="text-center mb-8 uppercase" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', letterSpacing: '.05em' }}>
            {dict.company.legalHeading}
          </h3>
          <dl style={{ borderTop: '1px solid var(--line)' }}>
            {dict.company.legalRows.map((row) => (
              <div className="tbl-row text-sm" key={row.label}>
                <dt className="tbl-dt" style={{ fontSize: '.68rem' }}>{row.label}</dt>
                <dd className="tbl-dd" style={{ fontSize: '.84rem', color: 'rgba(255,255,255,0.6)' }}>{row.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
