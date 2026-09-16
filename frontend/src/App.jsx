import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Settings from './pages/Settings';
import Subscription from './pages/Subscription';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminUsers from './pages/AdminUsers';
import Layout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { ThemeProvider } from './context/ThemeContext';
import { EarthPortalProvider } from './context/EarthPortalContext';
import BackgroundEarth from './components/BackgroundEarth';

function App() {
  return (
    <ThemeProvider>
      <EarthPortalProvider>
        <AuthProvider>
          <NotificationProvider>
            <SubscriptionProvider>
              {/* Persistent Background Particle Earth for All Pages */}
              <BackgroundEarth />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <BrowserRouter>
                  <Routes>
                    {/* Landing & Public Pages */}
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Main Security Portal Routes */}
                    <Route element={<Layout />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/resources" element={<Resources />} />
                      <Route path="/subscription" element={<Subscription />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/settings/:section" element={<Settings />} />

                      {/* Admin Only Route */}
                      <Route element={<ProtectedRoute requiredRole="admin" />}>
                        <Route path="/admin/users" element={<AdminUsers />} />
                      </Route>
                    </Route>

                    {/* Fallback to Home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </BrowserRouter>
              </div>
            </SubscriptionProvider>
          </NotificationProvider>
        </AuthProvider>
      </EarthPortalProvider>
    </ThemeProvider>
  );
}

export default App;


