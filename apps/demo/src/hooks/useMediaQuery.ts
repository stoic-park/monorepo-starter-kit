import { useState, useEffect } from 'react';

/**
 * 미디어 쿼리 훅 - 반응형 디자인 지원
 *
 * @param query 미디어 쿼리 문자열
 * @returns 미디어 쿼리 매칭 여부
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 *
 * return isMobile ? <MobileView /> : <DesktopView />;
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // SSR 대응
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);

    // 초기값 설정
    setMatches(media.matches);

    // 변경 감지 리스너
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 리스너 등록 (구형 브라우저 호환)
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      media.addListener(listener);
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}

// 헬퍼 함수들
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1025px)');
}

