export type NavItem = {
  label: string;
  icon: string;
  to: string;
};

export const navItems: NavItem[] = [
  { label: 'Home', icon: '⌂', to: '/' },
  { label: 'Organisations', icon: '🏷️', to: '/organisations' },
  { label: 'My Organisations', icon: '⭐', to: '/my-organisations' },
  { label: 'Joined Organisations', icon: '🤝', to: '/joined-organisations' },
  { label: 'Tracking', icon: '📍', to: '/tracking' },
  { label: 'Payments', icon: '💳', to: '/payments' },
  { label: 'Admin', icon: '⚙️', to: '/admin' },
];

export function getVisibleNavItems(isLoggedIn: boolean, role: string) {
  const normalizedRole = role?.trim().toLowerCase() ?? '';

  if (!isLoggedIn) {
    return navItems.filter((item) => item.to === '/');
  }

  if (normalizedRole === 'admin') {
    return navItems;
  }

  if (normalizedRole === 'owner') {
    return navItems.filter((item) => item.to !== '/admin');
  }

  return navItems.filter((item) => item.to !== '/admin' && item.to !== '/my-organisations');
}