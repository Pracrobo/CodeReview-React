import { useContext } from 'react';
import { SidebarContext } from '../contexts/sidebar-context-definition';

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar는 SidebarProvider 내에서 사용해야 합니다');
  }
  return context;
}
