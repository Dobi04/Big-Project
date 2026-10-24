import { useMemo, useState } from 'react';

export type SearchableSelectOption = {
  value: string;
  label: string;
};

type SearchableSelectProps = {
  isDark: boolean;
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
};

export function SearchableSelect({ isDark, options, value, onChange, placeholder = 'Select an option', searchPlaceholder = 'Search options' }: SearchableSelectProps) {
  const [search, setSearch] = useState('');
  const filteredOptions = useMemo(
    () => options.filter((option) => option.label.toLocaleLowerCase().includes(search.toLocaleLowerCase())),
    [options, search],
  );
  const inputClasses = isDark
    ? 'border-slate-700 bg-slate-800 text-white placeholder:text-slate-400'
    : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-500';

  return (
    <div className="space-y-2">
      <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={searchPlaceholder} className={`w-full rounded-xl border px-3 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 ${inputClasses}`} />
      <select value={value} onChange={(event) => onChange(event.target.value)} className={`w-full rounded-xl border px-3 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 ${inputClasses}`}>
        <option value="">{placeholder}</option>
        {filteredOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
}