import { IMenu, IHeaderMenu, ISideMenu } from '../types/menu';

// Mock Menu Data for Demo Application
export const MOCK_MENU_DATA: IMenu[] = [
  // Header: Device
  {
    level: 1,
    menuId: '100',
    menuName: 'Device',
    menuUsage: 'Y',
    path: ['0', '0010', '100'],
  },
  // Device > 학습 관리
  {
    level: 2,
    menuId: '10010',
    menuName: 'Learning Management',
    menuUsage: 'Y',
    path: ['0', '0010', '100', '0010', '10010'],
  },
  {
    level: 3,
    menuId: '1001010',
    menuName: 'Workflow Management',
    menuUsage: 'Y',
    path: ['0', '0010', '100', '0010', '10010', '0010', '1001010'],
    programId: 'PROCESS_MGMT',
  },
  {
    level: 3,
    menuId: '1001020',
    menuName: 'Device Group',
    menuUsage: 'Y',
    path: ['0', '0010', '100', '0010', '10010', '0020', '1001020'],
    programId: 'SENSOR_GROUP',
  },
  {
    level: 3,
    menuId: '1001030',
    menuName: 'Learning Process',
    menuUsage: 'Y',
    path: ['0', '0010', '100', '0010', '10010', '0030', '1001030'],
    programId: 'TRAINING_PROC',
  },
  {
    level: 3,
    menuId: '1001040',
    menuName: 'Maintenance Management',
    menuUsage: 'Y',
    path: ['0', '0010', '100', '0010', '10010', '0040', '1001040'],
    programId: 'PM_MGMT',
  },
  {
    level: 3,
    menuId: '1001050',
    menuName: 'Data Collection View',
    menuUsage: 'Y',
    path: ['0', '0010', '100', '0010', '10010', '0050', '1001050'],
    programId: 'DATA_VIEW',
  },
  // Device > 모니터링 관리
  {
    level: 2,
    menuId: '10020',
    menuName: 'Monitoring Management',
    menuUsage: 'Y',
    path: ['0', '0010', '100', '0020', '10020'],
  },
  {
    level: 3,
    menuId: '1002010',
    menuName: 'Real-time Monitoring',
    menuUsage: 'Y',
    path: ['0', '0010', '100', '0020', '10020', '0010', '1002010'],
    programId: 'REALTIME_MON',
  },
  {
    level: 3,
    menuId: '1002020',
    menuName: 'Data Analysis',
    menuUsage: 'Y',
    path: ['0', '0010', '100', '0020', '10020', '0020', '1002020'],
    programId: 'DATA_ANALYSIS',
  },

  // Header: System
  {
    level: 1,
    menuId: '200',
    menuName: 'System',
    menuUsage: 'Y',
    path: ['0', '0020', '200'],
  },
  // System > 조직관리
  {
    level: 2,
    menuId: '20010',
    menuName: 'Organization Management',
    menuUsage: 'Y',
    path: ['0', '0020', '200', '0010', '20010'],
    programId: 'ORG_MGMT',
  },
  // System > 사용자 관리
  {
    level: 2,
    menuId: '20020',
    menuName: 'User Management',
    menuUsage: 'Y',
    path: ['0', '0020', '200', '0020', '20020'],
    programId: 'USER_MGMT',
  },
  // System > 기준 정보
  {
    level: 2,
    menuId: '20030',
    menuName: 'Standard Information',
    menuUsage: 'Y',
    path: ['0', '0020', '200', '0030', '20030'],
  },
  {
    level: 3,
    menuId: '2003010',
    menuName: 'Common Code Type',
    menuUsage: 'Y',
    path: ['0', '0020', '200', '0030', '20030', '0010', '2003010'],
    programId: 'CODE_TYPE',
  },
  {
    level: 3,
    menuId: '2003020',
    menuName: 'Common Code',
    menuUsage: 'Y',
    path: ['0', '0020', '200', '0030', '20030', '0020', '2003020'],
    programId: 'COMMON_CODE',
  },
  // System > 시스템 정보
  {
    level: 2,
    menuId: '20040',
    menuName: 'System Information',
    menuUsage: 'Y',
    path: ['0', '0020', '200', '0040', '20040'],
  },
  {
    level: 3,
    menuId: '2004010',
    menuName: 'Menu Management',
    menuUsage: 'Y',
    path: ['0', '0020', '200', '0040', '20040', '0010', '2004010'],
    programId: 'MENU_MGMT',
  },
  {
    level: 3,
    menuId: '2004020',
    menuName: 'Program Management',
    menuUsage: 'Y',
    path: ['0', '0020', '200', '0040', '20040', '0020', '2004020'],
    programId: 'PROG_MGMT',
  },
  {
    level: 3,
    menuId: '2004030',
    menuName: 'Authority Management',
    menuUsage: 'Y',
    path: ['0', '0020', '200', '0040', '20040', '0030', '2004030'],
    programId: 'AUTH_MGMT',
  },
  {
    level: 3,
    menuId: '2004040',
    menuName: 'Authority-Menu Mapping',
    menuUsage: 'Y',
    path: ['0', '0020', '200', '0040', '20040', '0040', '2004040'],
    programId: 'AUTH_MENU',
  },
  // System > 이력 정보
  {
    level: 2,
    menuId: '20050',
    menuName: 'History Information',
    menuUsage: 'Y',
    path: ['0', '0020', '200', '0050', '20050'],
  },
  {
    level: 3,
    menuId: '2005010',
    menuName: 'Login History',
    menuUsage: 'Y',
    path: ['0', '0020', '200', '0050', '20050', '0010', '2005010'],
    programId: 'LOGIN_HIST',
  },
  {
    level: 3,
    menuId: '2005020',
    menuName: 'System History',
    menuUsage: 'Y',
    path: ['0', '0020', '200', '0050', '20050', '0020', '2005020'],
    programId: 'SYS_HIST',
  },
  {
    level: 3,
    menuId: '2005030',
    menuName: 'Error History',
    menuUsage: 'Y',
    path: ['0', '0020', '200', '0050', '20050', '0030', '2005030'],
    programId: 'ERROR_HIST',
  },
];

// Helper functions
export const getHeaderMenus = (): IHeaderMenu[] =>
  MOCK_MENU_DATA.filter((m) => m.level === 1) as IHeaderMenu[];

export const getSideMenusByHeader = (headerId: string): ISideMenu[] =>
  MOCK_MENU_DATA.filter(
    (m) => (m.level === 2 || m.level === 3) && m.path.includes(headerId)
  ) as ISideMenu[];

export const getChildMenus = (parentId: string): ISideMenu[] =>
  MOCK_MENU_DATA.filter(
    (m) => m.level === 3 && m.path.includes(parentId)
  ) as ISideMenu[];

