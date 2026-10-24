type PaginationProps = {
  isDark: boolean;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ isDark, page, totalPages, totalCount, onPageChange }: PaginationProps) {
  const buttonClasses = isDark
    ? 'border-slate-700 bg-slate-800 text-slate-100 hover:border-brand-400 hover:text-brand-300 disabled:text-slate-500'
    : 'border-slate-200 bg-white text-slate-800 hover:border-brand-400 hover:text-brand-700 disabled:text-slate-400';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Page <span className={`font-semibold ${isDark ? 'text-brand-300' : 'text-brand-700'}`}>{page}</span> of {totalPages} · {totalCount} total entries
      </p>
      <div className="flex gap-2">
        <button type="button" className={`rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${buttonClasses}`} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>
        <button type="button" className={`rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${buttonClasses}`} disabled={page >= totalPages || totalPages === 0} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}