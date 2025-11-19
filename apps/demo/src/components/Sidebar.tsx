import React from 'react';
import { Typography, Divider, Badge } from '@design-system/components';

const Sidebar: React.FC = () => {
  const menuItems = [
    { name: 'Dashboard', active: true },
    { name: 'Analytics', active: false },
    { name: 'Projects', active: false },
    { name: 'Team', active: false },
  ];

  const documentItems = [
    { name: 'Data Library', badge: 'New' },
    { name: 'Reports', badge: null },
    { name: 'Settings', badge: null },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Typography variant="h3" className="font-bold text-slate-900">
          Demo App
        </Typography>
        <Typography variant="caption" className="text-slate-500">
          Design System Showcase
        </Typography>
      </div>

      <Divider />

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {/* Main Menu */}
        <div className="mb-8">
          <Typography
            variant="caption"
            className="text-slate-500 px-3 mb-2 uppercase font-semibold"
          >
            Main
          </Typography>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    item.active
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Documents Menu */}
        <div>
          <Typography
            variant="caption"
            className="text-slate-500 px-3 mb-2 uppercase font-semibold"
          >
            Documents
          </Typography>
          <ul className="space-y-1">
            {documentItems.map((item) => (
              <li key={item.name}>
                <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors">
                  <span className="text-sm font-medium">{item.name}</span>
                  {item.badge && (
                    <Badge variant="info" size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <Divider />

      {/* User Section */}
      <div className="p-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-semibold">
            JD
          </div>
          <div className="flex-1">
            <Typography
              variant="body2"
              className="font-semibold text-slate-900"
            >
              John Doe
            </Typography>
            <Typography variant="caption" className="text-slate-500">
              john@example.com
            </Typography>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

