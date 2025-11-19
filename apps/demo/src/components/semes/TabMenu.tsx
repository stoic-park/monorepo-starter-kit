import React from 'react';
import { Typography, Button } from '@design-system/components';
import { ITabMenu } from '../../types/menu';

interface TabMenuProps {
  tabs: ITabMenu[];
  activeTabId: string;
  onTabSelect: (menuId: string) => void;
  onTabClose: (menuId: string) => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const TabMenu: React.FC<TabMenuProps> = ({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onToggleSidebar,
  sidebarOpen,
}) => {
  return (
    <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center gap-2 px-4">
      {/* Sidebar Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSidebar}
        className="flex-shrink-0"
      >
        {sidebarOpen ? '◀' : '▶'}
      </Button>

      <div className="h-6 w-px bg-slate-300" />

      {/* Tabs */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto">
        {tabs.length === 0 && (
          <Typography variant="caption" className="text-slate-500">
            Select a menu from sidebar
          </Typography>
        )}
        {tabs.map((tab) => (
          <div
            key={tab.menuId}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTabId === tab.menuId
                ? 'bg-white border border-slate-300 text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <button
              onClick={() => onTabSelect(tab.menuId)}
              className="text-sm font-medium"
            >
              {tab.menuName}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.menuId);
              }}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabMenu;

