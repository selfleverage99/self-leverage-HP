'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { dictionaries, langCycle, langLabels } from './index';
import type { Dictionary, Lang } from './types';

interface LanguageContextValue {
  lang: Lang;
  label: string;
  dict: Dictionary;
  cycleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ja');

  const cycleLang = useCallback(() => {
    setLang((current) => {
      const idx = langCycle.indexOf(current);
      return langCycle[(idx + 1) % langCycle.length];
    });
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      label: langLabels[lang],
      dict: dictionaries[lang],
      cycleLang,
    }),
    [lang, cycleLang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
