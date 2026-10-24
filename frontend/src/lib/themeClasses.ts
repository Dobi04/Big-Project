import type { Theme } from '../hooks/useTheme';

export function getThemeClasses(theme: Theme) {
  const isDark = theme === 'dark';

  return {
    shell: isDark ? 'bg-[#1B1F23] text-[#F1F3F5]' : 'bg-[#FAF8F5] text-[#2B3036]',
    sidebar: isDark
      ? 'border-[#2F363E] bg-[#232930]/95 text-[#F1F3F5]'
      : 'border-[#EDE7DF] bg-white/95 text-[#2B3036]',
    border: isDark ? 'border-[#2F363E]' : 'border-[#EDE7DF]',
    subtleText: isDark ? 'text-[#9AA3AD]' : 'text-[#6B737C]',
    iconTile: isDark ? 'bg-[#2F363E] text-brand-300' : 'bg-[#FAF8F5] text-brand-600',
    secondaryButton: isDark
      ? 'border-[#3B434C] bg-[#2F363E] text-[#F1F3F5] hover:border-brand-400 hover:text-brand-300'
      : 'border-[#EDE7DF] bg-white text-[#2B3036] hover:border-brand-500 hover:text-brand-700',
    navLink: isDark
      ? 'text-[#D4D9DE] hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-white aria-[current=page]:border-brand-500 aria-[current=page]:bg-brand-500/15 aria-[current=page]:text-brand-300'
      : 'text-[#6B737C] hover:border-brand-300 hover:bg-brand-50 hover:text-[#2B3036] aria-[current=page]:border-brand-500 aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-700',
    ghostButton: isDark
      ? 'border-[#3B434C] bg-[#232930] text-[#F1F3F5] hover:border-brand-400'
      : 'border-[#EDE7DF] bg-[#FAF8F5] text-[#2B3036] hover:border-brand-400',
    userPanel: isDark ? 'border-brand-500/30 bg-brand-500/10' : 'border-brand-200 bg-brand-50',
    logoutButton: isDark
      ? 'border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20'
      : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100',
    headerBg: isDark ? 'border-[#2F363E] bg-[#1B1F23]/80' : 'border-[#EDE7DF] bg-[#FAF8F5]/80',
  };
}