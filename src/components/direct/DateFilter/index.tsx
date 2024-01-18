import { dateParser } from '@cubejs-backend/api-gateway/dist/src/dateParser';
import { format, getYear } from 'date-fns';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { CaptionProps, DayPicker, useNavigation } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import useFont from '../../hooks/useFont';
import { ChevronDown } from '../../vanilla/icons';
import '../../vanilla/index.css';

const ranges = [
  'Today',
  'Yesterday',
  'This week',
  'Last week',
  'Last 7 days',
  'This month',
  'Last month',
  'Last 30 days',
  'This quarter',
  'Last quarter',
  'Last 90 days',
  'This year',
  'Last year',
  'Last 12 months'
];

type TimeRange = {
  to?: Date;
  from?: Date;
  relativeTimeString?: string;
};

type Props = {
  value?: TimeRange;
  title?: string;
  onChange: (v?: TimeRange) => void;
};

export default (props: Props) => {
  const [focus, setFocus] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);
  const [triggerBlur, setTriggerBlur] = useState(false);
  const [range, setRange] = useState<TimeRange | undefined>(props.value);

  useFont();

  useLayoutEffect(() => {
    if (!triggerBlur) return;

    const timeout = setTimeout(() => {
      setFocus(false);
      setTriggerBlur(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [triggerBlur]);

  useEffect(() => {
    if (!props.value?.relativeTimeString) return;

    const [from, to] = dateParser(props.value?.relativeTimeString, 'UTC');

    if (!from || !to) return;

    setRange({
      ...props.value,
      from: new Date(from),
      to: new Date(to)
    });
  }, [props.value]);

  const formatFrom = useMemo(
    () => (getYear(range?.from || new Date()) === getYear(new Date()) ? 'd MMM' : 'd MMM yyyy'),
    [range?.from]
  );

  const formatTo = useMemo(
    () => (getYear(range?.to || new Date()) === getYear(new Date()) ? 'd MMM' : 'd MMM yyyy'),
    [range?.to]
  );

  return (
    <div className="w-full font-embeddable text-xs p-1">
      <div className="relative inline-flex h-8 w-full text-[#101010] text-xs cursor-pointer">
        <div className="grow flex items-center px-3 hover:bg-[#f3f4f6] dark:hover:bg-[#262626] relative text-xs border rounded border-[#d8dad9] dark:bg-[#353535] dark:border-white/5 dark:text-white">
          <input
            ref={ref}
            onChange={() => {}}
            onFocus={() => setFocus(true)}
            onBlur={() => setTriggerBlur(true)}
            className="absolute left-0 top-0 h-full w-full opacity-0 cursor-pointer"
          />
          <CalendarIcon className="mr-2 hidden sm:block mb-[1px] text-[#444] dark:text-[#BDBDBD]" />
          <span>
            {!!range?.from && !!range?.to
              ? range.relativeTimeString ||
                `${format(range.from, formatFrom)} - ${format(range.to, formatTo)}`
              : 'Select'}
          </span>

          <ChevronDown className="ml-auto text-[#444] dark:text-[#BDBDBD]" />
          <div
            onClick={() => {
              setTriggerBlur(false);
              ref.current?.focus();
            }}
            className={`${
              focus ? 'block' : 'hidden'
            } absolute top-9 left-[-1px] sm:right-auto z-50 pointer-events-auto opacity-100 flex border border-[#d8dad9] dark:border-white/10 bg-white dark:bg-[#333] rounded`}
          >
            <div className="flex flex-col w-36 max-h-[215px] overflow-auto">
              <div className="mr-0.5 border-r border-r-[#DBDBDB] dark:border-r-[#444444] min-h-[12px]" />
              {ranges.map((relativeTimeString) => (
                <div
                  key={relativeTimeString}
                  className={`h-7 leading-7 mr-0.5 border-r border-r-[#DBDBDB] dark:border-r-[#444444] px-3 ${
                    range?.relativeTimeString === relativeTimeString
                      ? 'bg-[#ebebeb] dark:bg-[#353535]'
                      : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();

                    const [from, to] = dateParser(relativeTimeString, 'UTC');

                    if (!from || !to) return;

                    const range = { relativeTimeString, from: new Date(from), to: new Date(to) };

                    setRange(range);

                    props.onChange(range);

                    setFocus(false);

                    setTriggerBlur(false);
                  }}
                >
                  {relativeTimeString}
                </div>
              ))}
            </div>
            <DayPicker
              formatters={{
                formatWeekdayName: (d) => format(d, 'EEEEE')
              }}
              weekStartsOn={0}
              showOutsideDays
              className="bg-white dark:bg-[#333] px-4 pt-3 pb-0 text-[#101010] dark:text-white !my-0 !mr-0 !ml-0.5 border-l dark:border-l-[#444444] border-l-[#ebebeb]"
              components={{
                Caption: CustomCaption
              }}
              mode="range"
              selected={{ from: range?.from, to: range?.to }}
              onSelect={(range) => {
                setRange({ ...range, relativeTimeString: 'Custom' });

                if (!range?.from || !range?.to) return;

                setFocus(false);

                setTriggerBlur(false);

                props.onChange(range);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomCaption = (props: CaptionProps) => {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();

  return (
    <h2 className="flex items-center">
      <span className="mr-auto text-xs">
        {format(props.displayMonth, 'MMMM')}
        <span className="text-[#6d6d6d] ml-1">{format(props.displayMonth, 'yyy')}</span>
      </span>
      <button
        className="w-7 h-7 mr-1 rounded date-arrow-btn bg-[#E0E0E0] dark:bg-[#535353] justify-center items-center inline-flex cursor-pointer hover:bg-[#DDD] dark:hover:bg-[#444] text-[#444444] dark:text-[#BDBDBD]"
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
      >
        <ArrowLeft />
      </button>
      <button
        className="w-7 h-7 rounded date-arrow-btn bg-[#E0E0E0] dark:bg-[#535353] justify-center items-center inline-flex cursor-pointer hover:bg-[#DDD] dark:hover:bg-[#444] text-[#444444] dark:text-[#BDBDBD]"
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
      >
        <ArrowRight />
      </button>
    </h2>
  );
};

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="12"
    height="13"
    viewBox="0 0 12 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 0.5V2H8V0.5H9V2H11C11.5523 2 12 2.44772 12 3V12C12 12.5523 11.5523 13 11 13H1C0.447716 13 0 12.5523 0 12V3C0 2.44772 0.447715 2 1 2H3V0.5H4ZM8 3V4.5H9V3H11V12H1V3H3V4.5H4V3H8Z"
      fill="currentColor"
    />
  </svg>
);

const ArrowLeft = () => (
  <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.70718 3.99998L5.85363 0.85353L5.14652 0.146423L0.792969 4.49998L5.14652 8.85353L5.85363 8.14642L2.70718 4.99998L12.0001 4.99998V3.99998L2.70718 3.99998Z"
      fill="currentColor"
    />
  </svg>
);

const ArrowRight = () => (
  <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.29289 3.99998L6.14645 0.85353L6.85355 0.146423L11.2071 4.49998L6.85355 8.85353L6.14645 8.14642L9.29289 4.99998L0 4.99998L0 3.99998L9.29289 3.99998Z"
      fill="currentColor"
    />
  </svg>
);
