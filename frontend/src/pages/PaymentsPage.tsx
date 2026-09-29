import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { changeRole } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../lib/http';
import type { LayoutOutletContext } from '../layouts/MainLayout';

export default function PaymentsPage() {
  const outletContext = useOutletContext<LayoutOutletContext | undefined>();
  const theme = outletContext?.theme ?? 'light';
  const isDark = theme === 'dark';
  const { role, refresh } = useAuth();
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = async (nextRole: string) => {
    setIsChangingRole(true);
    setError(null);
    try {
      const result = await changeRole(nextRole);
      localStorage.setItem('role', result.role);
      window.dispatchEvent(new Event('auth:changed'));
      refresh();
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Failed to change role.'));
    } finally {
      setIsChangingRole(false);
    }
  };

  return (
    <section className="space-y-4" aria-label="Payments page">
      <div className={`rounded-[28px] border p-5 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Payments</h1>
        <p className={`mt-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Current role: {role}</p>
      </div>
      <div className={`rounded-[28px] border p-5 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Privremeni upgrade sistem</h2>
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        <div className="mt-4 grid gap-3">
          <button type="button" disabled={isChangingRole || role === 'User'} onClick={() => handleRoleChange('User')} className="rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Become Member</button>
          {/* Roles enum nema Organizer, pa mapiramo na Owner. */}
          <button type="button" disabled={isChangingRole || role === 'Owner'} onClick={() => handleRoleChange('Owner')} className="rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Become Organizer</button>
          <button type="button" disabled={isChangingRole || role === 'Admin'} onClick={() => handleRoleChange('Admin')} className="rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Become Admin</button>
        </div>
      </div>
    </section>
  );
}
