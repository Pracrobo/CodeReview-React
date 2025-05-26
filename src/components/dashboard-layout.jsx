import Navbar from './navbar';
import Sidebar from './sidebar';
import { SidebarProvider } from '../contexts/SidebarContext';

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen">
        {/* 네비게이션 바 */}
        <Navbar />

        {/* 메인 콘텐츠 영역 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 사이드바 */}
          <Sidebar />

          {/* 메인 콘텐츠 */}
          <main className="flex-1 overflow-auto p-6 bg-background">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
