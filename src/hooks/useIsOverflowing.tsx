import { MutableRefObject, useLayoutEffect, useState } from 'react';

export const useIsOverflowing = (ref: MutableRefObject<HTMLElement | undefined>) => {
  const [isOverflow, setIsOverflow] = useState(false);

  useLayoutEffect(() => {
    const { current } = ref;
    const trigger = () => {
      const hasOverflow = current!.scrollHeight > current!.clientHeight;
      setIsOverflow(hasOverflow);
    };

    if (current) {
      trigger();
    }
  }, [ref]);

  return isOverflow;
};
