/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

