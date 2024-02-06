import { DataResponse } from '@embeddable.com/react';
import React, { useMemo } from 'react';

import useFont from '../../../hooks/useFont';
import Spinner from '../../Spinner';
import Title from '../../Title';
import { WarningIcon } from '../../icons';
import '../../index.css';
import { Inputs } from './KPIChart.emb';

type Props = Inputs & {
  value: DataResponse;
};

export default (props: Props) => {
  useFont();

  const n = useMemo(() => {
    if (!props.value?.data?.length) return;

    if (!props.metric?.name) return;

    const n = props.value.data[0][props.metric?.name];

    const num = parseFloat(n);

    if (n !== `${num}`) return n;

    const formatter = new Intl.NumberFormat();

    return formatter.format(num);
  }, [props]);

  if (props.value?.error) {
    return (
      <div className="h-full flex items-center justify-center font-embeddable text-sm">
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{props.value?.error}</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-start font-embeddable text-sm">
      <Title title={props.title} />
      <div className="relative grow items-center justify-center flex min-h-[40px]">
        <div className="flex items-center justify-center font-embeddable text-[#333942] text-[40px] font-bold">
          {props.prefix}
          {n || 0}
          {props.suffix}
        </div>
        {props.value?.isLoading && !props.value?.data?.length && (
          <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
        )}
        <Spinner show={props.value?.isLoading} />
      </div>
    </div>
  );
};
