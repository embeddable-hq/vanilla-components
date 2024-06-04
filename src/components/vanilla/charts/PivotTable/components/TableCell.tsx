import React, { PropsWithChildren } from 'react';
import cn from 'classnames';

type Props = {
  isHeader?: boolean;
  className?: string;
}

export default function TableCell({ isHeader, className, children }: PropsWithChildren<Props>) {
  const Cell = isHeader ? 'th' : 'td';

  return (
    <Cell
      className={cn('text-sm p-2 z-10 font-normal first:border-l', {
        'z-10 sticky left-0 bg-white': isHeader,
      }, className)}
    >
      { children }
    </Cell>
  )
}