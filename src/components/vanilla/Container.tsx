import { DataResponse } from '@embeddable.com/core';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import useFont from '../hooks/useFont';
import useResize, { Size } from '../hooks/useResize';
import IconCheckbox from '../icons/Checkbox';
import Description from './Description';
import DownloadIcon from './DownloadIcon';
import Spinner from './Spinner';
import Title from './Title';
import { WarningIcon } from './icons';
import './index.css';

type Props = {
  childContainerClassName?: string;
  className?: string;
  description?: string;
  enableDownloadAsCSV?: boolean;
  enableDownloadAsPNG?: boolean;
  onResize?: (size: Size) => void;
  prevResults?: DataResponse;
  results?: DataResponse | DataResponse[];
  setResizeState?: (resizing: boolean) => void;
  title?: string;
};

export default ({
  children,
  className,
  childContainerClassName,
  onResize,
  setResizeState,
  ...props
}: PropsWithChildren<Props>) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const prevHeightRef = useRef<number | null>(null);
  const resizingTimeoutRef = useRef<number | null>(null);
  const pngExportRef = useRef<HTMLDivElement | null>(null);

  const { height } = useResize(ref, onResize || null);

  //Detect when the component is being resized by the user
  useEffect(() => {
    if (!setResizeState) {
      return;
    }
    const currentHeight = height;
    // If prevHeightRef is null, this is the first render, so initialize it
    if (prevHeightRef.current === null) {
      prevHeightRef.current = currentHeight;
    }
    if (currentHeight !== prevHeightRef.current) {
      setResizeState?.(true);
      // Clear the timeout if it exists, to debounce the resize state reset
      if (resizingTimeoutRef.current) {
        window.clearTimeout(resizingTimeoutRef.current);
      }
      // Set a timer to reset the resize state after 300ms
      resizingTimeoutRef.current = window.setTimeout(() => {
        setResizeState?.(false);
      }, 300);
    }
    // Update the previous height with the current height
    prevHeightRef.current = currentHeight;
    // Clean up the timeout when the component unmounts
    return () => {
      if (resizingTimeoutRef.current) {
        window.clearTimeout(resizingTimeoutRef.current);
      }
    };
  }, [height]); // Depend on height, so it runs whenever height changes

  const [preppingDownload, setPreppingDownload] = useState(false);
  const { isLoading, error, data } = Array.isArray(props.results)
    ? {
        isLoading: props.results.some((result) => result.isLoading),
        error: props.results.some((result) => result.error),
        data: props.results.flatMap((result) => result.data).filter((data) => data),
      }
    : props.results || {};
  const noData = !isLoading && !data?.length;

  useFont();

  return (
    <div className="h-full relative font-embeddable text-sm flex flex-col" ref={pngExportRef}>
      {props.enableDownloadAsCSV || props.enableDownloadAsPNG ? (
        <div className="flex items-center justify-end space-x-2">
          <IconCheckbox />
        </div>
      ) : null}

      {props.enableDownloadAsCSV ? (
        <div className={`${!props.title ? 'h-[40px] w-full' : ''}`}>
          <DownloadIcon
            props={props}
            show={data && data.length > 0 && !isLoading && !preppingDownload}
            setPreppingDownload={setPreppingDownload}
            type="csv"
          />
        </div>
      ) : null}
      {props.enableDownloadAsPNG ? (
        <div className={`${!props.title ? 'h-[40px] w-full' : ''}`}>
          <DownloadIcon
            element={pngExportRef.current}
            props={props}
            show={data && data.length > 0 && !isLoading && !preppingDownload}
            setPreppingDownload={setPreppingDownload}
            type="png"
          />
        </div>
      ) : null}

      <Spinner show={isLoading || preppingDownload} />
      <Title title={props.title} />
      <Description description={props.description} />

      <div ref={ref} className={twMerge(`relative grow flex flex-col`, className || '')}>
        <div
          className={twMerge('flex flex-col', childContainerClassName || '')}
          style={{ height: `${height}px` }}
        >
          {
            height && props.results && (error || noData) ? (
              <div className="h-full flex items-center justify-center font-embeddable text-sm">
                <WarningIcon />
                <div className="whitespace-pre-wrap p-4 max-w-sm text-sm">
                  {error || '0 results'}
                </div>
              </div>
            ) : height ? (
              children
            ) : null // Ensure height is calculated before rendering charts to prevent libraries (e.g., ChartJS) from overflowing the container
          }
        </div>
        {isLoading && !data?.length && (
          <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
        )}
      </div>
    </div>
  );
};
