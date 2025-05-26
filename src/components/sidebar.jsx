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

  // 텍스트 표시 상태 관리 개선
  useEffect(() => {
    if (collapsed) {
      // 즉시 숨김
      setShowText(false);
    } else {
      // 펼칠 때는 딜레이 후 표시
      const timer = setTimeout(() => {
        setShowText(true);
      }, 200); // 애니메이션 시간보다 짧게 설정

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
        <nav className="space-y-1 flex-1">
          <Button
            variant={location.pathname === '/dashboard' ? 'secondary' : 'ghost'}
            className="w-full transition-all duration-300 h-10 px-3"
            asChild
          >
            <Link to="/dashboard" title={collapsed ? '대시보드' : undefined}>
              {collapsed ? (
                <LayoutDashboard className="h-4 w-4" />
              ) : (
                <div className="flex items-center w-full">
                  <LayoutDashboard className="h-4 w-4 mr-3 flex-shrink-0" />
                  {showText && <span>대시보드</span>}
                </div>
              )}
            </Link>
          </Button>

          <Button
            variant={
              location.pathname === '/repositories' ||
              location.pathname.startsWith('/repository')
                ? 'secondary'
                : 'ghost'
            }
            className="w-full transition-all duration-300 h-10 px-3"
            asChild
          >
            <Link to="/repositories" title={collapsed ? '저장소' : undefined}>
              {collapsed ? (
                <ScrollText className="h-4 w-4" />
              ) : (
                <div className="flex items-center w-full">
                  <ScrollText className="h-4 w-4 mr-3 flex-shrink-0" />
                  {showText && <span>저장소</span>}
                </div>
              )}
            </Link>
          </Button>

          <Button
            variant={
              location.pathname.startsWith('/issues') ? 'secondary' : 'ghost'
            }
            className="w-full transition-all duration-300 h-10 px-3"
            asChild
          >
            <Link to="/issues" title={collapsed ? '이슈' : undefined}>
              {collapsed ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <div className="flex items-center w-full">
                  <AlertCircle className="h-4 w-4 mr-3 flex-shrink-0" />
                  {showText && <span>이슈</span>}
                </div>
              )}
            </Link>
          </Button>
        </nav>

        {/* 하단 네비게이션을 상단 네비게이션과 같은 영역으로 이동 */}
        <div className="border-t border-border/50 dark:border-gray-700 pt-4 mt-4">
          <nav className="space-y-1">
            <Button
              variant={location.pathname === '/profile' ? 'secondary' : 'ghost'}
              className="w-full transition-all duration-300 h-10 px-3"
              asChild
            >
              <Link to="/profile" title={collapsed ? '내 프로필' : undefined}>
                {collapsed ? (
                  <User className="h-4 w-4" />
                ) : (
                  <div className="flex items-center w-full">
                    <User className="h-4 w-4 mr-3 flex-shrink-0" />
                    {showText && <span>내 프로필</span>}
                  </div>
                )}
              </Link>
            </Button>

            <Button
              variant={
                location.pathname === '/settings' ? 'secondary' : 'ghost'
              }
              className="w-full transition-all duration-300 h-10 px-3"
              asChild
            >
              <Link to="/settings" title={collapsed ? '설정' : undefined}>
                {collapsed ? (
                  <Settings className="h-4 w-4" />
                ) : (
                  <div className="flex items-center w-full">
                    <Settings className="h-4 w-4 mr-3 flex-shrink-0" />
                    {showText && <span>설정</span>}
                  </div>
                )}
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
