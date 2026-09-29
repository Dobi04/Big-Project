import { useNavigate } from 'react-router-dom';
import type { OrganisationSummary } from '../types/organisation';

type OrganisationCardProps = {
  isDark: boolean;
  organisation: OrganisationSummary;
};

export default function OrganisationCard({ isDark, organisation }: OrganisationCardProps) {
  const navigate = useNavigate();
  const initials = organisation.organisationName
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <article className={`rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-start gap-3">
        {organisation.organisationLogo ? (
          <img src={organisation.organisationLogo} alt="" className="h-12 w-12 rounded-2xl object-cover" />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500 text-sm font-black text-white">
            {initials || '?'}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className={`truncate text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{organisation.organisationName}</h2>
          <span className={`mt-1 inline-block rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${isDark ? 'bg-violet-500/15 text-violet-300' : 'bg-violet-100 text-violet-700'}`}>
            {organisation.type}
          </span>
        </div>
      </div>
      <p className={`mt-3 line-clamp-2 text-sm leading-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        {organisation.organisationDescription || 'No description available.'}
      </p>
      <div className={`mt-4 flex items-center justify-between text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        <span>{organisation.membersCount} members</span>
        <span>★ {organisation.averageRating.toFixed(1)} ({organisation.ratingsCount})</span>
      </div>
      <button
        type="button"
        onClick={() => navigate(`/organisations/${organisation.id}`)}
        className="mt-4 w-full rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-600"
      >
        View
      </button>
    </article>
  );
}