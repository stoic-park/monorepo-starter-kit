import { useState, useCallback } from 'react';

/**
 * LocalStorage 상태 관리 훅
 *
 * @param key LocalStorage 키
 * @param initialValue 초기값
 * @returns [value, setValue]
 *
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 * setTheme('dark'); // LocalStorage에 자동 저장
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State를 LocalStorage에서 초기화
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // LocalStorage에 저장하는 함수
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // 함수형 업데이트 지원
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error saving localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

