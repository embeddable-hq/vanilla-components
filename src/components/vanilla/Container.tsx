import { DataResponse } from '@embeddable.com/core';
import React, { PropsWithChildren, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import useFont from '../hooks/useFont';
import useResize, { Size } from '../hooks/useResize';
import Spinner from './Spinner';
import DownloadIcon from './DownloadIcon';
import Title from './Title';
import Description from './Description';
import { WarningIcon } from './icons';
import './index.css';

type Props = {
  description?: string;
  className?: string;
  title?: string;
  results?: DataResponse | DataResponse[];
  enableDownloadAsCSV?: boolean;
  onResize?: (size: Size) => void;
}

export default ({ children, className, onResize, ...props }: PropsWithChildren<Props>) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const { height } = useResize(ref, onResize || null, { delay: 400 });

  const [preppingDownload, setPreppingDownload] = useState(false);
  const { isLoading, error, data } = Array.isArray(props.results) ? {
    isLoading: props.results.some((result) => result.isLoading),
    error: props.results.some((result) => result.error),
    data: props.results.flatMap((result) => result.data).filter((data) => data),
  } : props.results || {};
  const noData = !isLoading && !data?.length;
  
  useFont();

  if (props.results && (error || noData)) {
    return (
      <div className="h-full flex items-center justify-center font-embeddable text-sm">
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-sm">{error || '0 results'}</div>
      </div>
    );
  }

  return (
    <div className="h-full relative font-embeddable text-sm flex flex-col">

      {(props.enableDownloadAsCSV) 
        ? (
          <div className={`${!props.title ? 'h-[40px] w-full' : ''}`}>
            <DownloadIcon
              props={props}
              show={data && data.length > 0 && !isLoading && !preppingDownload}
              setPreppingDownload={setPreppingDownload}
            />
          </div>
        )
        : null
      }

      <Spinner show={isLoading || preppingDownload} />
      <Title title={props.title} />
      <Description description={props.description} />

      <div
        ref={ref}
        className={twMerge(`relative grow flex flex-col`, className || '')}
      >
        {!!height && (
          <div
            className="flex flex-col"
            style={{ height: `${height}px` }}
          >
            {children}
          </div>
        )}
        {isLoading && !data?.length && (
          <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
        )}
      </div>
    </div>
  );
};
