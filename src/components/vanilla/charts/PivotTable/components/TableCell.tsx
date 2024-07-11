import React, { PropsWithChildren } from 'react';
import cn from '../../../../util/cn';

type Props = {
  isHeader?: boolean;
  className?: string;
}

export default function TableCell({ isHeader, className, children }: PropsWithChildren<Props>) {
  const Cell = isHeader ? 'th' : 'td';

  return (
    <Cell
      className={cn('px-2 py-1.5 font-normal first:border-l bg-inherit', {
        'z-10 sticky left-0 text-left': isHeader,
      }, className)}
    >
      { children }
    </Cell>
  )
}