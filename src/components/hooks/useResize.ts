import { MutableRefObject, useLayoutEffect, useState } from 'react';

export default (ref: MutableRefObject<HTMLDivElement | null>) => {
  const [width, setWidth] = useState<undefined | number>(undefined);
  const [height, setHeight] = useState<undefined | number>(undefined);

  useLayoutEffect(() => {
    const ro = new ResizeObserver((entries) => {
      if (entries[0]?.contentRect.width) {
        setWidth(entries[0]?.contentRect.width);
      }

      if (entries[0]?.contentRect.height) {
        setHeight(entries[0].contentRect.height);
      }
    });

    if (ref?.current) ro.observe(ref?.current);

    return () => {
      ro.disconnect();
    };
  }, [ref]);

  return [width, height];
};
