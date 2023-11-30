import React from 'react';

import '../index.css';

type Data = {
  error?: string;
  isLoading: boolean;
  data?: any[];
};

type DimensionOrMeasure = {
  name: string;
  title: string;
  description: string | null;
};

type Props = {
  title: string;
  value: Data;
  property: DimensionOrMeasure;
};

export default (props: Props) => {
  return (
    <div>
      {!!props.title && (
        <h2 className="text-[#333942] text-[14px] font-bold justify-start flex mb-8">
          {props.title}
        </h2>
      )}
      <div className="relative">
        <div className="flex items-center justify-center font-futura text-[#333942] text-[48px] font-bold">$ 99.99</div>
        {props.value?.isLoading && (
          <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
        )}
      </div>
    </div>
  );
};
