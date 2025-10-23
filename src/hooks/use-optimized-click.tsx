import { useCallback } from 'react';

/**
 * Hook to optimize click handlers and prevent INP (Interaction to Next Paint) issues
 * by deferring heavy operations and allowing the UI to update immediately
 */
export function useOptimizedClick<T extends (...args: any[]) => any>(
  callback: T | undefined,
  options: { immediate?: boolean } = {}
): T | undefined {
  const optimizedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (!callback) return;

      // If immediate is true, execute synchronously (for critical interactions)
      if (options.immediate) {
        return callback(...args);
      }

      // For non-critical interactions, defer execution to prevent blocking
      // This allows the browser to paint the UI changes first
      requestAnimationFrame(() => {
        setTimeout(() => {
          callback(...args);
        }, 0);
      });
    },
    [callback, options.immediate]
  ) as T;

  return callback ? optimizedCallback : undefined;
}
