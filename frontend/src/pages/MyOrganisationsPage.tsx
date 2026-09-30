import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getOwnedOrganisations } from '../api/organisations';
import { Pagination } from '../components/Pagination';
import { useClientPagedList } from '../hooks/useClientPagedList';
import { getErrorMessage } from '../lib/http';
import type { LayoutOutletContext } from '../layouts/MainLayout';
import type { OrganisationSummary } from '../types/organisation';
import CreateOrganisationModal from '../features/organisations/CreateOrganisationModal';

export default function MyOrganisationsPage() {
  const { theme } = useOutletContext<LayoutOutletContext>();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [organisations, setOrganisations] = useState<OrganisationSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const paged = useClientPagedList(organisations, 10);
  useEffect(() => { getOwnedOrganisations().then(setOrganisations).catch((requestError: unknown) => setError(getErrorMessage(requestError, 'Failed to load your organisations.'))).finally(() => setIsLoading(false)); }, []);

  const handleOrganisationCreated = async () => {
    setIsCreateOpen(false);
    setIsLoading(true);
    setError(null);
    try {
      setOrganisations(await getOwnedOrganisations());
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError, 'Failed to load your organisations.'));
    } finally {
      setIsLoading(false);
    }
  };

  return <section className="space-y-4" aria-label="My organisations page"><div className={`flex flex-col gap-4 rounded-[28px] border p-5 sm:flex-row sm:items-center sm:justify-between ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}><h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>My Organisations</h1><button type="button" onClick={() => setIsCreateOpen(true)} className="rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-600">Create organisation</button></div>{isLoading && <p className="text-sm">Loading organisations...</p>}{error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}{!isLoading && !error && organisations.length === 0 && <p className={`rounded-2xl border p-4 text-sm ${isDark ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>No organisations you created yet.</p>}<div className="space-y-3">{paged.items.map((organisation) => <button type="button" key={organisation.id} onClick={() => navigate(`/organisations/${organisation.id}/workspace`)} className={`w-full rounded-2xl border p-4 text-left ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}><div className="flex items-center justify-between gap-3"><h2 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{organisation.organisationName}</h2><span className="rounded-full bg-violet-100 px-2 py-1 text-[10px] font-semibold text-violet-700">{organisation.visibility}</span></div><p className={`mt-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{organisation.membersCount} members | {organisation.type}</p></button>)}</div><Pagination isDark={isDark} page={paged.page} totalPages={paged.totalPages} totalCount={paged.totalCount} onPageChange={paged.setPage} />{isCreateOpen && <CreateOrganisationModal isDark={isDark} onClose={() => setIsCreateOpen(false)} onCreated={handleOrganisationCreated} />}</section>;
}