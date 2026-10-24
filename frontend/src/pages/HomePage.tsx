import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import OrganisationCard from '../components/OrganisationCard';
import { getTopOrganisations } from '../api/organisations';
import { getErrorMessage } from '../lib/http';
import type { OrganisationSummary } from '../types/organisation';
import type { LayoutOutletContext } from '../layouts/MainLayout';

export default function HomePage() {
  const { theme } = useOutletContext<LayoutOutletContext>();
  const isDark = theme === 'dark';
  const [organisations, setOrganisations] = useState<OrganisationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTopOrganisations()
      .then(setOrganisations)
      .catch((requestError: unknown) => setError(getErrorMessage(requestError, 'Failed to load organisations.')))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="space-y-4" aria-label="Home page">
      <div
        className={`rounded-2xl border p-5 shadow-2xl ${
          isDark
            ? 'border-brand-500/25 bg-linear-to-br from-brand-500/10 via-slate-900 to-slate-900 shadow-black/30'
            : 'border-brand-200 bg-linear-to-br from-brand-50 via-white to-slate-100 shadow-brand-900/10'
        }`}
      >
        <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${isDark ? 'text-brand-300' : 'text-brand-700'}`}>
          Overview
        </p>
        <h1 className="mt-2 bg-linear-to-r from-[#D95F0E] via-[#F28C1E] to-[#F2B03D] bg-clip-text text-3xl font-black text-transparent">
          VOYRA
        </h1>
        <div className={`mt-3 flex min-h-20 items-center justify-center rounded-2xl border border-dashed text-center text-sm font-semibold ${isDark ? 'border-slate-600 text-brand-300' : 'border-slate-300 text-brand-700'}`}>
          Your travel community, all in one place
        </div>
        <p className={`mt-3 text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Manage trips, track team activity, and keep the payment flow simple from a phone-first dashboard.
        </p>

        <div className="mt-5 flex gap-2">
          <button type="button" className="flex-1 rounded-2xl voyra-gradient px-4 py-3 text-sm font-semibold text-white shadow-md shadow-brand-900/20 transition hover:brightness-110">
            New trip
          </button>
          <button
            type="button"
            className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold ${
              isDark ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-200 bg-slate-100 text-slate-700'
            }`}
          >
            View tasks
          </button>
        </div>
      </div>

      <section aria-labelledby="top-organisations-title" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="top-organisations-title" className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Top organisations</h2>
        </div>
        {isLoading && <p className={`rounded-2xl border p-4 text-sm ${isDark ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>Loading organisations...</p>}
        {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
        {!isLoading && !error && organisations.length === 0 && <p className={`rounded-2xl border p-4 text-sm ${isDark ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>No organisations found.</p>}
        {!isLoading && !error && organisations.length > 0 && <div className="grid grid-cols-1 gap-4">{organisations.map((organisation) => <OrganisationCard key={organisation.id} isDark={isDark} organisation={organisation} />)}</div>}
        {/* Later this section will also include top public events. */}
      </section>
    </section>
  );
}
