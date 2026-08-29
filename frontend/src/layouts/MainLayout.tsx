import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import AuthModal from '../features/auth/AuthModal';

type AuthMode = 'signin' | 'login';

export default function MainLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');

  const openModal = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="app-shell">
        <header className="topbar">
          <div className="nav-left">
            <nav className="main-nav" aria-label="Main navigation">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </nav>
          </div>

          <div className="brand" aria-label="Site brand">
            <div className="brand-logo" aria-label="Site logo">
              Logo
            </div>
            <span className="brand-name">ExcursionSaaS</span>
          </div>

          <div className="nav-right">
            <button type="button" className="auth-button secondary" onClick={() => openModal('signin')}>
              Sign in
            </button>
            <button type="button" className="auth-button primary" onClick={() => openModal('login')}>
              Log in
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>

      <AuthModal
        isOpen={isModalOpen}
        mode={authMode}
        onClose={() => setIsModalOpen(false)}
        onModeChange={setAuthMode}
      />
    </>
  );
}
