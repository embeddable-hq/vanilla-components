import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';

type Props = {
  isHeader?: boolean;
  className?: string;
}

export default function TableCell({ isHeader, className, children }: PropsWithChildren<Props>) {
  const Cell = isHeader ? 'th' : 'td';

  return (
    <Cell
      className={clsx('text-sm p-2 z-10 font-normal first:border-l', {
        'z-10 sticky left-0 bg-white': isHeader,
      }, className)}
    >
      { children }
    </Cell>
  )
}