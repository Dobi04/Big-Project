import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import AuthModal from '../features/auth/AuthModal';

export type LayoutOutletContext = {
  theme: 'dark' | 'light';
};

type AuthMode = 'signin' | 'login';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Excursions', to: '/excursions' },
  { label: 'Tracking', to: '/tracking' },
  { label: 'Payments', to: '/payments' },
];

function getStoredUsername() {
  return localStorage.getItem('username') || '';
}

function getStoredTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function MainLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(getStoredTheme);
  const [username, setUsername] = useState<string>(getStoredUsername);

  const isLoggedIn = Boolean(localStorage.getItem('authToken')) && Boolean(username);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setUsername(getStoredUsername());
  }, [isModalOpen]);

  const refreshUserState = () => {
    setUsername(getStoredUsername());
  };

  const openModal = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsModalOpen(true);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setUsername('');
    setIsSidebarOpen(false);
  };

  const shellClasses =
    theme === 'dark'
      ? 'bg-slate-950 text-slate-100'
      : 'bg-slate-100 text-slate-900';
  const sidebarClasses =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/95 text-slate-100'
      : 'border-slate-200 bg-white/95 text-slate-900';
  const subtleTextClasses = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const secondaryButtonClasses =
    theme === 'dark'
      ? 'border-slate-700 bg-slate-800 text-slate-100 hover:border-violet-400 hover:text-violet-100'
      : 'border-slate-200 bg-slate-100 text-slate-800 hover:border-violet-400 hover:text-violet-700';
  const navLinkClasses =
    theme === 'dark'
      ? 'text-slate-300 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white'
      : 'text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-slate-900';

  return (
    <>
      <div className={`min-h-screen transition-colors duration-200 ${shellClasses}`}>
        <div
          aria-hidden={!isSidebarOpen}
          className={`fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
            isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />

        <aside
          className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r p-4 shadow-2xl shadow-slate-950/30 transition-transform duration-300 ease-out backdrop-blur-xl md:translate-x-0 ${sidebarClasses} ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className={`flex items-center justify-between border-b pb-4 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 text-xs font-black tracking-[0.2em] text-violet-400">
                ES
              </div>
              <div>
                <p className={`text-xs uppercase tracking-[0.24em] ${subtleTextClasses}`}>App</p>
                <h1 className="text-base font-semibold">ExcursionSaaS</h1>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setIsSidebarOpen(false)}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-lg md:hidden ${
                theme === 'dark' ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-200 bg-slate-100 text-slate-700'
              }`}
            >
              ×
            </button>
          </div>

          <nav className="mt-6 space-y-2" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm font-medium transition ${navLinkClasses}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs ${
                    theme === 'dark' ? 'bg-slate-800 text-violet-200' : 'bg-slate-100 text-violet-600'
                  }`}
                >
                  {item.label.slice(0, 1)}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={`mt-auto space-y-3 border-t pt-4 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
            {isLoggedIn ? (
              <>
                <div
                  className={`rounded-2xl border px-3 py-3 ${
                    theme === 'dark' ? 'border-violet-500/30 bg-violet-500/10' : 'border-violet-200 bg-violet-50'
                  }`}
                >
                  <p className={`text-[10px] uppercase tracking-[0.18em] ${subtleTextClasses}`}>Welcome</p>
                  <p className="mt-1 text-base font-semibold">{username}</p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    theme === 'dark'
                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20'
                      : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openModal('signin')}
                  className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition ${secondaryButtonClasses}`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => openModal('login')}
                  className="w-full rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-400"
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </aside>

        <div className="min-h-screen md:pl-72">
          <header
            className={`sticky top-0 z-20 border-b backdrop-blur-xl ${
              theme === 'dark' ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-white/80'
            }`}
          >
            <div className="mx-auto flex h-16 max-w-md items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen((current) => !current)}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border text-lg md:hidden ${
                    theme === 'dark' ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-slate-200 bg-slate-100 text-slate-800'
                  }`}
                  aria-label="Toggle navigation"
                >
                  ☰
                </button>

                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/15 text-[10px] font-black text-violet-400">
                    ES
                  </div>
                  <span className="text-sm font-semibold">ExcursionSaaS</span>
                </div>
                {isLoggedIn ? (
                  <div className="flex items-center gap-2 rounded-full border border-violet-300/40 bg-violet-500/10 px-2.5 py-1.5">
                    <span className={`text-[10px] uppercase tracking-[0.18em] ${subtleTextClasses}`}>Welcome</span>
                    <span className="text-xs font-semibold text-violet-500">{username}</span>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => openModal('signin')}
                      className={`hidden rounded-full border px-3 py-2 text-xs font-medium md:inline-flex ${secondaryButtonClasses}`}
                    >
                      Sign in
                    </button>
                    <button
                      type="button"
                      onClick={() => openModal('login')}
                      className="hidden rounded-full bg-violet-500 px-3 py-2 text-xs font-semibold text-white md:inline-flex"
                    >
                      Log in
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
                  className={`rounded-full border px-2.5 py-2 text-xs font-medium ${secondaryButtonClasses}`}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-md px-4 py-5 pb-20">
            <Outlet context={{ theme } satisfies LayoutOutletContext} />
          </main>
        </div>
      </div>

      <AuthModal
        isOpen={isModalOpen}
        mode={authMode}
        onClose={() => setIsModalOpen(false)}
        onModeChange={setAuthMode}
        onAuthSuccess={() => {
          refreshUserState();
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
