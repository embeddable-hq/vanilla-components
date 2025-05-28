import { DataResponse, Dimension } from '@embeddable.com/core';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import Container from '../../Container';
import Spinner from '../../Spinner';
import { ChevronDown, ClearIcon } from '../../icons';

export type Props = {
  options: DataResponse;
  onChange: (v: string | undefined) => void;
  searchProperty?: string;
  minDropdownWidth?: number;
  properties?: Dimension[];
  title?: string;
  defaultValue?: string;
  placeholder?: string;
  ds?: { embeddableId: string; datasetId: string; variableValues: Record<string, string> };
};

let debounce: number | undefined = undefined;

export default (props: Props) => {
  const { properties } = props;

  const [focus, setFocus] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);
  const [triggerBlur, setTriggerBlur] = useState(false);
  const [displayValue, setDisplayValue] = useState(props.defaultValue);
  const [search, setSearch] = useState('');

  const performSearch = useCallback(
    (newSearch: string) => {
      setSearch(newSearch);
      clearTimeout(debounce);
      debounce = window.setTimeout(() => {
        setDisplayValue((s) => s || props.defaultValue || '');
      }, 500);
    },
    [props.defaultValue],
  );

  const set = useCallback(
    (value: Dimension | null) => {
      const dimension = value;
      performSearch('');
      setDisplayValue(dimension?.title || dimension?.name || '');
      setFocus(false);
      clearTimeout(debounce);
      props.onChange(dimension ? JSON.stringify(dimension) : undefined);
    },
    [performSearch, props],
  );

  useLayoutEffect(() => {
    if (!triggerBlur) return;

    const timeout = setTimeout(() => {
      setFocus(false);
      setTriggerBlur(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [triggerBlur]);

  const renderProperties = useMemo(() => {
    if (!properties) return null;

    return properties.map((property) => {
      const title = property.title || property.name;
      return (
        <div
          key={property.name}
          className="px-3 py-2 text-black/50 cursor-pointer hover:bg-gray-100"
          onClick={() => set(property)}
        >
          {title}
        </div>
      );
    });
  }, [properties, set]);

  return (
    <Container title={props.title}>
      <div
        className={`relative rounded-xl w-full min-w-[50px] h-10 border border-[#DADCE1] flex items-center`}
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
          onBlur={() => setTriggerBlur(true)}
          onChange={(e) => performSearch(e.target.value)}
          className={`outline-none bg-transparent leading-9 h-9 border-0 px-3 w-full cursor-pointer text-sm ${
            focus || !displayValue ? '' : 'opacity-0'
          }`}
        />

        {!!displayValue && (
          <span
            className={`absolute w-[calc(100%-2.5rem)] whitespace-nowrap overflow-hidden truncate rounded-xl left-3 top-1 h-8 leading-8 block pointer-events-none text-sm ${
              focus ? 'hidden' : ''
            }`}
          >
            {displayValue || props.placeholder || ''}
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
          >
            {renderProperties}
          </div>
        )}

        {props.options.isLoading ? (
          <Spinner show className="absolute right-2 top-2 z-1 pointer-events-none" />
        ) : (
          <ChevronDown className="absolute right-2 top-2.5 z-1 pointer-events-none" />
        )}

        {!!displayValue && (
          <div
            onClick={() => {
              set(null);
              setDisplayValue('');
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
