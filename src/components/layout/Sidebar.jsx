import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Settings, X } from 'lucide-react';
import { MENU_GROUPS, hasPermission } from '../../constants';

export const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  activeMenu,
  setActiveMenu,
  activeSubMenu,
  setActiveSubMenu,
  theme,
  userRole,
  isMobile,
  onCloseMobile
}) => {
  const [expandedMenus, setExpandedMenus] = useState(['packages']);

  const toggleMenu = (id) => setExpandedMenus(p =>
    p.includes(id) ? p.filter(m => m !== id) : [...p, id]
  );

  const handleMenuClick = (item) => {
    if (item.subItems) toggleMenu(item.id);
    setActiveMenu(item.id);
    setActiveSubMenu(null);
    if (isMobile) onCloseMobile();
  };

  const handleSubMenuClick = (item, sub) => {
    setActiveMenu(item.id);
    setActiveSubMenu(sub);
    if (isMobile) onCloseMobile();
  };

  return (
    <>
      {isMobile && <div className="fixed inset-0 bg-black/50 z-40" onClick={onCloseMobile} />}
      <aside
        className={`${isMobile ? 'fixed inset-y-0 left-0 z-50' : ''} ${isCollapsed && !isMobile ? 'w-20' : 'w-72'} border-r flex flex-col transition-all`}
        style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b" style={{ borderColor: theme.border.primary }}>
          {(!isCollapsed || isMobile) && (
            <span className="font-bold text-lg" style={{ color: theme.text.primary }}>LocQar</span>
          )}
          {isCollapsed && !isMobile && (
            <span className="font-bold text-sm" style={{ color: theme.text.primary }}>LQ</span>
          )}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg"
              style={{ backgroundColor: theme.bg.hover }}
            >
              {isCollapsed ? (
                <ChevronRight size={18} style={{ color: theme.text.secondary }}/>
              ) : (
                <ChevronLeft size={18} style={{ color: theme.text.secondary }}/>
              )}
            </button>
          )}
          {isMobile && (
            <button onClick={onCloseMobile} className="p-2 rounded-lg" style={{ color: theme.text.secondary }}>
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {MENU_GROUPS.map((group, idx) => (
            <div key={group.label} className={idx > 0 ? 'mt-6' : ''}>
              {(!isCollapsed || isMobile) && (
                <p className="px-3 mb-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  if (!hasPermission(userRole, item.permission)) return null;
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => handleMenuClick(item)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl"
                        style={{
                          backgroundColor: activeMenu === item.id ? theme.accent.light : 'transparent',
                          border: activeMenu === item.id ? `1px solid ${theme.accent.border}` : '1px solid transparent',
                          color: activeMenu === item.id ? theme.accent.primary : theme.text.secondary
                        }}
                      >
                        <item.icon size={20} />
                        {(!isCollapsed || isMobile) && (
                          <>
                            <span className="flex-1 text-sm text-left">{item.label}</span>
                            {item.subItems && (
                              <ChevronDown
                                size={16}
                                className={`transition-transform ${expandedMenus.includes(item.id) ? 'rotate-180' : ''}`}
                              />
                            )}
                          </>
                        )}
                      </button>
                      {(!isCollapsed || isMobile) && item.subItems && expandedMenus.includes(item.id) && (
                        <div className="mt-1 ml-4 pl-4 space-y-1" style={{ borderLeft: `1px solid ${theme.border.primary}` }}>
                          {item.subItems.map(sub => (
                            <button
                              key={sub}
                              onClick={() => handleSubMenuClick(item, sub)}
                              className="w-full text-left px-3 py-2 rounded-lg text-sm"
                              style={{
                                color: activeSubMenu === sub ? theme.accent.primary : theme.text.muted,
                                backgroundColor: activeSubMenu === sub ? theme.accent.light : 'transparent'
                              }}
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: theme.border.primary }}>
          <button
            onClick={() => { setActiveMenu('settings'); if (isMobile) onCloseMobile(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{
              color: activeMenu === 'settings' ? theme.accent.primary : theme.text.secondary,
              backgroundColor: activeMenu === 'settings' ? theme.accent.light : 'transparent'
            }}
          >
            <Settings size={20} />
            {(!isCollapsed || isMobile) && <span className="text-sm">Settings</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
