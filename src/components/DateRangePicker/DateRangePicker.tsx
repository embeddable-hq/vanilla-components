import {
  format,
  subDays,
  subYears,
  endOfDay,
  endOfYear,
  endOfWeek,
  endOfToday,
  startOfDay,
  endOfMonth,
  startOfWeek,
  startOfYear,
  startOfMonth,
  startOfToday
} from 'date-fns';
import 'react-day-picker/dist/style.css';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { CaptionProps, DateRange, DayPicker, useNavigation } from 'react-day-picker';

import useFont from '../../hooks/useFont';

import '../index.css';

const ranges = [
  {
    name: 'Custom'
  },
  {
    name: 'Today',
    from: startOfToday(),
    to: endOfToday()
  },
  {
    name: 'Yesterday',
    from: startOfDay(subDays(new Date(), 1)),
    to: endOfDay(subDays(new Date(), 1))
  },
  {
    name: 'This week',
    from: startOfWeek(new Date()),
    to: endOfWeek(new Date())
  },
  {
    name: 'Last 7 days',
    from: startOfDay(subDays(new Date(), 7)),
    to: endOfToday()
  },
  {
    name: 'This month',
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  },
  {
    name: 'Last 30 days',
    from: startOfDay(subDays(new Date(), 30)),
    to: endOfToday()
  },
  {
    name: 'This year',
    from: startOfYear(new Date()),
    to: endOfYear(new Date())
  },
  {
    name: 'Last year',
    from: startOfYear(subYears(new Date(), 1)),
    to: endOfYear(subYears(new Date(), 1))
  }
];

