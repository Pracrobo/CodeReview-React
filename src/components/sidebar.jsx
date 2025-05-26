'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import {
  ScrollText,
  LayoutDashboard,
  Settings,
  User,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useMobile } from '../hooks/use-mobile';
import { useSidebar } from '../contexts/SidebarContext';

export default function Sidebar() {
  const location = useLocation();
  const isMobile = useMobile();
  const { collapsed, toggleSidebar } = useSidebar();
  const [showText, setShowText] = useState(!collapsed);

  // 메인 네비게이션 메뉴 항목들
  const mainMenuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: '대시보드',
      isActive: location.pathname === '/dashboard',
    },
    {
      path: '/repositories',
      icon: ScrollText,
      label: '저장소',
      isActive:
        location.pathname === '/repositories' ||
        location.pathname.startsWith('/repository'),
    },
    {
      path: '/issues',
      icon: AlertCircle,
      label: '이슈',
      isActive: location.pathname.startsWith('/issues'),
    },
  ];

  // 하단 네비게이션 메뉴 항목들
  const bottomMenuItems = [
    {
      path: '/profile',
      icon: User,
      label: '내 프로필',
      isActive: location.pathname === '/profile',
    },
    {
      path: '/settings',
      icon: Settings,
      label: '설정',
      isActive: location.pathname === '/settings',
    },
  ];

  // 메뉴 항목 렌더링 함수
  const renderMenuItem = (item) => (
    <Button
      key={item.path}
      variant={item.isActive ? 'secondary' : 'ghost'}
      className="w-full transition-all duration-300 h-10 px-3"
      asChild
    >
      <Link to={item.path} title={collapsed ? item.label : undefined}>
        {collapsed ? (
          <item.icon className="h-4 w-4" />
        ) : (
          <div className="flex items-center w-full">
            <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
            {showText && <span>{item.label}</span>}
          </div>
        )}
      </Link>
    </Button>
  );

  // 텍스트 표시 상태 관리
  useEffect(() => {
    if (collapsed) {
      setShowText(false);
    } else {
      const timer = setTimeout(() => {
        setShowText(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [collapsed]);

  if (isMobile) return null;

  return (
    <div
      className={`hidden md:flex flex-col border-r bg-background/95 backdrop-blur-sm min-h-[calc(100vh-3.5rem)] transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } dark:border-gray-700`}
    >
      {/* 토글 버튼 */}
      <div className="p-4 border-b border-border/50 dark:border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          className="w-full hover:bg-accent/50 transition-all duration-300 h-10 px-3 relative"
          onClick={toggleSidebar}
          aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <div className="flex items-center w-full">
              <ChevronLeft className="h-4 w-4 mr-2 flex-shrink-0" />
              {showText && (
                <span className="text-sm text-muted-foreground dark:text-gray-400">
                  사이드바 접기
                </span>
              )}
            </div>
          )}
        </Button>
      </div>

      <div className="p-4 space-y-2 flex-1 flex flex-col">
        {/* 메인 네비게이션 */}
        <nav className="space-y-1 flex-1">
          {mainMenuItems.map(renderMenuItem)}
        </nav>

        {/* 하단 네비게이션 */}
        <div className="border-t border-border/50 dark:border-gray-700 pt-4 mt-4">
          <nav className="space-y-1">{bottomMenuItems.map(renderMenuItem)}</nav>
        </div>
      </div>
    </div>
  );
}
