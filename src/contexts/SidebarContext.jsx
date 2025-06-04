import { useState } from 'react';
import { SidebarContext } from './sidebar-context-definition';

export function SidebarProvider({ children }) {
  // localStorage에서 초기값을 읽어옴
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebarCollapsed');
    return stored === 'true'; // 'true'면 true, 아니면 false
  });

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      localStorage.setItem('sidebarCollapsed', !prev);
      return !prev;
    });
  };

  return (
    <SidebarContext.Provider value={{ collapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}
