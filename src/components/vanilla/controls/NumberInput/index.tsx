import React, { useEffect, useRef, useState } from 'react';

import useFont from '../../../hooks/useFont';

import '../../index.css';
import Title from '../../Title';
import { ClearIcon } from '../../icons';

type Props = {
  title?: string;
  value: number;
  onChange: (v: any) => void;
};

export default (props: Props) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(`${props.value}`);
  let timeout = null;

  useFont();

  useEffect(() => {
    console.log('NumberInput props', props);
  }, [props]);

  useEffect(() => {
    setValue(`${props.value}`);
  }, [props.value]);

  return (
    <div className="w-full">
      <Title title={props.title} />

      <div className="w-full relative rounded-xl bg-white border border-[#DADCE1] pr-8">
        <input
          ref={ref}
          type="number"
          className="rounded-xl w-full outline-none leading-10 h-10 border-0 px-3"
          onChange={(e) => {
            setValue(e.target.value);
            if(timeout) {
              clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
              props.onChange(e.target.value);
            }, 1000)
          }}
          defaultValue={value}
        />
        <div
          onClick={() => {
            setValue('');
            props.onChange('');
            ref.current!.value = '';
            ref.current?.focus();
          }}
          className="opacity-50 hover:opacity-100 absolute w-10 right-0 top-0 h-full cursor-pointer group flex items-center justify-center"
        >
          <ClearIcon />
        </div>
      </div>
    </div>
  );
};
