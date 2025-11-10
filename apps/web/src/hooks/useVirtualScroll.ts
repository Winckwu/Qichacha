import { useState, useEffect, useRef, useMemo } from 'react';
import { calculateVisibleRange } from '@/lib/performance';

interface UseVirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

/**
 * Virtual scrolling hook for large lists
 * Only renders visible items for better performance
 */
export function useVirtualScroll<T>(
  items: T[],
  options: UseVirtualScrollOptions
) {
  const { itemHeight, containerHeight, overscan = 3 } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { start, end } = useMemo(
    () =>
      calculateVisibleRange(
        scrollTop,
        containerHeight,
        itemHeight,
        items.length,
        overscan
      ),
    [scrollTop, containerHeight, itemHeight, items.length, overscan]
  );

  const visibleItems = useMemo(
    () => items.slice(start, end).map((item, index) => ({
      item,
      index: start + index,
    })),
    [items, start, end]
  );

  const totalHeight = items.length * itemHeight;
  const offsetY = start * itemHeight;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    scrollToIndex: (index: number) => {
      if (containerRef.current) {
        containerRef.current.scrollTop = index * itemHeight;
      }
    },
  };
}
