import { useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useThrottle(func: (...args: any[]) => Promise<void>) {
  const loading = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async function (...args: any[]) {
    if (loading.current) return;
    loading.current = true;
    try {
      await func(...args);
    } finally {
      loading.current = false;
    }
  };
}
