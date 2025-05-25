"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import {
  ScrollText,
  LayoutDashboard,
  Settings,
  User,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMobile } from "../hooks/use-mobile";

export default function Sidebar() {
  const location = useLocation();
  const isMobile = useMobile();
  //사이드바 호출할때마다 collapsed가 false로 초기화됨으로 인해 순간적으로 사이드바가 펼쳐짐

  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved === "true";
  });
  //Sidebar가 호출될때 false로 초기화 하지 말고 함수형 초기값(내부 플래그 값)으로 변경

  // 사이드바 상태를 로컬 스토리지에 저장
  // TODO: 사이드바를 state로 저장하며, rendering 시 초기화된 후 값이 변경되는 문제를 해결
    const toggleSidebar = () => {
    const newState = !collapsed
    setCollapsed(newState)
    localStorage.setItem("sidebar-collapsed", String(newState))
  }

  if (isMobile) return null;

  return (
    <div
      className={`hidden md:flex flex-col border-r bg-background min-h-[calc(100vh-3.5rem)] transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* 토글 버튼을 최상단으로 이동 */}
      <div className="p-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={toggleSidebar}
          aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
          {!collapsed && (
            <span className="ml-2 whitespace-nowrap">사이드바 접기</span>
          )}
        </Button>
      </div>

      <div className="p-4 space-y-4 flex-1">
        <nav className="space-y-1">
          <Button
            variant={location.pathname === "/dashboard" ? "secondary" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link to="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <span className="ml-2 whitespace-nowrap">대시보드</span>
              )}
            </Link>
          </Button>

          <Button
            variant={
              location.pathname === "/repositories" ||
              location.pathname.startsWith("/repository")
                ? "secondary"
                : "ghost"
            }
            className="w-full justify-start"
            asChild
          >
            <Link to="/repositories">
              <ScrollText className="mr-2 h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <span className="ml-2 whitespace-nowrap">저장소</span>
              )}
            </Link>
          </Button>

          <Button
            variant={
              location.pathname.startsWith("/issues") ? "secondary" : "ghost"
            }
            className="w-full justify-start"
            asChild
          >
            <Link to="/issues">
              <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <span className="ml-2 whitespace-nowrap">이슈</span>
              )}
            </Link>
          </Button>
        </nav>
      </div>

      <div className="p-4 border-t">
        <nav className="space-y-1">
          <Button
            variant={location.pathname === "/profile" ? "secondary" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link to="/profile">
              <User className="mr-2 h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <span className="whitespace-nowrap">내 프로필</span>
              )}
            </Link>
          </Button>

          <Button
            variant={location.pathname === "/settings" ? "secondary" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link to="/settings">
              <Settings className="mr-2 h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">설정</span>}
            </Link>
          </Button>
        </nav>
      </div>
    </div>
  );
}
