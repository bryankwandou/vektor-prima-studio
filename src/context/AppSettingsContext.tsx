import React, { createContext, useContext, useEffect, useState } from 'react';
import idLocale from '../locales/id.json';
import enLocale from '../locales/en.json';

export type ThemeMode = 'dark' | 'light';
export type LocaleCode = 'id' | 'en';
export type Dictionary = typeof idLocale;

interface AppSettingsContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  locale: LocaleCode;
  toggleLocale: () => void;
  t: Dictionary;
}

const dictionaries: Record<LocaleCode, Dictionary> = {
  id: idLocale,
  en: enLocale,
};

const STORAGE_THEME_KEY = 'vps-theme-mode';
const STORAGE_LOCALE_KEY = 'vps-locale-code';

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

function resolveInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = window.localStorage.getItem(STORAGE_THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // Fallback to system preference
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function resolveInitialLocale(): LocaleCode {
  if (typeof window === 'undefined') return 'id';
  try {
    const saved = window.localStorage.getItem(STORAGE_LOCALE_KEY);
    if (saved === 'id' || saved === 'en') return saved;
  } catch {
    // Fallback to browser language
  }
  const browserLang = window.navigator.language.toLowerCase();
  return browserLang.startsWith('id') ? 'id' : 'en';
}

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(resolveInitialTheme);
  const [locale, setLocale] = useState<LocaleCode>(resolveInitialLocale);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch {
      // Ignore storage write restrictions
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', locale);
    try {
      window.localStorage.setItem(STORAGE_LOCALE_KEY, locale);
    } catch {
      // Ignore storage write restrictions
    }
  }, [locale]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLocale = () => {
    setLocale((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  return (
    <AppSettingsContext.Provider
      value={{
        theme,
        toggleTheme,
        locale,
        toggleLocale,
        t: dictionaries[locale],
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings(): AppSettingsContextValue {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }
  return context;
}
