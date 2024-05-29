import { DataResponse } from '@embeddable.com/core';
import React, { ReactNode, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import useFont from '../hooks/useFont';
import useResize from '../hooks/useResize';
import Spinner from './Spinner';
import DownloadIcon from './DownloadIcon';
import Title from './Title';
import Description from './Description';
import { WarningIcon } from './icons';
import './index.css';

type Props = {
  children?: ReactNode;
  description?: string;
  className?: string;
  title?: string;
  results?: DataResponse;
  enableDownloadAsCSV?: boolean;
}

export default ({ children, className, ...props }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, height] = useResize(ref);
  const [preppingDownload, setPreppingDownload] = useState(false);
  const { isLoading, error, data } = props.results || {};
  const noData = props.results && !isLoading && !data?.length;

  useFont();

  if (error || noData) {
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
              show={data?.length > 0 && !isLoading && !preppingDownload}
              setPreppingDownload={setPreppingDownload}
            />
          </div>
        )
        : null
      }

      <Spinner show={isLoading || preppingDownload} />
      <Title title={props.title} />
      <Description description={props.description} />
      <div className={twMerge(`relative grow flex flex-col`, className || '')} ref={ref}>
        {!!height && (
          <div className="flex flex-col" style={{ height: `${height}px` }}>
            {children}
          </div>
        )}
        {props.results?.isLoading && !props.results?.data?.length && (
          <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
        )}
      </div>
    </div>
  );
};
