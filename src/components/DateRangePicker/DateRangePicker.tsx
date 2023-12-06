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
import React, { useEffect, useRef, useState } from 'react';
import { CaptionProps, DateRange, DayPicker, useNavigation } from 'react-day-picker';

import useFont from '../../hooks/useFont';

import '../index.css';
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from '../icons';

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

  useEffect(() => {
    setRange(props.value);
  }, [props.value]);

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
