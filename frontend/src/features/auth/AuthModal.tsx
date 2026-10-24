import { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';
import { getErrorMessage } from '../../lib/http';
import darkLogo from '../../assets/voyra-logo-dark.jpg';
import lightLogo from '../../assets/voyra-logo-light.jpg';

type AuthMode = 'signin' | 'login';

type AuthModalProps = {
  isOpen: boolean;
  mode: AuthMode;
  isDark: boolean;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
  onAuthSuccess?: () => void;
};
type Step = 'form' | 'verify' | 'success';

export default function AuthModal({ isOpen, mode, isDark, onClose, onModeChange, onAuthSuccess }: AuthModalProps) {
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
  const [step, setStep] = useState<Step>('form');
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setSuccess('');
      setIsSubmitting(false);
      setStep('form');
      setVerificationCode('');
      setPendingEmail('');
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

  const modalClasses = isDark
    ? 'border-[#2F363E] bg-[#232930] text-[#F1F3F5] shadow-black/40'
    : 'border-[#EDE7DF] bg-white text-[#2B3036] shadow-slate-900/15';
  const surfaceClasses = isDark
    ? 'border-[#3B434C] bg-[#2F363E]'
    : 'border-[#EDE7DF] bg-[#FAF8F5]';
  const inputClasses = isDark
    ? 'border-[#3B434C] bg-[#1B1F23] text-[#F1F3F5] placeholder:text-[#9AA3AD]'
    : 'border-[#EDE7DF] bg-white text-[#2B3036] placeholder:text-[#6B737C]';
  const labelClasses = isDark ? 'text-[#D4D9DE]' : 'text-[#515B66]';
  const mutedClasses = isDark ? 'text-[#9AA3AD]' : 'text-[#6B737C]';
  const errorClasses = isDark ? 'text-rose-300' : 'text-rose-700';
  const successClasses = isDark ? 'text-emerald-300' : 'text-emerald-700';

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

        await apiClient.post('/api/Auth/register', payload);
        setPendingEmail(form.email);
        setVerificationCode('');
        setStep('verify');
        setForm({
          name: '',
          surname: '',
          username: '',
          email: '',
          password: '',
        });
        return;
      }

      const payload = {
        username: form.username,
        password: form.password,
      };

      const response = await apiClient.post('/api/Auth/login', payload);
      localStorage.setItem('username', response.data.username || form.username);
      localStorage.setItem('role', response.data.role || 'User');
      setSuccess('Login successful.');
      setForm({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
      });
      onAuthSuccess?.();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Something went wrong.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await apiClient.post('/api/Auth/verify-email', {
        email: pendingEmail,
        code: verificationCode,
      });

      localStorage.setItem('username', response.data.username);
      localStorage.setItem('role', response.data.role);

      setStep('success');
      onAuthSuccess?.();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Something went wrong.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try{
      await apiClient.post('/api/Auth/resend-code', {
        email: pendingEmail,
      });

      setSuccess('A new code has been sent.');
    } catch {
      setError('Could not resend the code.');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-end justify-center p-4 backdrop-blur-md md:items-center ${isDark ? 'bg-slate-950/75' : 'bg-slate-900/35'}`} onClick={onClose}>
      <div
        className={`max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto rounded-t-[28px] border p-5 shadow-2xl md:rounded-[28px] ${modalClasses}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={`ml-auto flex h-9 w-9 items-center justify-center rounded-full text-xl transition ${surfaceClasses} ${isDark ? 'text-[#F1F3F5] hover:bg-[#3B434C]' : 'text-[#2B3036] hover:bg-[#EDE7DF]'}`}
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <div className={`mx-auto -mt-7 mb-3 w-28 overflow-hidden rounded-xl ${isDark ? 'bg-[#1B1F23]' : 'bg-[#FAF8F5]'}`}>
          <img src={isDark ? darkLogo : lightLogo} alt="Voyra" className="h-auto w-full object-contain" />
        </div>

        {step === 'form' && (
          <>
            <div
              className={`mt-4 grid grid-cols-2 gap-2 rounded-2xl border p-1 ${surfaceClasses}`}
              role="tablist"
              aria-label="Authentication mode"
            >
              <button
                type="button"
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  mode === 'signin' ? 'voyra-gradient text-white shadow-lg shadow-brand-900/20' : mutedClasses
                }`}
                onClick={() => onModeChange('signin')}
              >
                Register
              </button>
              <button
                type="button"
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  mode === 'login' ? 'voyra-gradient text-white shadow-lg shadow-brand-900/20' : mutedClasses
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
                    <span className={`mb-2 block text-sm font-medium ${labelClasses}`}>Name</span>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className={`w-full rounded-xl border px-3 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 ${inputClasses}`}
                      placeholder="Your name"
                    />
                  </label>

                  <label className="block">
                    <span className={`mb-2 block text-sm font-medium ${labelClasses}`}>Surname</span>
                    <input
                      name="surname"
                      value={form.surname}
                      onChange={handleChange}
                      required
                      className={`w-full rounded-xl border px-3 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 ${inputClasses}`}
                      placeholder="Your surname"
                    />
                  </label>
                </>
              )}

              <label className="block">
                <span className={`mb-2 block text-sm font-medium ${labelClasses}`}>Username</span>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  minLength={mode === 'signin' ? 8 : undefined}
                  className={`w-full rounded-xl border px-3 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 ${inputClasses}`}
                  placeholder="username"
                />
              </label>

              {mode === 'signin' && (
                <label className="block">
                  <span className={`mb-2 block text-sm font-medium ${labelClasses}`}>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-xl border px-3 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 ${inputClasses}`}
                    placeholder="you@example.com"
                  />
                </label>
              )}

              <label className="block">
                <span className={`mb-2 block text-sm font-medium ${labelClasses}`}>Password</span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-xl border px-3 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 ${inputClasses}`}
                  placeholder="••••••••"
                />
              </label>

              {error && <p className={`text-sm font-medium ${errorClasses}`}>{error}</p>}
              {success && <p className={`text-sm font-medium ${successClasses}`}>{success}</p>}

              <button
                type="submit"
                className="w-full rounded-2xl voyra-gradient px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/30 transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Please wait...' : mode === 'signin' ? 'Create account' : 'Log in'}
              </button>
            </form>
          </>
        )}

        {step === 'verify' && (
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold">Verify your Email</h2>
            <p className={`mt-2 text-sm ${mutedClasses}`}>
              A code was just sent to <span className={isDark ? 'text-white' : 'font-medium text-[#2B3036]'}>{pendingEmail}</span>
            </p>

            <form className="mt-5 space-y-4 text-left" onSubmit={handleVerify}>
              <label className="block">
                <span className={`mb-2 block text-sm font-medium ${labelClasses}`}>Enter your code:</span>
                <input
                  name="code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  required
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  className={`w-full rounded-xl border px-3 py-3 text-center text-lg tracking-widest outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 ${inputClasses}`}
                  placeholder="XXX XXX"
                />
              </label>

              {error && <p className={`text-sm font-medium ${errorClasses}`}>{error}</p>}
              {success && <p className={`text-sm font-medium ${successClasses}`}>{success}</p>}

              <button
                type="submit"
                className="w-full rounded-2xl voyra-gradient px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/30 transition hover:brightness-110 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Please wait...' : 'Verify'}
              </button>

              <p className={`text-center text-xs ${mutedClasses}`}>
                Didn't get a code?{' '}
                <button type="button" onClick={handleResend} className="text-brand-300 underline">
                  Resend
                </button>
              </p>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="mt-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white">
              ✓
            </div>
            <h2 className="mt-4 text-xl font-semibold">Success!</h2>
            <p className={`mt-2 text-sm ${mutedClasses}`}>You have successfully been verified</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-2xl voyra-gradient px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Main Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
