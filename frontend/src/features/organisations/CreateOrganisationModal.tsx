import { useEffect, useState } from 'react';
import { createOrganisation, uploadOrganisationLogo } from '../../api/organisations';
import LogoDropzone from '../../components/LogoDropzone';
import { getErrorMessage } from '../../lib/http';

type Props = {
  isDark: boolean;
  onClose: () => void;
  onCreated: () => void | Promise<void>;
};

type FormState = {
  organisationName: string;
  organisationDescription: string;
  visibility: 'Public' | 'Private';
  type: string;
  subscriptionType: 'Free' | 'Paid';
  monthlyPrice: string;
  yearlyPrice: string;
};

const inputClasses = 'w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 ';

export default function CreateOrganisationModal({ isDark, onClose, onCreated }: Props) {
  const [form, setForm] = useState<FormState>({
    organisationName: '',
    organisationDescription: '',
    visibility: 'Private',
    type: '',
    subscriptionType: 'Free',
    monthlyPrice: '',
    yearlyPrice: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | null>(null);
  const fieldsClass = `${inputClasses}${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`;
  const labelClass = `mb-2 block text-xs uppercase tracking-[0.15em] ${isDark ? 'text-slate-400' : 'text-slate-600'}`;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const updateField = (field: keyof FormState, value: string) => setForm({ ...form, [field]: value });

  const handleLogoChange = (file: File | null) => {
  setLogoFile(file);
  setUploadedLogoUrl(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.organisationName.trim() || !form.organisationDescription.trim()) {
      setError('Please complete all required fields.');
      return;
    }

    const monthlyPrice = Number(form.monthlyPrice);
    const yearlyPrice = Number(form.yearlyPrice);
    if (form.subscriptionType === 'Paid' && !(monthlyPrice > 0 || yearlyPrice > 0)) {
      setError('Enter a monthly or yearly price greater than zero.');
      return;
    }

    setIsCreating(true);
    try {
      let organisationLogo = uploadedLogoUrl ?? '';
      if (logoFile && !uploadedLogoUrl) {
        organisationLogo = await uploadOrganisationLogo(logoFile);
        setUploadedLogoUrl(organisationLogo);
      }
      await createOrganisation({
        organisationName: form.organisationName.trim(),
        organisationLogo: organisationLogo,
        organisationDescription: form.organisationDescription.trim(),
        visibility: form.visibility,
        type: form.type.trim() || 'NoneAdded',
        subscriptionType: form.subscriptionType,
        ...(form.subscriptionType === 'Paid' ? {
          monthlyPrice: form.monthlyPrice ? monthlyPrice : null,
          yearlyPrice: form.yearlyPrice ? yearlyPrice : null,
        } : {}),
        latitude: null,
        longitude: null,
      });
      await onCreated();
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError, 'Failed to create organisation.'));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 p-0 backdrop-blur-md sm:items-center sm:p-4" onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="createOrganisationTitle" aria-label="Create organisation form" onClick={(event) => event.stopPropagation()} className={`max-h-[calc(100dvh-1rem)] w-full max-w-3xl overflow-y-auto rounded-t-[28px] border p-5 shadow-2xl sm:rounded-[28px] ${isDark ? 'border-slate-800 bg-slate-900 shadow-black/40' : 'border-slate-200 bg-white shadow-slate-900/10'}`}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h1 id="createOrganisationTitle" className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Create organisation</h1>
          <button type="button" onClick={onClose} aria-label="Close modal" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl transition ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="organisationName">Name</label>
          <input id="organisationName" required maxLength={100} value={form.organisationName} onChange={(event) => updateField('organisationName', event.target.value)} className={fieldsClass} />
        </div>
        <div>
          <p className={labelClass}>Logo</p>
          <LogoDropzone isDark={isDark} file={logoFile} onChange={handleLogoChange} />
        </div>
        <div>
          <label className={labelClass} htmlFor="organisationDescription">Description</label>
          <textarea id="organisationDescription" required maxLength={1000} rows={5} value={form.organisationDescription} onChange={(event) => updateField('organisationDescription', event.target.value)} className={fieldsClass} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="visibility">Visibility</label>
            <select id="visibility" value={form.visibility} onChange={(event) => updateField('visibility', event.target.value)} className={fieldsClass}>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="type">Type</label>
            <input id="type" maxLength={50} value={form.type} onChange={(event) => updateField('type', event.target.value)} className={fieldsClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="subscriptionType">Plan</label>
            <select id="subscriptionType" value={form.subscriptionType} onChange={(event) => updateField('subscriptionType', event.target.value)} className={fieldsClass}>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          {form.subscriptionType === 'Paid' && <>
            <div>
              <label className={labelClass} htmlFor="monthlyPrice">Monthly price</label>
              <input id="monthlyPrice" type="number" min="0" step="0.01" value={form.monthlyPrice} onChange={(event) => updateField('monthlyPrice', event.target.value)} className={fieldsClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="yearlyPrice">Yearly price</label>
              <input id="yearlyPrice" type="number" min="0" step="0.01" value={form.yearlyPrice} onChange={(event) => updateField('yearlyPrice', event.target.value)} className={fieldsClass} />
            </div>
          </>}
        </div>
        {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className={`rounded-xl border px-4 py-3 text-sm font-semibold transition hover:border-brand-400 hover:text-brand-500 ${isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>Cancel</button>
          <button type="submit" disabled={isCreating} className="rounded-xl voyra-gradient px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">{isCreating ? 'Creating...' : 'Create organisation'}</button>
        </div>
        </form>
      </section>
    </div>
  );
}