import React from 'react';
import { Input, Button } from '@design-system/components';
import { getSideMenusByHeader } from '../../data/mockMenu';
import { ISideMenu } from '../../types/menu';
import { useDebounce } from '../../hooks';

interface SidebarProps {
  headerMenuId: string;
  onMenuSelect: (menu: ISideMenu) => void;
  activeMenuId: string;
  isOpen: boolean;
}

interface MenuItemGroupProps {
  parent: ISideMenu;
  childMenus: ISideMenu[];
  activeMenuId: string;
  onMenuSelect: (menu: ISideMenu) => void;
}

const MenuItemGroup: React.FC<MenuItemGroupProps> = ({
  parent,
  childMenus,
  activeMenuId,
  onMenuSelect,
}) => {
  const [expanded, setExpanded] = React.useState(true);
  const hasChildren = childMenus.length > 0;

  return (
    <div className="mb-2">
      {/* Parent Menu */}
      {hasChildren ? (
        <Button
          variant="ghost"
          align="left"
          fullWidth
          onClick={() => setExpanded(!expanded)}
          className="justify-between text-sm font-semibold"
        >
          {parent.menuName}
          <span className="text-xs">{expanded ? '▼' : '▶'}</span>
        </Button>
      ) : (
        <Button
          variant="ghost"
          align="left"
          active={activeMenuId === parent.menuId}
          fullWidth
          onClick={() => onMenuSelect(parent as ISideMenu)}
          className="text-sm font-semibold"
        >
          {parent.menuName}
        </Button>
      )}

      {/* Child Menus */}
      {hasChildren && expanded && (
        <div className="ml-4 mt-1 space-y-1">
          {childMenus.map((child) => (
            <Button
              key={child.menuId}
              variant="ghost"
              align="left"
              active={activeMenuId === child.menuId}
              fullWidth
              onClick={() => onMenuSelect(child)}
              className="text-sm"
            >
              {child.menuName}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  headerMenuId,
  onMenuSelect,
  activeMenuId,
  isOpen,
}) => {
  const sideMenus = getSideMenusByHeader(headerMenuId);
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Group menus by parent
  const parentMenus = sideMenus.filter((m) => m.level === 2);
  const childMenusByParent = parentMenus.reduce(
    (acc, parent) => {
      acc[parent.menuId] = sideMenus.filter(
        (m) => m.level === 3 && m.path.includes(parent.menuId)
      );
      return acc;
    },
    {} as Record<string, ISideMenu[]>
  );

  const filteredParents = parentMenus.filter((menu) =>
    menu.menuName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-slate-200">
        <Input
          placeholder="Search menu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
      </div>

      {/* Menu List */}
      <nav className="flex-1 overflow-y-auto p-2">
        {filteredParents.map((parent) => {
          const childMenus = childMenusByParent[parent.menuId] || [];
          return (
            <MenuItemGroup
              key={parent.menuId}
              parent={parent}
              childMenus={childMenus}
              activeMenuId={activeMenuId}
              onMenuSelect={onMenuSelect}
            />
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

