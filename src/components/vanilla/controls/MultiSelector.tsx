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
import Checkbox from '../../icons/Checkbox';
import CheckboxEmpty from '../../icons/CheckboxEmpty';
import Container from '../Container';
import { ChevronDown, ClearIcon } from '../icons';
import { SelectorOption } from './Selector.types';
import { selectorOptionIncludesSearch } from './Selector.utils';

export type Props = {
  className?: string;
  minDropdownWidth?: number;
  placeholder?: string;
  defaultValue?: string[];
  options: SelectorOption[];
  title?: string;
  unclearable?: boolean;
  onChange: (v: string[]) => void;
};

export default (props: Props) => {
  const ref = useRef<HTMLInputElement | null>(null);

  const [focus, setFocus] = useState(false);
  const [isDropdownOrItemFocused, setIsDropdownOrItemFocused] = useState(false);
  const [search, setSearch] = useState('');
  const [triggerBlur, setTriggerBlur] = useState(false);
  const [value, setValue] = useState(props.defaultValue);

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
    },
    [setSearch],
  );

  const set = useCallback(
    (newValue: string) => {
      performSearch('');

      let newValues: string[] = [];

      if (newValue !== '') {
        newValues = value || [];
        if (newValues?.includes(newValue)) {
          newValues = newValues.filter((v) => v !== newValue);
        } else {
          newValues = [...newValues, newValue];
        }
      }

      props.onChange(newValues);
      setValue(newValues);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [performSearch, props, value],
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
    }
    if (escapable && e.key === 'Escape') {
      e.preventDefault();
      setFocus(false);
      setTriggerBlur(true);
    }
  };

  const list = useMemo(() => {
    return props.options
      .filter((option) => selectorOptionIncludesSearch(search, option))
      .map((option) => {
        return (
          <div
            key={option.value}
            role="button"
            onClick={() => {
              setTriggerBlur(false);
              set(option.value);
            }}
            onKeyDown={(e) => handleKeyDownCallback(e, set(option.value), true)}
            onFocus={() => {
              setIsDropdownOrItemFocused(true);
              setFocus(true);
            }}
            onBlur={() => {
              setIsDropdownOrItemFocused(false);
            }}
            className={`flex items-left items-center min-h-[36px] px-3 py-2 hover:bg-black/5 cursor-pointer font-normal ${
              value?.includes(option.value) ? 'bg-black/5' : ''
            } truncate`}
            tabIndex={0}
          >
            {value?.includes(option.value) ? <Checkbox /> : <CheckboxEmpty />}
            <span className="font-normal pl-1 truncate" title={option.label}>
              {option.label}
            </span>
          </div>
        );
      });
  }, [props, value, set, search]) as ReactNode[];

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
            className={`absolute w-[calc(100%-2rem)] whitespace-nowrap overflow-hidden truncate rounded-xl left-3 top-1 h-8 leading-8 block pointer-events-none text-sm ${
              focus ? 'hidden' : ''
            }`}
          >
            Selected {value.length} {value.length === 1 ? 'option' : 'options'}
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

        <ChevronDown className="absolute right-2.5 top-2.5 z-1 pointer-events-none" />

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
    </Container>
  );
};
