import { useOutletContext } from 'react-router-dom';
import type { LayoutOutletContext } from '../layouts/MainLayout';

export default function PaymentsPage() {
  const outletContext = useOutletContext<LayoutOutletContext | undefined>();
  const theme = outletContext?.theme ?? 'light';
  const isDark = theme === 'dark';

  return (
    <section className="space-y-4" aria-label="Payments page">
      <div className={`rounded-[28px] border p-5 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Payments</h1>
        <p className={`mt-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Logged in users can access this page.</p>
      </div>
    </section>
  );
}
