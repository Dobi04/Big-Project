import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { getOrganisationById, joinOrganisation } from '../api/organisations';
import { getErrorMessage } from '../lib/http';
import { formatDate } from '../lib/format';
import type { LayoutOutletContext } from '../layouts/MainLayout';
import type { OrganisationDetails } from '../types/organisation';

export default function OrganisationDetailsPage() {
  const { theme } = useOutletContext<LayoutOutletContext>();
  const isDark = theme === 'dark';
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [organisation, setOrganisation] = useState<OrganisationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getOrganisationById(id).then(setOrganisation).catch((requestError: unknown) => setError(getErrorMessage(requestError, 'Failed to load organisation.'))).finally(() => setIsLoading(false));
  }, [id]);

  const handleJoin = async () => {
    if (!organisation) return;
    setIsJoining(true);
    setMessage(null);
    setJoinError(null);
    try {
      await joinOrganisation(id);
      if (organisation.subscriptionType === 'Free') navigate(`/organisations/${id}/workspace`);
      else {
        setOrganisation({ ...organisation, isMember: true });
        setMessage('You joined. Payment is pending.');
      }
    } catch (requestError) {
      setJoinError(getErrorMessage(requestError, 'Failed to join organisation.'));
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) return <p className={`rounded-[28px] border p-5 text-sm ${isDark ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>Loading organisation...</p>;
  if (error || !organisation) return <p className="rounded-[28px] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{error || 'Organisation not found.'}</p>;

  const infoTile = (label: string, value: string) => <div className={`rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}><p className={`text-xs uppercase tracking-[0.15em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p><p className={`mt-2 text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</p></div>;

  return (
    <section className="space-y-4" aria-label="Organisation details page">
      <div className={`rounded-[28px] border p-5 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center gap-3">
          {organisation.organisationLogo && <img src={organisation.organisationLogo} alt="" className="h-14 w-14 rounded-2xl object-cover" />}
          <div><h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{organisation.organisationName}</h1><p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{organisation.organisationDescription || 'No description available.'}</p></div>
        </div>
        {organisation.isMember ? (
          <button type="button" onClick={() => navigate(`/organisations/${id}/workspace`)} className="mt-5 w-full rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white">Open workspace</button>
        ) : (
          <button type="button" onClick={handleJoin} disabled={isJoining} className="mt-5 w-full rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{isJoining ? 'Joining...' : 'Join Organisation'}</button>
        )}
        {joinError && <p className="mt-3 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{joinError}</p>}
        {message && <p className={`mt-3 rounded-2xl p-3 text-sm ${isDark ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>{message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {infoTile('Type', organisation.type)}{infoTile('Visibility', organisation.visibility)}{infoTile('Members', String(organisation.membersCount))}{infoTile('Rating', `${organisation.averageRating.toFixed(1)} (${organisation.ratingsCount})`)}{infoTile('Plan', organisation.subscriptionType)}{infoTile('Created', formatDate(organisation.createdAt))}
        {organisation.subscriptionType === 'Paid' && <>{infoTile('Monthly price', String(organisation.monthlyPrice ?? '-'))}{infoTile('Yearly price', String(organisation.yearlyPrice ?? '-'))}</>}
      </div>
    </section>
  );
}