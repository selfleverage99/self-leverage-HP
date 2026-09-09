import { ja } from './ja';
import { en } from './en';
import { vn } from './vn';
import type { Lang, Dictionary } from './types';

export type { Lang, Dictionary, CompanyRow } from './types';

export const dictionaries: Record<Lang, Dictionary> = { ja, en, vn };
export const langCycle: Lang[] = ['ja', 'en', 'vn'];
export const langLabels: Record<Lang, string> = { ja: 'JP', en: 'EN', vn: 'VN' };
