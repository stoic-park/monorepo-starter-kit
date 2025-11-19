import React from 'react';
import Header from '../components/semes/Header';
import TabMenu from '../components/semes/TabMenu';
import Sidebar from '../components/semes/Sidebar';
import Frame from '../components/semes/Frame';
import { ITabMenu, ISideMenu } from '../types/menu';
import { getHeaderMenus } from '../data/mockMenu';
import { useTabManager, useToggle, useLocalStorage } from '../hooks';

const WorkspaceHome: React.FC = () => {
  // Header 선택 상태 (LocalStorage 저장)
  const [selectedHeaderId, setSelectedHeaderId] = useLocalStorage(
    'workspace-selected-header',
    getHeaderMenus()[0]?.menuId || '100'
  );

  // Tab 관리 (커스텀 훅)
  const { tabs, activeTab, addTab, removeTab, selectTab } =
    useTabManager<ITabMenu>();

  // Sidebar 열림/닫힘 상태 (LocalStorage 저장)
  const [sidebarOpen, toggleSidebar] = useToggle(true);

  // Header 선택 핸들러
  const handleHeaderSelect = (headerId: string) => {
    setSelectedHeaderId(headerId);
  };

  // 메뉴 선택 핸들러
  const handleMenuSelect = (menu: ISideMenu) => {
    // Only open tabs for menus with programId
    if (!menu.programId) return;

    // 탭 추가 (중복 시 활성화만)
    const newTab: ITabMenu = {
      ...menu,
      isActive: true,
    };
    addTab(newTab);
  };

  // Tab 선택 핸들러
  const handleTabSelect = (menuId: string) => {
    selectTab(menuId);
  };

  // Tab 닫기 핸들러
  const handleTabClose = (menuId: string) => {
    removeTab(menuId);
  };

  // Sidebar 토글 핸들러
  const handleToggleSidebar = () => {
    toggleSidebar();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <Header
        selectedHeaderId={selectedHeaderId}
        onHeaderSelect={handleHeaderSelect}
      />

      {/* Tab Menu */}
      <TabMenu
        tabs={tabs}
        activeTabId={activeTab?.menuId || ''}
        onTabSelect={handleTabSelect}
        onTabClose={handleTabClose}
        onToggleSidebar={handleToggleSidebar}
        sidebarOpen={sidebarOpen}
      />

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          headerMenuId={selectedHeaderId}
          onMenuSelect={handleMenuSelect}
          activeMenuId={activeTab?.menuId || ''}
          isOpen={sidebarOpen}
        />

        {/* Frame (Main Content) */}
        <Frame activeTab={activeTab} />
      </div>
    </div>
  );
};

export default WorkspaceHome;
