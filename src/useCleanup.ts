import {
  useCallback,
  useEffect,
  useRef,
} from 'react';

const useCleanupForLegacyMode = () => {
  type Cleanup = () => void;
  const cleanups = useRef<Cleanup[]>([]);
  const addCleanup = useCallback((func: () => void) => {
    cleanups.current.push(func);
  }, []);
  useEffect(() => {
    const cleanupsCurrent = cleanups.current;
    return () => {
      cleanupsCurrent.forEach((func) => func());
    };
  }, []);
  return addCleanup;
};

// CM-safe timer-based cleanup hook
const useCleanupForConcurrentMode = () => {
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

export const useCleanup = process.env.EXPERIMENTAL_USE_CLENAUP_FOR_CM
  ? useCleanupForConcurrentMode : useCleanupForLegacyMode;
