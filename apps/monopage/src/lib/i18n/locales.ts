// lib/i18n/locales.ts — 4개 언어 지원 (한/영/일/중)
export const locales = ['ko', 'en', 'ja', 'zh'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'ko';

export const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
};
