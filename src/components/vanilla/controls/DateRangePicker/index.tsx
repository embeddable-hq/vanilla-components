import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';
import React, { useEffect, useState } from 'react';
import { CaptionProps, DayPicker, useNavigation } from 'react-day-picker';
import { dateParser } from '@cubejs-backend/api-gateway/dist/src/dateParser';

import useFont from '../../../hooks/useFont';

import '../../index.css';
import Title from '../../Title';
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from '../../icons';

const ranges = [
  '',
  'Today',
  'Yesterday',
  'This week',
  'Last 7 days',
  'This month',
  'Last 30 days',
  'This quarter',
  'This year',
  'Last year'
];

type TimeRange = {
  to?: Date;
  from?: Date;
  relativeTimeString?: string;
};

type Props = {
  value?: TimeRange;
  title?: string;
  onChange: (v?: { value: TimeRange }) => void;
};

export default (props: Props) => {
  const [range, setRange] = useState<TimeRange | undefined>(props.value);

  useFont();

  useEffect(() => {
    console.log('DateRangePicker props', props);
  }, [props]);

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

  return (
    <div className="w-full">
      <Title title={props.title} />
      <div className="relative inline-flex border rounded-md border-[#d8dad9] h-11 w-full text-[#101010] text-sm font-medium">
        <div className="border-r border-[#d8dad9] grow flex items-center p-4 max-w-[180px] hover:bg-[#f3f4f6] cursor-pointer group relative text-[14px] w-full">
          {range?.relativeTimeString || (range?.from && range?.to ? 'Custom' : 'Select')}{' '}
          <ChevronDown className="ml-auto" />
          <div className="hidden w-full group-hover:block absolute top-8 left-0 z-50 pt-4 pointer-events-auto opacity-100">
            <div className="rounded w-full border border-[#d8dad9] overflow-hidden">
              {ranges.map(
                (relativeTimeString, i) =>
                  !!relativeTimeString && (
                    <div
                      onClick={() => {
                        if (!ranges[i]) return;

                        const [from, to] = dateParser(relativeTimeString, 'UTC');

                        if (!from || !to) return;

                        setRange({ relativeTimeString, from: new Date(from), to: new Date(to) });
                      }}
                      className={`${
                        i === 0 ? '' : 'border-t'
                      } border-[#d8dad9] text-[14px] h-10 w-full flex items-center justify-center cursor-pointer hover:bg-[#f3f4f6] hover:text-[#333942] ${
                        (range?.relativeTimeString || '') === relativeTimeString
                          ? 'bg-[#f3f4f6] text-[#333942]'
                          : 'bg-white'
                      }`}
                      key={i}
                    >
                      {relativeTimeString}
                    </div>
                  )
              )}
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
              selected={{ from: range?.from, to: range?.to }}
              onSelect={(range) => {
                setRange(range);

                console.log('executing props.onChange with', { value: range });

                if (!range?.from || !range?.to) return;

                props.onChange({ value: range });
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
