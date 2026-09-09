export type Lang = 'ja' | 'en' | 'vn';

export interface CompanyRow {
  label: string;
  value: string;
}

export interface Dictionary {
  nav: {
    about: string;
    philosophy: string;
    services: string;
    company: string;
    contact: string;
  };
  hero: {
    tag: string;
    sub: string;
  };
  about: {
    eyebrow: string;
    heading: string;
    body1: string;
    body2: string;
  };
  philosophy: {
    eyebrow: string;
    quote: string;
    body: string;
  };
  services: {
    eyebrow: string;
    heading: string;
    expertise: string;
  };
  company: {
    eyebrow: string;
    heading: string;
    tag: string;
    rows: CompanyRow[];
    businessLabel: string;
    legalHeading: string;
    legalRows: CompanyRow[];
  };
  contact: {
    eyebrow: string;
    heading: string;
    fieldName: string;
    fieldEmail: string;
    fieldMessage: string;
    send: string;
  };
  footer: {
    copyright: string;
  };
}
