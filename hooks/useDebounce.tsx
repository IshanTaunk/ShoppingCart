import { useState, useEffect } from 'react';

export const useDebounce = (
  inputValue: string,
  delay: number = 500,
): string => {
  const [debouncedVal, setDebouncedVal] = useState(inputValue);

  useEffect(() => {
    // Treat all string transitions (including clearing out to "") exactly the same
    const timer = setTimeout(() => {
      setDebouncedVal(inputValue);
    }, delay);

    // This cleanup function is vital; it cancels the timer if inputValue 
    // changes again before the delay finishes.
    return () => clearTimeout(timer);
  }, [inputValue, delay]);

  return debouncedVal;
};