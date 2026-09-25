type PaginationProps = {
  isDark: boolean;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ isDark, page, totalPages, totalCount, onPageChange }: PaginationProps) {
  const buttonClasses = isDark
    ? 'border-slate-700 bg-slate-800 text-slate-100 hover:border-violet-400 disabled:text-slate-500'
    : 'border-slate-200 bg-slate-100 text-slate-800 hover:border-violet-400 disabled:text-slate-400';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Page {page} of {totalPages} · {totalCount} total entries
      </p>
      <div className="flex gap-2">
        <button type="button" className={`rounded-2xl border px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed ${buttonClasses}`} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>
        <button type="button" className={`rounded-2xl border px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed ${buttonClasses}`} disabled={page >= totalPages || totalPages === 0} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}