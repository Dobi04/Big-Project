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
  const inputClasses = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`;

  return (
    <section className="space-y-4" aria-label="Admin page">
      <div
        className={`rounded-2xl border p-6 shadow-2xl ${
          isDark
            ? 'border-brand-500/20 bg-slate-900 shadow-black/20'
            : 'border-brand-200 bg-white shadow-brand-900/10'
        }`}
      >
        <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${isDark ? 'text-brand-300' : 'text-brand-700'}`}>
          Admin panel
        </p>
        <h1 className={`mt-3 text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Admin dashboard
        </h1>
        <p className={`mt-3 text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          This section is available to administrators only.
        </p>
      </div>
      <FilterBar isDark={isDark} onClear={() => setFilters({ entityName: '', action: '', dateFrom: '', dateTo: '' })}>
        <FilterField isDark={isDark} label="Entity"><input value={filters.entityName} onChange={(event) => setFilters({ ...filters, entityName: event.target.value })} className={inputClasses} /></FilterField>
        <FilterField isDark={isDark} label="Action"><select value={filters.action} onChange={(event) => setFilters({ ...filters, action: event.target.value })} className={inputClasses}><option value="">All actions</option>{AUDIT_ACTION_OPTIONS.map((action) => <option key={action} value={action}>{action === 'LoginFailed' ? 'Login Failed' : action}</option>)}</select></FilterField>
        <FilterField isDark={isDark} label="From date"><input type="date" value={filters.dateFrom} onChange={(event) => setFilters({ ...filters, dateFrom: event.target.value })} className={inputClasses} /></FilterField>
        <FilterField isDark={isDark} label="To date"><input type="date" value={filters.dateTo} onChange={(event) => setFilters({ ...filters, dateTo: event.target.value })} className={inputClasses} /></FilterField>
      </FilterBar>
      {query.isLoading && <p className={`rounded-2xl border p-4 text-sm ${isDark ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>Loading audit logs...</p>}
      {query.error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{query.error}</p>}
      <div className="space-y-3">{query.items.map((entry) => <article key={entry.id} className={`rounded-2xl border p-4 shadow-sm ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}><div className="flex items-start justify-between gap-3"><div><h2 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{entry.entityName} #{entry.entityId}</h2><p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{entry.username} · {entry.ipAddress || '-'}</p></div><span className="rounded-full bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-700">{formatAuditAction(entry.action)}</span></div><p className={`mt-3 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{formatTimestamp(entry.timestamp)}</p></article>)}</div>
      <Pagination isDark={isDark} page={query.page} totalPages={query.totalPages} totalCount={query.totalCount} onPageChange={query.setPage} />
    </section>
  );
}
