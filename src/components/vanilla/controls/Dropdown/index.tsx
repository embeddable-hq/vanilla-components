import { Dimension } from '@embeddable.com/core';
import { DataResponse } from '@embeddable.com/react';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import useFont from '../../../hooks/useFont';

import '../../index.css';
import Title from '../../Title';
import Spinner from '../../Spinner';
import { ChevronDown, ClearIcon } from '../../icons';

type Props = {
  title?: string;
  defaultValue: string;
  options: DataResponse;
  property: Partial<Dimension>;
  onChange: (v: any) => void;
};

export default (props: Props) => {
  const [search, setSearch] = useState('');
  const [focus, setFocus] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);
  const [triggerBlur, setTriggerBlur] = useState(false);
  const [value, setValue] = useState(props.defaultValue);

  useFont();

  useEffect(() => {
    setValue(props.defaultValue);
  }, [props.defaultValue]);

  useLayoutEffect(() => {
    if (!triggerBlur) return;

    setTriggerBlur(false);
    setTimeout(setFocus, 100, false);
  }, [triggerBlur]);

  const list = useMemo(
    () =>
      props.options?.data?.reduce((memo, o, i: number) => {
        if (
          search &&
          `${o[props.property?.name || '']}`?.toLowerCase().indexOf(search.toLowerCase()) !== 0
        ) {
          return memo;
        }

        memo.push(
          <div
            key={i}
            onClick={() => {
              setSearch('');
              setValue(o[props.property?.name || '']);
              props.onChange(o[props.property?.name || '']);
            }}
            className="px-3 py-2 hover:bg-black/5 cursor-pointer"
          >
            {o[props.property?.name || '']}
          </div>
        );

        return memo;
      }, []),
    [props, search]
  );

  return (
    <div className="dropdown relative w-full">
      <Title title={props.title} />
      <div className="relative rounded-xl w-full h-10 border border-[#DADCE1] mb-2">
        <input
          ref={ref}
          value={search}
          placeholder="Select..."
          onFocus={() => setFocus(true)}
          onBlur={() => setTriggerBlur(true)}
          onChange={(e) => setSearch(e.target.value)}
          className="outline-none bg-transparent leading-10 h-10 border-0 px-3 w-full"
        />

        {!!value && (
          <span
            className={`absolute w-[calc(100%-2rem)] rounded-xl left-3 top-1 h-8 leading-8 block pointer-events-none bg-white ${
              focus ? 'hidden' : ''
            }`}
          >
            {value}
          </span>
        )}

        {focus && (
          <div className="flex flex-col bg-white rounded-xl absolute top-11 z-10 border border-[#DADCE1] w-full">
            {list}
            {list.length === 0 && !!search && (
              <div className="px-3 py-2 text-black/50 italic cursor-pointer text-xs">
                No results
              </div>
            )}
          </div>
        )}

        {props.options.isLoading ? (
          <Spinner show className="absolute right-4 top-2.5 z-10" />
        ) : (
          <ChevronDown className="absolute right-4 top-2.5 z-10" />
        )}

        {!!value && (
          <div
            onClick={() => {
              setValue('');
              setSearch('');
              props.onChange('');
              ref.current?.focus();
            }}
            className="absolute right-10 top-0 h-10 flex items-center z-10 cursor-pointer"
          >
            <ClearIcon />
          </div>
        )}
      </div>
    </div>
  );
};
