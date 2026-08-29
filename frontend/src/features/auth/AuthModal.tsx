import { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';

type AuthMode = 'signin' | 'login';

type AuthModalProps = {
  isOpen: boolean;
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
};

export default function AuthModal({ isOpen, mode, onClose, onModeChange }: AuthModalProps) {
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
        setSuccess('Registration successful. User saved to the database.');
      } else {
        const payload = {
          username: form.username,
          password: form.password,
        };

        const response = await apiClient.post('/api/Auth/login', payload);
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('username', response.data.username || form.username);
        setSuccess('Login successful.');
      }

      setForm({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
      });
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
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="auth-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>

        <div className="auth-toggle" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={mode === 'signin' ? 'active' : ''}
            onClick={() => onModeChange('signin')}
          >
            Sign in
          </button>
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => onModeChange('login')}
          >
            Log in
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signin' && (
            <>
              <label>
                <span>Name</span>
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>

              <label>
                <span>Surname</span>
                <input name="surname" value={form.surname} onChange={handleChange} required />
              </label>
            </>
          )}

          <label>
            <span>Username</span>
            <input name="username" value={form.username} onChange={handleChange} required />
          </label>

          {mode === 'signin' && (
            <label>
              <span>Email</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
          )}

          <label>
            <span>Password</span>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>

          {error && <p className="auth-message error">{error}</p>}
          {success && <p className="auth-message success">{success}</p>}

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : mode === 'signin' ? 'Create account' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}
