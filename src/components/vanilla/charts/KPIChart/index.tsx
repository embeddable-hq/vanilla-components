import React, { useMemo, useEffect } from 'react';
import { Measure } from '@embeddable.com/core';
import { DataResponse } from '@embeddable.com/react';

import useFont from '../../../hooks/useFont';

import '../../index.css';
import Title from '../../Title';
import Spinner from '../../Spinner';
import { WarningIcon } from '../../icons';

type Props = {
  title?: string;
  value: DataResponse;
  metric: Measure;
  suffix?: string;
  prefix?: string;
};

export default (props: Props) => {
  useFont();

  useEffect(() => {
    console.log('KPIChart props', props);
  }, [props]);

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
      <div className="h-full flex items-center justify-center">
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{props.value?.error}</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-start">
      <Title title={props.title} />
      <div className="relative grow items-center justify-center flex">
        <div className="flex items-center justify-center font-futura text-[#333942] text-[48px] font-bold">
          {props.prefix}
          {n}
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
