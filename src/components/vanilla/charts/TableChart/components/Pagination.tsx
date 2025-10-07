import React from 'react';

import cn from '../../../../util/cn';
import { ChevronLeft, ChevronRight } from '../../../icons';

type Props = {
  currentPage: number;
  hasNextPage: boolean;
  onPageChange?: (page: number) => void;
};

const Pagination = ({ currentPage, hasNextPage, onPageChange }: Props) => (
  <div className="flex items-center justify-center text-[12px] font-bold text-[#333942] select-none sticky left-0">
    <ChevronLeft
      className={cn(
        'cursor-pointer hover:bg-black/10 rounded-full w-8 h-8 p-1 border border-[#DADCE1] flex items-center justify-center',
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
      className={`cursor-pointer hover:bg-black/10 rounded-full w-8 h-8 p-1 border border-[#DADCE1] flex items-center justify-center ${
        !hasNextPage ? 'opacity-50 pointer-events-none' : ''
      }`}
      onClick={() => {
        onPageChange?.(currentPage + 1);
      }}
    />
  </div>
);

export default Pagination;
