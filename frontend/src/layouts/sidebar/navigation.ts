import joinedOrganisationsDark from '../../assets/icons/joined-organisations-dark.png';
import joinedOrganisationsLight from '../../assets/icons/joined-organisations-light.png';
import adminDark from '../../assets/icons/admin-dark.png';
import adminLight from '../../assets/icons/admin-light.png';
import myOrganisationsDark from '../../assets/icons/my-organisations-dark.png';
import myOrganisationsLight from '../../assets/icons/my-organisations-light.png';
import organisationsDark from '../../assets/icons/organisations-dark.png';
import organisationsLight from '../../assets/icons/organisations-light.png';
import paymentDark from '../../assets/icons/payement-dark.png';
import paymentLight from '../../assets/icons/payement-light.png';
import homeDark from '../../assets/icons/home-dark.png';
import homeLight from '../../assets/icons/home-light.png';

export type NavItem = {
  label: string;
  iconLight?: string;
  iconDark?: string;
  to: string;
};

export const navItems: NavItem[] = [
  { label: 'Home', iconLight: homeLight, iconDark: homeDark, to: '/' },
  { label: 'Organisations', iconLight: organisationsLight, iconDark: organisationsDark, to: '/organisations' },
  { label: 'My Organisations', iconLight: myOrganisationsLight, iconDark: myOrganisationsDark, to: '/my-organisations' },
  { label: 'Joined Organisations', iconLight: joinedOrganisationsLight, iconDark: joinedOrganisationsDark, to: '/joined-organisations' },
  { label: 'Payments', iconLight: paymentLight, iconDark: paymentDark, to: '/payments' },
  { label: 'Admin', iconLight: adminLight, iconDark: adminDark, to: '/admin' },
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