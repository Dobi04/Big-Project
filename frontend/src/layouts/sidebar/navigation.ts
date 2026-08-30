export type NavItem = {
    label: string;
    icon: string;
    to: string;
};

export const navItems: NavItem[] = [
    { label: 'Home', icon: '⌂', to: '/' },
    //Those below are just for testing purposes
    { label: 'Excursions', icon: '🗺️', to: '/excursions' },
    { label: 'Tracking', icon: '📍', to: '/tracking' },
    { label: 'Payments', icon: '💳', to: '/payments' },
]