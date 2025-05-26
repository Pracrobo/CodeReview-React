import { useEffect, useState } from 'react';
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

    // 이전 테마 클래스를 제거하여 일관성 유지
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      // 시스템 테마 적용 시, 실제 적용된 테마(systemTheme)를 localStorage에 저장하거나
      // 상태로 관리할 필요는 현재 로직상 없습니다.
      // setTheme(systemTheme)을 호출하면 무한 루프가 발생할 수 있으므로 주의해야 합니다.
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
