import { useCallback, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import OrganisationCard from '../components/OrganisationCard';
import { FilterBar } from '../components/FilterBar';
import { FilterField } from '../components/FilterField';
import { Pagination } from '../components/Pagination';
import { getOrganisations } from '../api/organisations';
import { usePagedQuery } from '../hooks/usePagedQuery';
import type { LayoutOutletContext } from '../layouts/MainLayout';

const PAGE_SIZE = 20;
const inputClasses = 'w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-violet-400 ';

export default function OrganisationsPage() {
  const { theme } = useOutletContext<LayoutOutletContext>();
  const isDark = theme === 'dark';
  const [filters, setFilters] = useState({ search: '', type: '' });
  const loader = useCallback((queryFilters: typeof filters, page: number, pageSize: number) => getOrganisations(queryFilters, page, pageSize), []);
  const query = usePagedQuery(filters, PAGE_SIZE, loader);
  const fieldsClass = `${inputClasses}${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`;

  return (
    <section className="space-y-4" aria-label="Organisations page">
      <div className={`rounded-[28px] border p-5 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Organisations</h1>
        <p className={`mt-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Find an organisation and explore its community.</p>
      </div>
      <FilterBar isDark={isDark} onClear={() => setFilters({ search: '', type: '' })}>
        <FilterField isDark={isDark} label="Search"><input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} className={fieldsClass} /></FilterField>
        <FilterField isDark={isDark} label="Type"><input value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })} className={fieldsClass} /></FilterField>
      </FilterBar>
      {query.isLoading && <p className={`rounded-2xl border p-4 text-sm ${isDark ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>Loading organisations...</p>}
      {query.error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{query.error}</p>}
      {!query.isLoading && !query.error && query.items.length === 0 && <p className={`rounded-2xl border p-4 text-sm ${isDark ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>No organisations found.</p>}
      <div className="space-y-3">{query.items.map((organisation) => <OrganisationCard key={organisation.id} isDark={isDark} organisation={organisation} />)}</div>
      <Pagination isDark={isDark} page={query.page} totalPages={query.totalPages} totalCount={query.totalCount} onPageChange={query.setPage} />
    </section>
  );
}