import { useState, useEffect } from "react";

/**
 * Delays updating a value until the user stops changing it.
 * Useful for search inputs — prevents firing a new API request on every keystroke.
 *
 * @param value   The raw value that changes frequently (e.g. what's typed in the search box)
 * @param delay   How many milliseconds to wait after the last change before updating (default 400ms)
 * @returns       The stabilized value, only updated after the user pauses typing
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Schedule an update after `delay` ms
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If `value` changes before the timer fires, cancel the previous timer
    // and restart — this is the core of debouncing
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
