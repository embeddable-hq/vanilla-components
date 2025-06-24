import { DataResponse } from '@embeddable.com/core';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import useFont from '../hooks/useFont';
import useResize, { Size } from '../hooks/useResize';
import Description from './Description';
import DownloadMenu from './DownloadMenu';
import Spinner from './Spinner';
import Title from './Title';
import { WarningIcon } from './icons';
import './index.css';
import { ContainerProps } from './Container.types';

export default ({
  children,
  className,
  childContainerClassName,
  onResize,
  setResizeState,
  ...props
}: PropsWithChildren<ContainerProps>) => {
  const refPrevHeight = useRef<number | null>(null);
  const refExportPNGElement = useRef<HTMLDivElement | null>(null);
  const refResize = useRef<HTMLDivElement | null>(null);
  const refResizingTimeout = useRef<number | null>(null);
  const { height } = useResize(refResize, onResize || null);
  const [preppingDownload, setPreppingDownload] = useState<boolean>(false);

  //Detect when the component is being resized by the user
  useEffect(() => {
    if (!setResizeState) {
      return;
    }
    const currentHeight = height;
    // If refPrevHeight is null, this is the first render, so initialize it
    if (refPrevHeight.current === null) {
      refPrevHeight.current = currentHeight;
    }
    if (currentHeight !== refPrevHeight.current) {
      setResizeState?.(true);
      // Clear the timeout if it exists, to debounce the resize state reset
      if (refResizingTimeout.current) {
        window.clearTimeout(refResizingTimeout.current);
      }
      // Set a timer to reset the resize state after 300ms
      refResizingTimeout.current = window.setTimeout(() => {
        setResizeState?.(false);
      }, 300);
    }
    // Update the previous height with the current height
    refPrevHeight.current = currentHeight;
    // Clean up the timeout when the component unmounts
    return () => {
      if (refResizingTimeout.current) {
        window.clearTimeout(refResizingTimeout.current);
      }
    };
  }, [height, setResizeState]); // Depend on height, so it runs whenever height changes

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
    <div className="h-full relative font-embeddable text-sm flex flex-col">
      {props.enableDownloadAsCSV || props.enableDownloadAsPNG ? (
        <div className={`${!props.title ? 'h-[32px] w-full' : ''}`}>
          {/* spacer to keep charts from overlaying download menu if no title*/}
        </div>
      ) : null}
      <Spinner show={isLoading || preppingDownload} />
      <div className="h-full relative flex flex-col" ref={refExportPNGElement}>
        <Title title={props.title} />
        <Description description={props.description} />

        <div ref={refResize} className={twMerge(`relative grow flex flex-col`, className || '')}>
          <div
            className={twMerge('-z-0 flex flex-col', childContainerClassName || '')}
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
      {!isLoading && (props.enableDownloadAsCSV || props.enableDownloadAsPNG) ? (
        <DownloadMenu
          csvOpts={{
            chartName: props.title || 'chart',
            props: {
              ...props,
              results: props.results,
              prevResults: props.prevResults,
            },
          }}
          downloadAllFunction={props.downloadAllFunction}
          enableDownloadAsCSV={props.enableDownloadAsCSV}
          enableDownloadAsPNG={props.enableDownloadAsPNG}
          pngOpts={{ chartName: props.title || 'chart', element: refExportPNGElement.current }}
          preppingDownload={preppingDownload}
          setPreppingDownload={setPreppingDownload}
        />
      ) : null}
    </div>
  );
};