export default (props: { value?: DateRange; onChange: (v: DateRange) => void }) => {
  const [option, setOption] = useState(0);
  const onChange = useRef<Function>(props.onChange);
  const [range, setRange] = useState<DateRange | undefined>(props.value);

  useFont();

  useEffect(() => {
    onChange.current = props.onChange;
  }, [props.onChange]);

  useEffect(() => {
    if (range) onChange.current(range);
  }, [range]);

  return (
    <div className="flex justify-center">
      <div className="relative inline-flex border rounded-md border-[#d8dad9] h-11 w-[420px] text-[#101010] text-sm font-medium">
        <div className="border-r border-[#d8dad9] grow flex items-center p-4 max-w-[180px] hover:bg-[#f3f4f6] cursor-pointer group relative text-[14px]">
          {ranges[option]?.name} <ChevronDown className="ml-auto" />
          <div className="hidden w-full group-hover:block absolute top-8 left-0 z-50 pt-4 pointer-events-auto opacity-100">
            <div className="rounded w-full border border-[#d8dad9] overflow-hidden">
              {ranges.map((range, i) => (
                <div
                  onClick={() => {
                    setOption(i);

                    if (!ranges[i]?.from) return;

                    setRange({ from: ranges[i]?.from, to: ranges[i]?.to });
                  }}
                  className={`${
                    i === 0 ? '' : 'border-t'
                  } border-[#d8dad9] text-[14px] h-10 w-full flex items-center justify-center cursor-pointer hover:bg-[#f3f4f6] hover:text-[#333942] ${
                    option === i ? 'bg-[#f3f4f6] text-[#333942]' : 'bg-white'
                  }`}
                  key={i}
                >
                  {range.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grow flex items-center p-4 hover:bg-[#f3f4f6] cursor-pointer group relative text-[14px]">
          <CalendarIcon className="mr-2 " />{' '}
          {!!range?.from && !!range?.to
            ? `${format(range.from, 'd MMM yyyy')} - ${format(range.to, 'd MMM yyyy')}`
            : 'Select'}
          <div className="hidden group-hover:block absolute top-8 left-0 z-50 pt-4 pointer-events-auto opacity-100">
            <DayPicker
              showOutsideDays
              className="border border-[#d8dad9] bg-white rounded-md shadow px-4 py-3 text-[#101010] !m-0"
              components={{
                Caption: CustomCaption
              }}
              weekStartsOn={1}
              mode="range"
              selected={range}
              onSelect={(range) => {
                setRange(range);
                setOption(0);
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
      <button
        className="w-7 h-7 bg-white rounded shadow border border-slate-500 justify-center items-center inline-flex"
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
      >
        <ChevronLeft />
      </button>
      <span className="mx-auto text-sm font-medium">{format(props.displayMonth, 'MMMM yyy')}</span>
      <button
        className="w-7 h-7 bg-white rounded shadow border border-slate-500 justify-center items-center inline-flex"
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
      >
        <ChevronRight />
      </button>
    </h2>
  );
};

const ChevronLeft = ({
  className,
  onClick
}: {
  className?: string;
  onClick?: MouseEventHandler<SVGSVGElement>;
}) => (
  <svg
    onClick={onClick}
    className={className || ''}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.7071 5.29289C13.0976 5.68342 13.0976 6.31658 12.7071 6.70711L9.41421 10L12.7071 13.2929C13.0976 13.6834 13.0976 14.3166 12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L7.29289 10.7071C6.90237 10.3166 6.90237 9.68342 7.29289 9.29289L11.2929 5.29289C11.6834 4.90237 12.3166 4.90237 12.7071 5.29289Z"
      fill="#444"
    />
  </svg>
);

const ChevronRight = ({
  className,
  onClick
}: {
  className?: string;
  onClick?: MouseEventHandler<SVGSVGElement>;
}) => (
  <svg
    onClick={onClick}
    className={className || ''}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
      fill="#444"
    />
  </svg>
);

const ChevronDown = ({
  className,
  onClick
}: {
  className?: string;
  onClick?: MouseEventHandler<SVGSVGElement>;
}) => (
  <svg
    onClick={onClick}
    className={className || ''}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.70711 7.29289L10 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.68342 13.0976 9.29289 12.7071L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289Z"
      fill="#101010"
    />
  </svg>
);

const CalendarIcon = ({
  className,
  onClick
}: {
  className?: string;
  onClick?: MouseEventHandler<SVGSVGElement>;
}) => (
  <svg
    onClick={onClick}
    className={className || ''}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_137_1694)">
      <path
        d="M2.70446 3.36737C2.35264 3.36737 2.01523 3.50713 1.76646 3.7559C1.51769 4.00468 1.37793 4.34208 1.37793 4.6939V17.2959C1.37793 17.6477 1.51769 17.9852 1.76646 18.2339C2.01523 18.4827 2.35264 18.6225 2.70446 18.6225H17.2963C17.6481 18.6225 17.9856 18.4827 18.2343 18.2339C18.483 17.9852 18.6228 17.6477 18.6228 17.2959V4.6939C18.6228 4.34208 18.483 4.00468 18.2343 3.7559C17.9856 3.50713 17.6481 3.36737 17.2963 3.36737H14.6432"
        stroke="#101010"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.35742 1.37756V5.35716"
        stroke="#101010"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6436 1.37756V5.35716"
        stroke="#101010"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.35742 3.36737H11.9901"
        stroke="#101010"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3164 8.67349V14.6426"
        stroke="#101010"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3271 10.1658H11.8246C12.6487 10.1658 13.3168 9.49765 13.3168 8.67349"
        stroke="#101010"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.3066 14.6429H11.3271"
        stroke="#101010"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.69434 13.648C4.89921 14.2275 5.45198 14.6429 6.10177 14.6429H7.09666C7.92086 14.6429 8.589 13.9747 8.589 13.1505V12.9018C8.589 12.0776 7.92086 11.4095 7.09666 11.4095H6.59922H6.97231C7.72782 11.4095 8.34028 10.797 8.34028 10.0415C8.34028 9.28595 7.72781 8.67348 6.97229 8.67349H6.22612C5.59996 8.67351 5.07205 9.09421 4.90964 9.66839"
        stroke="#101010"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_137_1694">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
