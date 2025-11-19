// Menu Types
export interface IMenu {
  level: number;
  menuId: string;
  menuName: string;
  menuUsage: 'Y' | 'N';
  path: string[];
  programId?: string;
  url?: string;
}

export interface IHeaderMenu extends IMenu {
  level: 1;
}

export interface ISideMenu extends IMenu {
  level: 2 | 3;
}

export interface ITabMenu extends IMenu {
  isActive?: boolean;
}

