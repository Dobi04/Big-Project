import type { ReactNode } from 'react';

type FilterFieldProps = {
  isDark: boolean;
  label: string;
  children: ReactNode;
};

export function FilterField({ isDark, label, children }: FilterFieldProps) {
  return (
    <label className="block">
      <span className={`mb-2 block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
      {children}
    </label>
  );
}