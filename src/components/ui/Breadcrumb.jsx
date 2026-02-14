import React from 'react';
import { ChevronRight, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { MENU_GROUPS } from '../../constants';

export const Breadcrumb = ({ activeMenu, activeSubMenu, onNavigate }) => {
  const { theme } = useTheme();

  const menuItem = MENU_GROUPS
    .flatMap(g => g.items)
    .find(item => item.id === activeMenu);

  if (!menuItem) return null;

  const segments = [
    { label: 'Dashboard', id: 'dashboard', sub: null },
  ];

  if (activeMenu !== 'dashboard') {
    segments.push({ label: menuItem.label, id: menuItem.id, sub: null });
  }

  if (activeSubMenu) {
    segments.push({ label: activeSubMenu, id: menuItem.id, sub: activeSubMenu });
  }

  return (
    <div
      className="flex items-center gap-1.5 px-4 md:px-6 py-2.5 border-b text-sm"
      style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.primary }}
    >
      <LayoutDashboard size={14} style={{ color: theme.icon.muted }} />
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        return (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight size={12} style={{ color: theme.icon.muted }} />}
            <button
              onClick={() => onNavigate(seg.id, seg.sub)}
              className={`hover:underline transition-colors ${isLast ? 'font-medium' : ''}`}
              style={{ color: isLast ? theme.text.primary : theme.text.muted }}
              disabled={isLast}
            >
              {seg.label}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};
