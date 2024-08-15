import { useLayoutEffect, useState, useRef, MutableRefObject, useCallback } from 'react';
import throttle from 'lodash.throttle';

type ResizeOptions = {
  delay?: number;
}

export type Size = {
  width: number;
  height: number;
}

const useResize = (
  target: MutableRefObject<HTMLDivElement | null>,
  callback: ((size: Size) => void) | null,
  options: ResizeOptions = {}
): Size => {
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const callbackRef = useRef(callback);

  const resizeHandler = useCallback((entries: ResizeObserverEntry[]) => {
    if (entries[0]?.contentRect) {
      const actualSize = {
        width: entries[0]?.contentRect.width,
        height: entries[0]?.contentRect.height,
      }

      setSize(actualSize);

      callbackRef.current?.(actualSize);
    }
  }, [callbackRef]);

  useLayoutEffect(() => {
    const targetElement = target && 'current' in target ? target.current : target;

    if (!targetElement) {
      return;
    }

    resizeObserver.current = new ResizeObserver(throttle(resizeHandler, options?.delay ?? 200));
    resizeObserver.current.observe(targetElement);

    return () => {
      resizeObserver.current?.unobserve(targetElement);
    }
  }, [target, resizeHandler, options?.delay]);

  return size
};

export default useResize;