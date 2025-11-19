import { useState, useCallback } from 'react';

/**
 * Toggle 상태 관리 훅
 *
 * @param initialValue 초기값 (기본: false)
 * @returns [value, toggle, setValue]
 *
 * @example
 * const [isOpen, toggleOpen, setIsOpen] = useToggle(false);
 * <button onClick={toggleOpen}>Toggle</button>
 * <button onClick={() => setIsOpen(true)}>Open</button>
 */
export function useToggle(
  initialValue = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  return [value, toggle, setValue];
}

