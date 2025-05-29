import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RepositoriesPage from './pages/RepositoriesPage';
import RepositoryPage from './pages/RepositoryPage';
import IssuePage from './pages/IssuePage';
import IssuesPage from './pages/IssuesPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import OAuthCallback from './pages/OAuthCallback';
import PaymentCompletePage from './pages/PaymentCompletePage';
import PaymentFailPage from './pages/PaymentFailPage';
import { SidebarProvider } from './contexts/SidebarContext';
import { isLoggedIn } from './utils/auth';

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkLogin = () => setLoggedIn(isLoggedIn());
    window.addEventListener('storage', checkLogin);
    const interval = setInterval(checkLogin, 300);

    setChecked(true);

    return () => {
      window.removeEventListener('storage', checkLogin);
      clearInterval(interval);
    };
  }, []);

  if (!checked) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          {/* 로그인한 사용자는 홈/로그인 접근 불가 */}
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
          {/* 콜백은 항상 접근 가능 */}
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          {/* 나머지는 로그인 필요 */}
          <Route
            path="*"
            element={
              loggedIn ? (
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/repositories" element={<RepositoriesPage />} />
                  <Route path="/repository/:id" element={<RepositoryPage />} />
                  <Route path="/repository/:id/issue/:issueId" element={<IssuePage />} />
                  <Route path="/issues" element={<IssuesPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                  <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                  <Route path="/payment/success" element={<PaymentCompletePage />} />
                  <Route path="/payment/fail" element={<PaymentFailPage />} />
                  <Route path="*" element={<Navigate to="/profile?tab=subscription" replace />} />
                </Routes>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </SidebarProvider>
  );
}

export default App;
