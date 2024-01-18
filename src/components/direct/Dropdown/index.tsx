import { Dimension } from '@embeddable.com/core';
import { DataResponse, useEmbeddableState } from '@embeddable.com/react';
import React, { ReactNode, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import useFont from '../../../hooks/useFont';

import { WarningIcon } from '../../vanilla/icons';
import '../../vanilla/index.css';

import Spinner from '../Spinner';
import { ChevronDown } from '../icons';

type Props = {
  title?: string;
  icon?: ReactNode;
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  options: DataResponse;
  unclearable?: boolean;
  inputClassName?: string;
  onChange: (v: any) => void;
  property: Partial<Dimension>;
  searchProperty?: string;
};

let debounce: number | undefined = undefined;

export default (props: Props) => {
  const [focus, setFocus] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);
  const [triggerBlur, setTriggerBlur] = useState(false);
  const [value, setValue] = useState(props.defaultValue);
  const [search, setSearch] = useState('');
  const [_, setServerSearch] = useEmbeddableState({
    [props.searchProperty || 'search']: ''
  }) as any;

  useFont();

  const performSearch = useCallback(
    (newSearch: string) => {
      setSearch(newSearch);

      clearTimeout(debounce);

      debounce = setTimeout(() => {
        setServerSearch((s: any) => ({ ...s, [props.searchProperty || 'search']: newSearch }));
      }, 500) as any;
    },
    [setSearch, setServerSearch]
  );

  const set = useCallback(
    (value: string) => {
      performSearch('');

      setValue(value);

      props.onChange(value);

      clearTimeout(debounce);
    },
    [setValue, props.onChange, setSearch, performSearch]
  );

  useLayoutEffect(() => {
    if (!triggerBlur) return;

    const timeout = setTimeout(() => {
      setFocus(false);
      setTriggerBlur(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [triggerBlur]);

  const list = useMemo(
    () =>
      props.options?.data?.reduce((memo, o, i: number) => {
        memo.push(
          <div
            key={i}
            onClick={() => {
              setFocus(false);
              setTriggerBlur(false);
              set(o[props.property?.name || ''] || '');
            }}
            className={`px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer font-normal ${
              value === o[props.property?.name || ''] ? 'bg-black/5' : ''
            } whitespace-nowrap overflow-hidden text-ellipsis`}
            title={o[props.property?.name || ''] || ''}
          >
            {o[props.property?.name || '']}
          </div>
        );

        return memo;
      }, []),
    [props, value, set]
  );

  if (props.options?.error) {
    return (
      <div className="h-full flex items-center justify-center font-embeddable text-sm dark:text-[#ccc] text-[#333942]">
        <WarningIcon />
        <div className="whitespace-pre-wrap px-2 max-h-full overflow-hidden max-w-sm text-xs">
          {props.options?.error}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`dropdown dark:text-white font-embeddable text-xs p-1 ${
        props.className || 'relative w-full'
      }`}
    >
      <div
        className={
          props.inputClassName ||
          'relative rounded bg-white dark:bg-[#353535] w-full h-8 border border-[#DADCE1] dark:border-white/10 flex items-center'
        }
      >
        <input
          ref={ref}
          value={search}
          type="text"
          name="dropdown"
          autoComplete="none"
          aria-autocomplete="none"
          placeholder={props.placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setTriggerBlur(true)}
          onChange={(e) => performSearch(e.target.value)}
          className="outline-none bg-transparent leading-8 h-full border-0 px-3 w-full cursor-pointer text-xs"
        />

        {!!value && (
          <span
            className={`items-center absolute w-[calc(100%-1.8rem)] rounded left-0 top-1 h-6 leading-6 block pointer-events-none bg-white dark:bg-[#333] text-xs overflow-hidden pl-3 ${
              focus ? 'hidden' : 'flex'
            }`}
          >
            {props.icon}
            <span className="overflow-hidden text-ellipsis">
              {
                props.options?.data?.find((d) => d[props.property?.name || ''] === value)?.[
                  props.property?.name || ''
                ]
              }
            </span>
          </span>
        )}

        {focus && (
          <div className="flex flex-col bg-white dark:bg-[#333] rounded absolute top-9 z-50 border border-[#DADCE1] dark:border-white/10 w-full overflow-hidden">
            {list}
            {list?.length === 0 && !!search && (
              <div className="px-3 py-2 text-black/50 italic cursor-pointer">No results</div>
            )}
          </div>
        )}

        {!props.options || props.options.isLoading ? (
          <Spinner show className="absolute right-3 top-[7px] z-1 pointer-events-none w-4" />
        ) : (
          <ChevronDown className="absolute right-3.5 top-3 z-1 pointer-events-none text-[#444] dark:text-[#BDBDBD]" />
        )}
      </div>
    </div>
  );
};
