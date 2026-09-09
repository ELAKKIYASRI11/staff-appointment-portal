import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import StudentPortal from './components/StudentPortal';
import StaffPortal from './components/StaffPortal';
import AdminPortal from './components/AdminPortal';
import AuthModal from './components/AuthModal';
import { authApi } from './api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState('student');
  const [authModalMode, setAuthModalMode] = useState('login');

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await authApi.getMe();
      if (res.data && res.data.authenticated) {
        setCurrentUser(res.data.user);
        setCurrentRole(res.data.role);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInitial(false);
    }
  };

  const handleOpenAuth = (role, mode = 'login') => {
    setAuthModalRole(role);
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user, role) => {
    setCurrentUser(user);
    setCurrentRole(role);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setCurrentRole(null);
  };

  const handleQuickLogin = async (role, email, password) => {
    try {
      const res = await authApi.login(email, password, role);
      if (res.data && res.data.success) {
        handleAuthSuccess(res.data.user, res.data.role);
      }
    } catch (err) {
      console.error(err);
      alert('Quick login failed: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loadingInitial) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-brand-600 border-t-transparent"></div>
          <span className="text-xs font-semibold text-slate-500">Connecting to Appointment Hub...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        currentRole={currentRole}
        onLogout={handleLogout}
        onQuickLogin={handleQuickLogin}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {!currentUser && (
          <LandingPage
            onOpenAuth={handleOpenAuth}
            onQuickLogin={handleQuickLogin}
          />
        )}

        {currentUser && currentRole === 'student' && (
          <StudentPortal currentUser={currentUser} />
        )}

        {currentUser && currentRole === 'staff' && (
          <StaffPortal currentUser={currentUser} />
        )}

        {currentUser && currentRole === 'admin' && (
          <AdminPortal currentUser={currentUser} />
        )}
      </main>

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={authModalRole}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Modern Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © 2026 <strong>Appointment Hub</strong>. Professional Higher Education Staff & Student Advisory Portal.
          </div>
          <div className="flex items-center gap-4 font-medium">
            <span className="text-emerald-600 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              API Online (Port 8080)
            </span>
            <span>MySQL 8.0</span>
            <span>Spring Boot 3.3.2</span>
            <span>React 19</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
