import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OAuthCallback from './pages/OAuthCallback';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import { SidebarProvider } from './contexts/SidebarContext';
import authUtils from './utils/auth';
import authService from './services/authService';
import ProtectedRoutes from './routes/ProtectedRoutes';

function App() {
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      let accessToken = localStorage.getItem('accessToken');
      const publicPaths = [
        '/login',
        '/auth/login',
        '/oauth/callback',
      ];
      // publicPaths에서는 refresh 시도하지 않음
      if (!accessToken && publicPaths.some((p) => location.pathname.startsWith(p))) {
        setLoggedIn(false);
        setChecked(true);
        return;
      }
      // accessToken이 없으면 refreshToken(쿠키)로 갱신 시도
      if (!accessToken) {
        try {
          const refreshResult = await authService.refreshAccessToken();
          if (refreshResult.success && refreshResult.accessToken) {
            accessToken = refreshResult.accessToken;
            localStorage.setItem('accessToken', accessToken);
            setLoggedIn(true);
            setChecked(true);
            return;
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('refreshAccessToken 에러:', error);
        }
        // refreshToken도 없거나 만료된 경우
        setLoggedIn(false);
        setChecked(true);
        return;
      }
      // accessToken이 있으면 만료 여부 체크
      setLoggedIn(authUtils.isLoggedIn());
      setChecked(true);
    };

    checkLogin();

    // 로그인 상태 변경 이벤트 핸들러
    const handleLoginStateChanged = () => {
      setChecked(false);
      checkLogin();
    };
    window.addEventListener('storage', handleLoginStateChanged);
    window.addEventListener('loginStateChanged', handleLoginStateChanged);

    return () => {
      window.removeEventListener('storage', handleLoginStateChanged);
      window.removeEventListener('loginStateChanged', handleLoginStateChanged);
    };
  }, [location.pathname]);

  if (!checked) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route
            path="/"
            element={
              loggedIn ? <Navigate to="/dashboard" replace /> : <HomePage />
            }
          />
          <Route
            path="/login"
            element={
              loggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route
            path="*"
            element={
              checked && loggedIn ? <ProtectedRoutes /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </div>
    </SidebarProvider>
  );
}

export default App;
