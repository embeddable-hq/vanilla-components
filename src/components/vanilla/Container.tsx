import { DataResponse } from '@embeddable.com/core';
import React, { ReactNode, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import useFont from '../hooks/useFont';
import useResize from '../hooks/useResize';
import Spinner from './Spinner';
import DownloadButton from './DownloadButton';
import Title from './Title';
import { WarningIcon } from './icons';
import './index.css';

interface ContainerProps {
  title?: string;
  results?: DataResponse;
  enableDownloadAsCSV?: boolean;
}

interface ContainerFullProps extends ContainerProps {
    children?: ReactNode;
    className?: string;
}

const titlesByName = (props) => {
  const results = {};
  const extractTitle = input => {
    if(['measure', 'dimension'].includes(input?.__type__)) {
      results[input.name] = input.title;
    }
  }
  for (const [key, value] of Object.entries(props)) {
    if(Array.isArray(value)) {
      value.forEach(extractTitle)
    } else {
      extractTitle(value);
    }
  }
  return results;
}

export default ({ children, className, ...props }: ContainerFullProps) => {
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
            <DownloadButton
              data={data}
              prevData={props.prevResults?.data}
              show={data?.length > 0 && !isLoading && !preppingDownload}
              setPreppingDownload={setPreppingDownload}
              titlesByName={titlesByName(props)}
            />
          </div>
        )
        : null
      }

      <Spinner show={isLoading || preppingDownload} />
      <Title title={props.title} />
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
