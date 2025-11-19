import React from 'react';
import { Typography, Button } from '@design-system/components';
import { getHeaderMenus } from '../../data/mockMenu';

interface HeaderProps {
  selectedHeaderId: string;
  onHeaderSelect: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  selectedHeaderId,
  onHeaderSelect,
}) => {
  const headerMenus = getHeaderMenus();

  return (
    <header className="h-14 bg-slate-900 flex items-center justify-between px-6 border-b border-slate-800">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <Typography variant="h4" className="text-white font-bold">
          Demo App
        </Typography>
        <div className="h-6 w-px bg-slate-700" />
        <Typography variant="caption" className="text-slate-400">
          Sample Workspace Application
        </Typography>
      </div>

      {/* Header Menu */}
      <nav className="flex items-center gap-2">
        {headerMenus.map((menu) => (
          <button
            key={menu.menuId}
            onClick={() => onHeaderSelect(menu.menuId)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedHeaderId === menu.menuId
                ? 'bg-slate-800 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {menu.menuName}
          </button>
        ))}
      </nav>

      {/* User Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
            <Typography variant="caption" className="text-white font-semibold">
              A
            </Typography>
          </div>
          <Typography variant="body2" className="text-slate-300">
            Admin
          </Typography>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-300 hover:text-white"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;

