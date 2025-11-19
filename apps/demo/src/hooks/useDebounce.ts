import { useState, useEffect } from 'react';

/**
 * Debounce 훅 - 값 변경을 지연시켜 성능 최적화
 *
 * @param value 디바운스할 값
 * @param delay 지연 시간 (ms)
 * @returns 디바운스된 값
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   // API 호출은 500ms 후에만 실행
 *   if (debouncedSearchTerm) {
 *     fetchSearchResults(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 타이머 설정
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: 다음 effect 실행 전 타이머 제거
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

