import { DataResponse } from '@embeddable.com/core';
import { useEmbeddableState } from '@embeddable.com/react';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { twMerge } from 'tailwind-merge';

import Container from '../../Container';
import Spinner from '../../Spinner';
import { ChevronDown, ClearIcon } from '../../icons';

export type Props = {
  className?: string;
  defaultValue?: string;
  ds?: { embeddableId: string; datasetId: string; variableValues: Record };
  icon?: ReactNode;
  inputClassName?: string;
  minDropdownWidth?: number;
  onChange: (v: string) => void;
  options: DataResponse;
  placeholder?: string;
  property?: { name: string; title: string; nativeType: string; __type__: string };
  searchProperty?: string;
  title?: string;
  unclearable?: boolean;
};

type Record = { [p: string]: string };

let debounce: number | undefined = undefined;

export default (props: Props) => {
  const ref = useRef<HTMLInputElement | null>(null);

  const [focus, setFocus] = useState(false);
  const [isDropdownOrItemFocused, setIsDropdownOrItemFocused] = useState(false);
  const [search, setSearch] = useState('');
  const [triggerBlur, setTriggerBlur] = useState(false);
  const [value, setValue] = useState(props.defaultValue);

  const [_, setServerSearch] = useEmbeddableState({
    [props.searchProperty || 'search']: '',
  }) as [Record, (f: (m: Record) => Record) => void];

  useEffect(() => {
    setValue(props.defaultValue);
  }, [props.defaultValue]);

  // Accessibility - Close the menu if we've tabbed off of any items it contains
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (!isDropdownOrItemFocused) {
      timeoutId = setTimeout(() => {
        setFocus(false);
      }, 200);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isDropdownOrItemFocused]);

  useLayoutEffect(() => {
    if (!triggerBlur) return;

    const timeout = setTimeout(() => {
      setFocus(false);
      setTriggerBlur(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [triggerBlur]);

  const performSearch = useCallback(
    (newSearch: string) => {
      setSearch(newSearch);

      clearTimeout(debounce);

      debounce = window.setTimeout(() => {
        setServerSearch((s) => ({ ...s, [props.searchProperty || 'search']: newSearch }));
      }, 500);
    },
    [setSearch, setServerSearch, props.searchProperty],
  );

  const setDropdownValue = useCallback(
    (value: string) => {
      performSearch('');
      setValue(value);
      props.onChange(value);
      clearTimeout(debounce);
    },
    [setValue, props, performSearch],
  );

  // Used for handling keydown events on the menu items
  const handleKeyDownCallback = (
    e: React.KeyboardEvent<HTMLElement>,
    callback: any,
    escapable?: boolean,
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback(e);
      setFocus(false);
      setTriggerBlur(true);
    }
    if (escapable && e.key === 'Escape') {
      e.preventDefault();
      setFocus(false);
      setTriggerBlur(true);
    }
  };

  const list = useMemo(
    () =>
      props.options?.data?.reduce((memo, o, i: number) => {
        memo.push(
          <div
            key={i}
            onClick={() => {
              setFocus(false);
              setTriggerBlur(true);
              setDropdownValue(o[props.property?.name || ''] || '');
            }}
            onKeyDown={(e) => {
              handleKeyDownCallback(
                e,
                () => {
                  setDropdownValue(o[props.property?.name || ''] || '');
                },
                true,
              );
            }}
            className={`flex items-center min-h-[36px] px-3 py-2 hover:bg-black/5 cursor-pointer font-normal ${
              value === o[props.property?.name || ''] ? 'bg-black/5' : ''
            } whitespace-nowrap overflow-hidden text-ellipsis`}
            tabIndex={0}
          >
            {o[props.property?.name || '']}
            {o.note && (
              <span className="font-normal ml-auto pl-3 text-xs opacity-70">{o.note}</span>
            )}
          </div>,
        );

        return memo;
      }, []),
    [props.options?.data, props.property?.name, value, setDropdownValue],
  ) as ReactNode[];

  return (
    <Container title={props.title}>
      <div
        className={twMerge(
          'relative rounded-xl w-full min-w-[50px] h-10 border border-[#DADCE1] flex items-center',
          props.className,
        )}
      >
        <input
          ref={ref}
          value={search}
          name="dropdown"
          placeholder={props.placeholder}
          onClick={() => {
            setFocus(true);
            setTriggerBlur(false);
          }}
          onFocus={() => {
            setFocus(true);
            setTriggerBlur(false);
            setIsDropdownOrItemFocused(true);
          }}
          onBlur={() => {
            setIsDropdownOrItemFocused(false);
          }}
          onChange={(e) => performSearch(e.target.value)}
          className={`outline-none bg-transparent leading-9 h-9 border-0 px-3 w-full cursor-pointer text-sm ${
            focus || !value ? '' : 'opacity-0'
          }`}
        />

        {!!value && (
          <span
            className={`absolute w-[calc(100%-2.5rem)] whitespace-nowrap overflow-hidden truncate rounded-xl left-3 top-1 h-8 leading-8 block pointer-events-none text-sm ${
              focus ? 'hidden' : ''
            }`}
          >
            {value}
          </span>
        )}

        {focus && (
          <div
            style={{ minWidth: props.minDropdownWidth }}
            className="flex flex-col bg-white rounded-xl absolute top-11 z-50 border border-[#DADCE1] w-full overflow-y-auto overflow-x-hidden max-h-[400px]"
            onMouseDown={(e) => {
              e.preventDefault();
              // re-focus the input (allows repeated clicking in and out)
              ref.current?.focus();
              setTriggerBlur(false);
            }}
            onFocus={() => {
              setIsDropdownOrItemFocused(true);
            }}
            onBlur={() => {
              setIsDropdownOrItemFocused(false);
            }}
            tabIndex={0}
          >
            {list}
            {list?.length === 0 && !!search && (
              <div className="px-3 py-2 text-black/50 italic cursor-pointer">No results</div>
            )}
          </div>
        )}

        {props.options.isLoading ? (
          <Spinner show className="absolute right-2 top-2 z-1 pointer-events-none" />
        ) : (
          <ChevronDown className="absolute right-2 top-2.5 z-1 pointer-events-none" />
        )}

        {!props.unclearable && !!value && (
          <div
            onClick={() => {
              setDropdownValue('');
            }}
            className="absolute right-10 top-0 h-10 flex items-center z-10 cursor-pointer"
          >
            <ClearIcon />
          </div>
        )}
      </div>
    </Container>
  );
};
