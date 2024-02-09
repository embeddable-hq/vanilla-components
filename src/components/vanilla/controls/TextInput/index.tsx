import React, { useEffect, useRef, useState } from 'react';

import Container from '../../Container';
import { ClearIcon } from '../../icons';
import { Inputs } from './TextInput.emb';

type Props = Inputs & {
  onChange: (v: string) => void;
};

let timeout: number | null = null;

export default (props: Props) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <Container title={props.title}>
      <div className="w-full relative rounded-xl bg-white border border-[#DADCE1] pr-8 h-10">
        <input
          ref={ref}
          placeholder={props.placeholder}
          className="rounded-xl w-full outline-none leading-10 h-full border-0 px-3"
          onChange={(e) => {
            setValue(e.target.value);
            if (timeout) {
              clearTimeout(timeout);
            }
            timeout = window.setTimeout(() => {
              props.onChange(e.target.value);
            }, 1000);
          }}
          defaultValue={value}
        />
        {!!value && (
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
        )}
      </div>
    </Container>
  );
};
