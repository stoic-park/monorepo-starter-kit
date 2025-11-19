import React from 'react';
import { Input, Button, Badge } from '@design-system/components';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <Input placeholder="Search..." fullWidth />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          Notifications
          <Badge variant="error" size="sm" className="ml-2">
            3
          </Badge>
        </Button>
        <Button variant="outline" size="sm">
          Settings
        </Button>
      </div>
    </header>
  );
};

export default Header;

