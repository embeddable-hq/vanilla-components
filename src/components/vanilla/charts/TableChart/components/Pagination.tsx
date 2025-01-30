import React from 'react';

import cn from '../../../../util/cn';
import { ChevronLeft, ChevronRight } from '../../../icons';
import { useOverrideConfig } from '@embeddable.com/react';
import { Theme } from '../../../../../themes/theme';
import defaultTheme from '../../../../../themes/defaulttheme';

type Props = {
  currentPage: number;
  hasNextPage: boolean;
  onPageChange?: (page: number) => void;
};

const Pagination = ({ currentPage, hasNextPage, onPageChange }: Props) => {
  // Get theme for use in component
  const overrides: { theme: Theme } = useOverrideConfig() as { theme: Theme };
  let { theme } = overrides;
  if (!theme) {
    theme = defaultTheme;
  }
  const fontSize = theme.font.size;
  const fontColorDark = theme.font.colorDark;
  return (
    <div
      className={`flex items-center justify-center text-[${fontSize}] font-bold text-[${fontColorDark}] select-none sticky left-0`}
    >
      <ChevronLeft
        className={cn(
          `cursor-pointer hover:bg-black/10 rounded-full w-8 h-8 p-1 border border-[${theme.borders.colors.primary}] flex items-center justify-center`,
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
        className={`cursor-pointer hover:bg-black/10 rounded-full w-8 h-8 p-1 border border-[${theme.borders.colors.primary}] flex items-center justify-center ${
          hasNextPage ? 'opacity-50 pointer-events-none' : ''
        }`}
        onClick={() => {
          onPageChange?.(currentPage + 1);
        }}
      />
    </div>
  );
};

export default Pagination;
