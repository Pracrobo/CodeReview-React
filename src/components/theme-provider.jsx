'use client';

import { useEffect, useState } from 'react'; // useContext 제거
import { ThemeProviderContext } from '../contexts/theme-context'; // 경로 수정

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }
    try {
      const storedTheme = window.localStorage.getItem(storageKey);
      if (storedTheme) {
        return storedTheme; // 'light', 'dark', 'system' 중 하나
      }
      // localStorage에 값이 없을 경우 defaultTheme 사용
      return defaultTheme;
    } catch (e) {
      // localStorage 접근 불가 시 defaultTheme 사용
      console.warn(`Failed to read theme from localStorage: ${e}`);
      return defaultTheme;
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
