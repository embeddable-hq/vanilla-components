import React from 'react';

import cn from '../../../../util/cn';
import { ChevronLeft, ChevronRight } from '../../../icons';

type Props = {
  currentPage: number;
  hasNextPage: boolean;
  onPageChange?: (page: number) => void;
};

const Pagination = ({ currentPage, hasNextPage, onPageChange }: Props) => {
  return (
    <div
      className={`
        flex
        items-center
        justify-center
        left-0
        select-none
        sticky
        font-[--embeddable-font-bold]
        text-[color:--embeddable-font-colorDark]
        text-[size:--embeddable-font-size]
      `}
    >
      <ChevronLeft
        className={cn(
          `
            border
            cursor-pointer
            flex
            h-8
            hover:bg-black/10
            items-center
            justify-center
            p-1
            w-8
            border-[color:--embeddable-controls-borders-colors-lightGray]
            rounded-[--embeddable-controls-buttons-radius]
          `,
          {
            'opacity-50 pointer-events-none': currentPage === 0,
          },
        )}
        onClick={() => {
          onPageChange?.(currentPage - 1);
        }}
      />

      <span className="mx-4">Page {currentPage + 1}</span>

      <ChevronRight
        className={`
          border
          cursor-pointer
          flex
          h-8
          hover:bg-black/10
          items-center
          justify-center
          p-1
          w-8
          border-[color:--embeddable-controls-borders-colors-lightGray]
          rounded-[--embeddable-controls-buttons-radius]
          ${hasNextPage ? 'opacity-50 pointer-events-none' : ''}
        `}
        onClick={() => {
          onPageChange?.(currentPage + 1);
        }}
      />
    </div>
  );
};

export default Pagination;
