import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import FullscreenToggle from '../components/FullscreenToggle';

export default function Dashboard({ onLogout }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      <div className={`dashboard-main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <DashboardHeader onLogout={onLogout} />

        <div className="dashboard-content">
          <div className="px-4 py-4">
            <Outlet />
          </div>
        </div>

        <FullscreenToggle />
      </div>
    </div>
  );
}
