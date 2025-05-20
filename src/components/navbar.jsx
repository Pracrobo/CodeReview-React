'use client';

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Github, Menu, X } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const authContext = useAuth();
  const isAuthenticated = authContext ? authContext.isAuthenticated : false;
  const isLoggedIn = isAuthenticated;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2 mr-4">
          <Link
            to={isLoggedIn ? '/dashboard' : '/'}
            className="flex items-center gap-1"
          >
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Aissue
            </span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-between">
          <nav className="flex items-center gap-6 text-sm">
            {!isLoggedIn && (
              <>
                <Link
                  to="/"
                  className={`transition-colors hover:text-foreground/80 ${
                    location.pathname === '/'
                      ? 'text-foreground font-medium'
                      : 'text-foreground/60'
                  }`}
                >
                  홈
                </Link>
                <a
                  href="/#features"
                  className="transition-colors text-foreground/60 hover:text-foreground/80"
                >
                  기능
                </a>
                <a
                  href="/#pricing"
                  className="transition-colors text-foreground/60 hover:text-foreground/80"
                >
                  가격 정책
                </a>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ModeToggle />
            {isLoggedIn ? (
              <Button asChild variant="ghost" size="icon">
                <Link to="/profile">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                    HG
                  </div>
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  로그인
                </Button>
                <Button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-1"
                >
                  <Github className="h-4 w-4" />
                  <span>시작하기</span>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="md:hidden flex flex-1 items-center justify-end">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              {!isLoggedIn && (
                <>
                  <Link
                    to="/"
                    className={`transition-colors hover:text-foreground/80 ${
                      location.pathname === '/'
                        ? 'text-foreground font-medium'
                        : 'text-foreground/60'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    홈
                  </Link>
                  <a
                    href="/#features"
                    className="transition-colors text-foreground/60 hover:text-foreground/80"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    기능
                  </a>
                  <a
                    href="/#pricing"
                    className="transition-colors text-foreground/60 hover:text-foreground/80"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    가격 정책
                  </a>
                </>
              )}
            </nav>

            {!isLoggedIn && (
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                >
                  로그인
                </Button>
                <Button
                  className="w-full flex items-center justify-center gap-1"
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                >
                  <Github className="h-4 w-4" />
                  <span>시작하기</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
