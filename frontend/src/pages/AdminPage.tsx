import { useCallback, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getAuditLogs, type AuditLogFilters } from '../api/auditLogs';
import { AUDIT_ACTION_OPTIONS, formatAuditAction } from '../types/auditLog';
import { FilterBar } from '../components/FilterBar';
import { FilterField } from '../components/FilterField';
import { Pagination } from '../components/Pagination';
import { usePagedQuery } from '../hooks/usePagedQuery';
import { formatTimestamp } from '../lib/format';
import type { LayoutOutletContext } from '../layouts/MainLayout';

export default function AdminPage() {
  const outletContext = useOutletContext<LayoutOutletContext | undefined>();
  const theme = outletContext?.theme ?? 'light';
  const isDark = theme === 'dark';
  const [filters, setFilters] = useState<AuditLogFilters>({ entityName: '', action: '', dateFrom: '', dateTo: '' });
  const loader = useCallback((queryFilters: AuditLogFilters, page: number, pageSize: number) => getAuditLogs(queryFilters, page, pageSize), []);
  const query = usePagedQuery(filters, 10, loader);
  const inputClasses = `w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-violet-400 ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`;

  return (
    <section className="space-y-4" aria-label="Admin page">
      <div
        className={`rounded-[28px] border p-6 shadow-2xl ${
          isDark
            ? 'border-violet-500/20 bg-slate-900 shadow-violet-950/30'
            : 'border-violet-200 bg-white shadow-violet-200/50'
        }`}
      >
        <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${isDark ? 'text-violet-200' : 'text-violet-600'}`}>
          Admin panel
        </p>
        <h1 className={`mt-3 text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Ovo je admin stranica
        </h1>
        <p className={`mt-3 text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Ovaj deo je dostupan samo administratorima.
        </p>
      </div>
      <FilterBar isDark={isDark} onClear={() => setFilters({ entityName: '', action: '', dateFrom: '', dateTo: '' })}>
        <FilterField isDark={isDark} label="Entitet"><input value={filters.entityName} onChange={(event) => setFilters({ ...filters, entityName: event.target.value })} className={inputClasses} /></FilterField>
        <FilterField isDark={isDark} label="Akcija"><select value={filters.action} onChange={(event) => setFilters({ ...filters, action: event.target.value })} className={inputClasses}><option value="">All actions</option>{AUDIT_ACTION_OPTIONS.map((action) => <option key={action} value={action}>{action === 'LoginFailed' ? 'Login Failed' : action}</option>)}</select></FilterField>
        <FilterField isDark={isDark} label="Od datuma"><input type="date" value={filters.dateFrom} onChange={(event) => setFilters({ ...filters, dateFrom: event.target.value })} className={inputClasses} /></FilterField>
        <FilterField isDark={isDark} label="Do datuma"><input type="date" value={filters.dateTo} onChange={(event) => setFilters({ ...filters, dateTo: event.target.value })} className={inputClasses} /></FilterField>
      </FilterBar>
      {query.isLoading && <p className={`rounded-2xl border p-4 text-sm ${isDark ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>Loading audit logs...</p>}
      {query.error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{query.error}</p>}
      <div className="space-y-3">{query.items.map((entry) => <article key={entry.id} className={`rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}><div className="flex items-start justify-between gap-3"><div><h2 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{entry.entityName} #{entry.entityId}</h2><p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{entry.username} · {entry.ipAddress || '-'}</p></div><span className="rounded-full bg-violet-100 px-2 py-1 text-[10px] font-semibold text-violet-700">{formatAuditAction(entry.action)}</span></div><p className={`mt-3 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{formatTimestamp(entry.timestamp)}</p></article>)}</div>
      <Pagination isDark={isDark} page={query.page} totalPages={query.totalPages} totalCount={query.totalCount} onPageChange={query.setPage} />
    </section>
  );
}
