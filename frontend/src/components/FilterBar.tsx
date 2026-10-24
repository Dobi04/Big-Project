import type { ReactNode } from 'react';

type FilterBarProps = {
  isDark: boolean;
  children: ReactNode;
  onClear: () => void;
};

export function FilterBar({ isDark, children, onClear }: FilterBarProps) {
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
      <button type="button" onClick={onClear} className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold transition hover:border-brand-400 hover:text-brand-500 ${isDark ? 'border-slate-700 bg-slate-800 text-slate-100' : 'border-slate-200 bg-slate-100 text-slate-800'}`}>
        Clear filters
      </button>
    </div>
  );
}