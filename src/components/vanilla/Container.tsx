import { DataResponse } from '@embeddable.com/react';
import React, { ReactNode, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

import useFont from '../hooks/useFont';
import useResize from '../hooks/useResize';
import Spinner from './Spinner';
import Title from './Title';
import { WarningIcon } from './icons';
import './index.css';

type Props = {
  title?: string;
  className?: string;
  results?: DataResponse;
  children?: ReactNode;
};

export default (props: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, height] = useResize(ref);
  const { results, title, children, className } = props;
  const { isLoading, error, data } = results || {};
  const noData = results && !isLoading && !data?.length;

  useFont();

  if (error || noData) {
    return (
      <div className="h-full flex items-center justify-center font-embeddable text-sm">
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{error || 'No data'}</div>
      </div>
    );
  }

  return (
    <div className="h-full relative font-embeddable text-sm flex flex-col">
      <Spinner show={isLoading} />
      <Title title={title} />
      <div className={twMerge(`relative grow flex flex-col`, className || '')} ref={ref}>
        {!!height && (
          <div className="flex flex-col" style={{ height: `${height}px` }}>
            {children}
          </div>
        )}
        {results?.isLoading && !results?.data?.length && (
          <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
        )}
      </div>
    </div>
  );
};
