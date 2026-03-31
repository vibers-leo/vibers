// lib/i18n/LanguageContext.tsx — 다국어 컨텍스트 (한/영/일/중)
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, defaultLocale, locales } from './locales';
import { translations } from './translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof translations.ko; // 번역 객체
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 쿠키에 저장 (서버에서도 접근 가능)
function setCookie(name: string, value: string, days: number = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // 초기 로드 시 쿠키 → localStorage 순서로 언어 설정 복원
  useEffect(() => {
    const cookieLocale = getCookie('locale') as Locale;
    const savedLocale = cookieLocale || (localStorage.getItem('locale') as Locale);
    if (savedLocale && locales.includes(savedLocale as Locale)) {
      setLocaleState(savedLocale as Locale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    setCookie('locale', newLocale);
  };

  const t = translations[locale] as typeof translations.ko;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
