import type { ReactNode } from 'react';

type FilterBarProps = {
  isDark: boolean;
  children: ReactNode;
  onClear: () => void;
};

export function FilterBar({ isDark, children, onClear }: FilterBarProps) {
  return (
    <div className={`rounded-[26px] border p-4 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
      <button type="button" onClick={onClear} className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${isDark ? 'border-slate-700 bg-slate-800 text-slate-100 hover:border-violet-400' : 'border-slate-200 bg-slate-100 text-slate-800 hover:border-violet-400'}`}>
        Clear filters
      </button>
    </div>
  );
}