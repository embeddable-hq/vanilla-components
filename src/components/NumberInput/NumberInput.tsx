import React, { useEffect, useState } from 'react';

import useFont from '../../hooks/useFont';

import '../index.css';
import { ClearIcon } from '../icons';

type Props = {
  title?: string;
  value: number;
  onChange: (v: any) => void;
};

export default (props: Props) => {
  const [value, setValue] = useState(`${props.value}`);

  useFont();

  useEffect(() => {
    setValue(`${props.value}`);
  }, [props.value]);

  return (
    <div className="w-full">
      {!!props.title && (
        <h2 className="text-[#333942] text-[14px] font-bold justify-start flex mb-8">
          {props.title}
        </h2>
      )}

      <div className="w-full relative rounded-xl bg-white border border-[#DADCE1] pr-8">
        <input
          type="number"
          className="rounded-xl w-full outline-none leading-10 h-10 border-0 px-3"
          onChange={(e) => {
            setValue(e.target.value);
            props.onChange(e.target.value);
          }}
          defaultValue={value}
        />
        <div
          onClick={() => {
            setValue('');
            props.onChange('');
          }}
          className="opacity-50 hover:opacity-100 absolute w-10 right-0 top-0 h-full cursor-pointer group flex items-center justify-center"
        >
          <ClearIcon />
        </div>
      </div>
    </div>
  );
};
