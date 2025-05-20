import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import RepositoriesPage from "./pages/RepositoriesPage"
import RepositoryPage from "./pages/RepositoryPage"
import IssuePage from "./pages/IssuePage"
import IssuesPage from "./pages/IssuesPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import TermsOfServicePage from "./pages/TermsOfServicePage"
import CookiePolicyPage from "./pages/CookiePolicyPage"
import { AuthProvider } from "./contexts/AuthContext"

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/repositories" element={<RepositoriesPage />} />
        <Route path="/repository/:id" element={<RepositoryPage />} />
        <Route path="/repository/:id/issue/:issueId" element={<IssuePage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
