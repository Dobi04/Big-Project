import { useOutletContext, useParams } from 'react-router-dom';
import type { LayoutOutletContext } from '../layouts/MainLayout';

export default function OrganisationWorkspacePage() {
  const { theme } = useOutletContext<LayoutOutletContext>();
  const isDark = theme === 'dark';
  const { id = '' } = useParams();

  return <section aria-label="Organisation workspace"><div className={`rounded-[28px] border p-6 shadow-2xl ${isDark ? 'border-violet-500/20 bg-slate-900 shadow-violet-950/30' : 'border-violet-200 bg-white shadow-violet-200/50'}`}><h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Ovo je stranica organizacije #{id}</h1></div></section>;
}