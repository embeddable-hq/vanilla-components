import React, { PropsWithChildren } from 'react';
import cn from '../../../../util/cn';

type Props = {
  isHeader?: boolean;
  className?: string;
  level?: number;
}

export default function TableCell({ isHeader, className, level = 0, children }: PropsWithChildren<Props>) {
  const Cell = isHeader ? 'th' : 'td';

  return (
    <Cell
      className={cn('p-1.5 z-10 font-normal first:border-l', {
        'z-10 sticky left-0 bg-white': isHeader,
      }, className)}
      style={{ paddingLeft: `${Math.max(8, level * 20)}px` }}
    >
      { children }
    </Cell>
  )
}