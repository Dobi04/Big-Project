import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getJoinedOrganisations } from '../api/organisations';
import { Pagination } from '../components/Pagination';
import { useClientPagedList } from '../hooks/useClientPagedList';
import { getErrorMessage } from '../lib/http';
import type { LayoutOutletContext } from '../layouts/MainLayout';
import type { JoinedOrganisation } from '../types/organisation';

export default function MyOrganisationsPage() {
  const { theme } = useOutletContext<LayoutOutletContext>();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [organisations, setOrganisations] = useState<JoinedOrganisation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const ownedOrganisations = organisations.filter((organisation) => organisation.myRole === 'Owner');
  const paged = useClientPagedList(ownedOrganisations, 10);
  useEffect(() => { getJoinedOrganisations().then(setOrganisations).catch((requestError: unknown) => setError(getErrorMessage(requestError, 'Failed to load your organisations.'))).finally(() => setIsLoading(false)); }, []);

  return <section className="space-y-4" aria-label="My organisations page"><div className={`rounded-[28px] border p-5 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}><h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>My Organisations</h1></div>{isLoading && <p className="text-sm">Loading organisations...</p>}{error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}{!isLoading && !error && ownedOrganisations.length === 0 && <p className={`rounded-2xl border p-4 text-sm ${isDark ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>No organisations you created yet.</p>}<div className="space-y-3">{paged.items.map((organisation) => <button type="button" key={organisation.organisationId} onClick={() => navigate(`/organisations/${organisation.organisationId}/workspace`)} className={`w-full rounded-2xl border p-4 text-left ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}><div className="flex items-center justify-between gap-3"><h2 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{organisation.organisationName}</h2><span className="rounded-full bg-violet-100 px-2 py-1 text-[10px] font-semibold text-violet-700">{organisation.myRole}</span></div><p className={`mt-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{organisation.memberCount} members | {organisation.paymentStatus}</p></button>)}</div><Pagination isDark={isDark} page={paged.page} totalPages={paged.totalPages} totalCount={paged.totalCount} onPageChange={paged.setPage} /></section>;
}