import { DataResponse, useEmbeddableState } from '@embeddable.com/react';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { twMerge } from 'tailwind-merge';

import useFont from '../../../hooks/useFont';
import Spinner from '../../Spinner';
import Title from '../../Title';
import { ChevronDown, ClearIcon, WarningIcon } from '../../icons';
import '../../index.css';
import { Inputs } from './Dropdown.emb';

type Props = Inputs & {
  icon?: ReactNode;
  className?: string;
  options: DataResponse;
  unclearable?: boolean;
  inputClassName?: string;
  onChange: (v: any) => void;
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

  useEffect(() => {
    setValue(props.defaultValue);
  }, [props.defaultValue]);

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
            className={`min-h-[36px] px-3 py-2 hover:bg-black/5 cursor-pointer font-normal ${
              value === o[props.property?.name || ''] ? 'bg-black/5' : ''
            } whitespace-nowrap overflow-hidden text-ellipsis`}
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
      <div className="h-full flex items-center justify-center font-embeddable text-sm">
        <WarningIcon />
        <div className="whitespace-pre-wrap px-2 max-h-full overflow-hidden max-w-sm text-xs">
          {props.options?.error}
        </div>
      </div>
    );
  }

  return (
    <div
      className={twMerge(`dropdown font-embeddable text-sm relative w-full`, props.className || '')}
    >
      <Title title={props.title} />
      <div
        className={twMerge(
          'relative rounded-xl w-full h-10 border border-[#DADCE1] flex items-center',
          props.inputClassName
        )}
      >
        <input
          ref={ref}
          value={search}
          name="dropdown"
          placeholder={props.placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setTriggerBlur(true)}
          onChange={(e) => performSearch(e.target.value)}
          className="outline-none bg-transparent leading-9 h-9 border-0 px-3 w-full cursor-pointer text-sm"
        />

        {!!value && (
          <span
            className={`absolute w-[calc(100%-2rem)] rounded-xl left-3 top-1 h-8 leading-8 block pointer-events-none bg-white text-sm ${
              focus ? 'hidden' : ''
            }`}
          >
            {value}
          </span>
        )}

        {focus && (
          <div className="flex flex-col bg-white rounded-xl absolute top-11 z-50 border border-[#DADCE1] w-full overflow-y-auto overflow-x-hidden max-h-[400px]">
            {list}
            {list?.length === 0 && !!search && (
              <div className="px-3 py-2 text-black/50 italic cursor-pointer">No results</div>
            )}
          </div>
        )}

        {props.options.isLoading ? (
          <Spinner show className="absolute right-2 top-2 z-1 pointer-events-none" />
        ) : (
          <ChevronDown className="absolute right-2.5 top-2.5 z-1 pointer-events-none" />
        )}

        {!props.unclearable && !!value && (
          <div
            onClick={() => {
              set('');
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
