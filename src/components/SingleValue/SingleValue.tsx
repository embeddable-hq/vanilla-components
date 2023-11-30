import React, { useMemo } from 'react';

import '../index.css';

type Data = {
  error?: string;
  isLoading: boolean;
  data?: any[];
};

type Measure = {
  name: string;
  title: string;
  description: string | null;
};

type Props = {
  title?: string;
  value: Data;
  property: Measure;
  suffix?: string;
  prefix?: string;
};

export default (props: Props) => {
  const n = useMemo(() => {
    if (!props.value?.data?.length) return;

    if (!props.property?.name) return;

    const n = props.value.data[0][props.property?.name];

    const num = parseFloat(n);

    if (n !== `${num}`) return n;

    const formatter = new Intl.NumberFormat();

    return formatter.format(num);
  }, [props]);

  return (
    <div className="h-full flex flex-col justify-start">
      {!!props.title && (
        <h2 className="text-[#333942] text-[14px] font-bold justify-start flex mb-8">
          {props.title}
        </h2>
      )}
      <div className="relative grow items-center justify-center flex">
        <div className="flex items-center justify-center font-futura text-[#333942] text-[48px] font-bold">
          {props.prefix}
          {n}
          {props.suffix}
        </div>
        {props.value?.isLoading && (
          <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
        )}
      </div>
    </div>
  );
};
