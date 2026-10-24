import { useOutletContext, useParams } from 'react-router-dom';
import type { LayoutOutletContext } from '../layouts/MainLayout';

export default function OrganisationWorkspacePage() {
  const { theme } = useOutletContext<LayoutOutletContext>();
  const isDark = theme === 'dark';
  const { id = '' } = useParams();

  return <section aria-label="Organisation workspace"><div className={`rounded-2xl border p-6 shadow-lg ${isDark ? 'border-brand-500/20 bg-slate-900 shadow-black/20' : 'border-brand-200 bg-white shadow-brand-900/10'}`}><h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Organisation #{id}</h1></div></section>;
}