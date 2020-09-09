import { useState, useEffect } from "react";

/**
 * Debounce hook.
 * @param value The value to be debounced.
 * @param delay The duration to wait for any more changes before returning a value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
