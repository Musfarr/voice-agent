import { createBrowserRouter, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import LiveDemo from './pages/LiveDemo';
import Login from './pages/Login';

export const createRouter = (isAuthenticated, onLogin, onLogout) => {
  return createBrowserRouter([
    {
      path: '/login',
      element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={onLogin} />,
    },
    {
      path: '/dashboard',
      element: isAuthenticated ? <Dashboard onLogout={onLogout} /> : <Navigate to="/login" replace />,
      children: [
        {
          index: true,
          element: <DashboardHome />,
        },
        {
          path: 'live-demo',
          element: <LiveDemo />,
        },
      ],
    },
    {
      path: '/',
      element: <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />,
    },
    {
      path: '*',
      element: <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />,
    },
  ]);
};
