import { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';

type AuthMode = 'signin' | 'login';

type AuthModalProps = {
  isOpen: boolean;
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
  onAuthSuccess?: () => void;
};

export default function AuthModal({ isOpen, mode, onClose, onModeChange, onAuthSuccess }: AuthModalProps) {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setSuccess('');
      setIsSubmitting(false);
      setForm({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        const payload = {
          name: form.name,
          surname: form.surname,
          username: form.username,
          email: form.email,
          password: form.password,
        };

        const response = await apiClient.post('/api/Auth/register', payload);
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('username', response.data.username || form.username);
        localStorage.setItem('role', response.data.role || 'User');
        setSuccess('Registration successful. User saved to the database.');
      } else {
        const payload = {
          username: form.username,
          password: form.password,
        };

        const response = await apiClient.post('/api/Auth/login', payload);
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('username', response.data.username || form.username);
        localStorage.setItem('role', response.data.role || 'User');
        setSuccess('Login successful.');
      }

      setForm({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
      });

      onAuthSuccess?.();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object'
          ? (err.response as { data?: { message?: string } }).data?.message || 'Something went wrong.'
          : 'Something went wrong.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur-sm md:items-center" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-[28px] border border-slate-700 bg-slate-900 p-5 shadow-2xl shadow-slate-950/50 md:rounded-[28px]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xl text-slate-200"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <div
          className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-slate-700 bg-slate-800 p-1"
          role="tablist"
          aria-label="Authentication mode"
        >
          <button
            type="button"
            className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              mode === 'signin' ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20' : 'text-slate-300'
            }`}
            onClick={() => onModeChange('signin')}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              mode === 'login' ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20' : 'text-slate-300'
            }`}
            onClick={() => onModeChange('login')}
          >
            Log in
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          {mode === 'signin' && (
            <>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400"
                  placeholder="Your name"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Surname</span>
                <input
                  name="surname"
                  value={form.surname}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400"
                  placeholder="Your surname"
                />
              </label>
            </>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Username</span>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400"
              placeholder="username"
            />
          </label>

          {mode === 'signin' && (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400"
                placeholder="you@example.com"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400"
              placeholder="••••••••"
            />
          </label>

          {error && <p className="text-sm font-medium text-rose-400">{error}</p>}
          {success && <p className="text-sm font-medium text-emerald-400">{success}</p>}

          <button
            type="submit"
            className="w-full rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition enabled:hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Please wait...' : mode === 'signin' ? 'Create account' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}
