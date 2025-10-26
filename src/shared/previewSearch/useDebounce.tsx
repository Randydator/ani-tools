import { useEffect, useMemo, useRef } from "react";
import { debounce } from "lodash";

// https://www.developerway.com/posts/debouncing-in-react 
const debounceTime: number = 1000

const useDebounce = (callback : () => void) => {
   const ref = useRef<() => void>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, debounceTime);
  }, []);

  return debouncedCallback;
};

export default useDebounce