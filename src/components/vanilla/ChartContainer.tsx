import React from 'react';
import React, { useRef } from 'react';
import useResize from '../hooks/useResize';
import Loading from '../util/Loading'
import Error from '../util/Error'
import { WarningIcon } from './icons';
import Spinner from './Spinner';
import Title from './Title';


type Props = {
  title?: string;
  results?: DataResponse; // { isLoading, error, data: [{ <name>: <value>, ... }] }
  children?: JSX.Element;
};

export default (props: Props) => {

  const ref = useRef<HTMLDivElement | null>(null);
  const [width, height] = useResize(ref);

  const { results, title, children } = props;
  const { isLoading, error } = results;

  if (results?.error) {
    return (
      <div className="h-full flex items-center justify-center font-embeddable text-sm">
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{results.error}</div>
      </div>
    );
  }

  return (
    <div className="h-full relative font-embeddable text-sm flex flex-col">
      <Spinner show={isLoading}/>
      <Title title={title} />
      <div className="relative grow" ref={ref} style={{height: height+'px'}}>
        {children}
        {results?.isLoading && !results?.data?.length && (
          <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
        )}
      </div>
    </div>
  );
};
