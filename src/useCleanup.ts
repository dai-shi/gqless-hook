import {
  useCallback,
  useEffect,
  useRef,
} from 'react';

// CM-safe timer-based cleanup hook
export const useCleanup = () => {
  type Cleanup = {
    timer: NodeJS.Timeout;
    func: () => void;
  };
  const cleanups = useRef<Cleanup[]>([]);
  const addCleanup = useCallback((func: () => void) => {
    const timer = setTimeout(func, 5 * 1000);
    cleanups.current.push({ timer, func });
  }, []);
  useEffect(() => {
    const cleanupsCurrent = cleanups.current;
    cleanupsCurrent.forEach(({ timer }) => clearTimeout(timer));
    return () => {
      cleanupsCurrent.forEach(({ func }) => func());
    };
  }, []);
  return addCleanup;
};
