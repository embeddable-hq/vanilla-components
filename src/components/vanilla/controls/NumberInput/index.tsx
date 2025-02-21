import React, { useEffect, useRef, useState } from 'react';

import Container from '../../Container';
import { ClearIcon } from '../../icons';
import { Theme } from '../../../../themes/theme';
import { useTheme } from '@embeddable.com/react';

type Props = {
  onChange: (v: string) => void;
  value: number;
  title: string;
  placeholder: string;
};

export default (props: Props) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(`${props.value}`);
  let timeout: number | null = null;

  const theme: Theme = useTheme() as Theme;

  useEffect(() => {
    setValue(`${props.value}`);
  }, [props.value]);

  return (
    <Container title={props.title}>
      <div
        className={`
          bg-white
          border
          h-10
          pr-8
          relative
          w-full
          border-[color:--embeddable-controls-borders-colors-primary]
          rounded-[--embeddable-controls-borders-radius]
        `}
      >
        <input
          ref={ref}
          type="number"
          placeholder={props.placeholder}
          className={`
            border-0
            h-full
            leading-10
            outline-none
            px-3
            w-full
            rounded-[--embeddable-controls-borders-radius]
          `}
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
