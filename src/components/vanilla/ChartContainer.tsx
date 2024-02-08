import { DataResponse } from '@embeddable.com/react';
import React, { ReactNode, useRef } from 'react';

import useResize from '../hooks/useResize';
import Spinner from './Spinner';
import Title from './Title';
import { WarningIcon } from './icons';

type Props = {
  title?: string;
  results?: DataResponse;
  children?: ReactNode;
};

export default (props: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, height] = useResize(ref);

  const { results, title, children } = props;
  const { isLoading, error, data } = results || {};

  const noData = !isLoading && !data?.length;

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
      <div className="relative grow" ref={ref} style={{ height: `${height}px` }}>
        {children}
        {results?.isLoading && !results?.data?.length && (
          <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
        )}
      </div>
    </div>
  );
};
