import { Link } from 'react-router-dom';
import { getVisibleNavItems } from './navigation';

type Props = {
  classes: { navLink: string; iconTile: string };
  isDark: boolean;
  isCollapsed: boolean;
  isLoggedIn: boolean;
  role: string;
  onNavigate: () => void;
};

export default function SidebarNav({ classes, isDark, isCollapsed, isLoggedIn, role, onNavigate }: Props) {
  const visibleNavItems = getVisibleNavItems(isLoggedIn, role);

  return (
    <nav className="mt-6 space-y-2" aria-label="Main navigation">
      {visibleNavItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          title={isCollapsed ? item.label : undefined}
          onClick={onNavigate}
          className={`group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm font-medium transition ${classes.navLink} ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs ${classes.iconTile}`}>
            {item.iconDark && item.iconLight ? (
              <img src={isDark ? item.iconDark : item.iconLight} alt="" className="h-8 w-8 rounded-xl object-contain" />
            ) : (
              item.icon
            )}
          </span>
          {!isCollapsed && item.label}
        </Link>
      ))}
    </nav>
  );
}