import { Link } from 'react-router-dom';
import { navItems } from './navigation';

type Props = {
  classes: { navLink: string; iconTile: string };
  isCollapsed: boolean;
  onNavigate: () => void;
};

export default function SidebarNav({ classes, isCollapsed, onNavigate }: Props) {
  return (
    <nav className="mt-6 space-y-2" aria-label="Main navigation">
      {navItems.map((item) => (
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
            {item.icon}
          </span>
          {!isCollapsed && item.label}
        </Link>
      ))}
    </nav>
  );
}