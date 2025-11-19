import { useState, useCallback, useMemo } from 'react';

interface TabItem {
  menuId: string;
  [key: string]: any;
}

interface UseTabManagerReturn<T extends TabItem> {
  tabs: T[];
  activeTabId: string;
  activeTab: T | null;
  addTab: (tab: T) => void;
  removeTab: (menuId: string) => void;
  selectTab: (menuId: string) => void;
  clearTabs: () => void;
}

/**
 * Tab 관리 커스텀 훅
 *
 * @param initialTabs 초기 탭 목록
 * @returns Tab 관리 함수 및 상태
 *
 * @example
 * const { tabs, activeTab, addTab, removeTab, selectTab } = useTabManager();
 *
 * // 탭 추가 (중복 시 활성화만)
 * addTab({ menuId: '1', menuName: 'Tab 1' });
 *
 * // 탭 제거 (활성 탭이면 마지막 탭 활성화)
 * removeTab('1');
 *
 * // 탭 선택
 * selectTab('2');
 */
export function useTabManager<T extends TabItem>(
  initialTabs: T[] = []
): UseTabManagerReturn<T> {
  const [tabs, setTabs] = useState<T[]>(initialTabs);
  const [activeTabId, setActiveTabId] = useState<string>('');

  // 탭 추가 (중복 시 활성화만)
  const addTab = useCallback((tab: T) => {
    setTabs((prev) => {
      const exists = prev.find((t) => t.menuId === tab.menuId);

      if (exists) {
        // 이미 존재하면 추가하지 않음
        setActiveTabId(tab.menuId);
        return prev;
      }

      // 새 탭 추가
      return [...prev, tab];
    });

    setActiveTabId(tab.menuId);
  }, []);

  // 탭 제거
  const removeTab = useCallback(
    (menuId: string) => {
      setTabs((prev) => {
        const newTabs = prev.filter((t) => t.menuId !== menuId);

        // 닫는 탭이 활성 탭이면 마지막 탭 활성화
        if (activeTabId === menuId) {
          if (newTabs.length > 0) {
            setActiveTabId(newTabs[newTabs.length - 1].menuId);
          } else {
            setActiveTabId('');
          }
        }

        return newTabs;
      });
    },
    [activeTabId]
  );

  // 탭 선택
  const selectTab = useCallback((menuId: string) => {
    setActiveTabId(menuId);
  }, []);

  // 모든 탭 제거
  const clearTabs = useCallback(() => {
    setTabs([]);
    setActiveTabId('');
  }, []);

  // 활성 탭 계산
  const activeTab = useMemo(
    () => tabs.find((t) => t.menuId === activeTabId) || null,
    [tabs, activeTabId]
  );

  return {
    tabs,
    activeTabId,
    activeTab,
    addTab,
    removeTab,
    selectTab,
    clearTabs,
  };
}

