import { dateParser } from '@cubejs-backend/api-gateway/dist/src/dateParser.js';
import { endOfDay, getYear } from 'date-fns';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { DayPicker, MonthCaptionProps, NavProps, useDayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import formatValue from '../../../../util/format';
import { toUTC } from '../../../../util/timezone';
import Container from '../../../Container';
import { CalendarIcon, ChevronLeft, ChevronRight } from '../../../icons';
import Dropdown from '../../Dropdown';
import { Theme } from '../../../../../themes/theme';
import { useTheme } from '@embeddable.com/react';

export const ranges = [
  'Today',
  'Yesterday',
  'This week',
  'Last week',
  'Last 7 days',
  'Last 30 days',
  'This month',
  'Last month',
  'This quarter',
  'Last quarter',
  'Last 6 months',
  'Last 12 months',
  'This year',
  'Last year',
];

type TimeRange = {
  to?: Date;
  from?: Date;
  relativeTimeString?: string;
};

type Props = {
  placeholder?: string;
  onChange?: (v?: TimeRange) => void;
  title?: string;
  value?: TimeRange;
  hideDate?: boolean;
};

export default function DateRangePicker(props: Props) {
  const [focus, setFocus] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);
  const [triggerBlur, setTriggerBlur] = useState(false);
  const [range, setRange] = useState<TimeRange | undefined>(props.value);

  const theme: Theme = useTheme() as Theme;

  useLayoutEffect(() => {
    if (!triggerBlur) return;

    const timeout = setTimeout(() => {
      setFocus(false);
      setTriggerBlur(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [triggerBlur]);

  useEffect(() => {
    if (!props.value?.from && !props.value?.to && !props.value?.relativeTimeString) {
      return setRange(props.value);
    }

    if (!props.value?.relativeTimeString) return;

    const [from, to] = dateParser(props.value?.relativeTimeString, 'UTC');

    if (!from || !to) return;

    setRange({
      ...props.value,
      from: new Date(from),
      to: new Date(to),
    });
  }, [props.value]);

  const formatFrom = useMemo(
    () => (getYear(range?.from || new Date()) === getYear(new Date()) ? 'd MMM' : 'd MMM yyyy'),
    [range?.from],
  );

  const formatTo = useMemo(
    () => (getYear(range?.to || new Date()) === getYear(new Date()) ? 'd MMM' : 'd MMM yyyy'),
    [range?.to],
  );

  const formatDateText = () => {
    if (!range?.from || !range?.to) return 'Select';
    // Perform some gymnastics to make sure we stay in UTC
    const newFrom = toUTC(range.from) || new Date();
    const newTo = toUTC(range.to) || new Date();
    const fromFormat = formatValue(newFrom.toJSON(), { dateFormat: formatFrom });
    const toFormat = formatValue(newTo.toJSON(), { dateFormat: formatTo });
    return `${fromFormat} - ${toFormat}`;
  };

  return (
    <Container title={props.title}>
      <div
        className={`
          h-10
          inline-flex
          relative
          text-sm
          w-full
          text-[color:--embeddable-font-colorNormal]
        `}
      >
        <Dropdown
          minDropdownWidth={120}
          unclearable
          placeholder={props.placeholder}
          className={`
            border
            flex
            h-10
            items-center
            max-w-[120px]
            min-w-[80px]
            relative
            rounded-r-none
            sm:max-w-[140px]
            w-full
            border-[color:--embeddable-controls-borders-colors-normal]
          `}
          defaultValue={range?.relativeTimeString || ''}
          onChange={(relativeTimeString) => {
            const [from, to] = dateParser(relativeTimeString, 'UTC');

            if (!from || !to) return;

            const range = { relativeTimeString, from: new Date(from), to: new Date(to) };

            setRange(range);

            props.onChange?.(range);
          }}
          options={{
            isLoading: false,
            data: ranges.map((value) => ({ value })),
          }}
          property={{ name: 'value', title: '', nativeType: 'string', __type__: 'dimension' }}
        />
        <div
          className={`
            border-r
            border-y
            cursor-pointer
            flex
            grow
            items-center
            min-w-[60px]
            p-4
            relative
            text-sm
            border-[color:--embeddable-controls-borders-colors-normal]
            hover:bg-[color:--embeddable-controls-inputs-colors-hover]
            rounded-r-[--embedabble-controls-borders-radius]
          `}
        >
          <input
            ref={ref}
            onChange={() => {}}
            onFocus={() => setFocus(true)}
            onBlur={() => {
              setTriggerBlur(true);
            }}
            className="absolute left-0 top-0 h-full w-full opacity-0 cursor-pointer"
          />
          <CalendarIcon className="mr-2" />
          {!props.hideDate && <span className="overflow-hidden truncate">{formatDateText()}</span>}
          <div
            id="date-range-picker"
            onClick={() => {
              setTriggerBlur(false);
              ref.current?.focus();
            }}
            className={`${
              focus ? 'block' : 'hidden'
            } absolute top-8 right-0 sm:right-auto sm:left-0 z-50 pt-3 pointer-events-auto opacity-100`}
          >
            <DayPicker
              showOutsideDays
              className={`
                border
                px-4
                py-3
                !m-0
                bg-[color:--embeddable-controls-backgrounds-soft]
                border-[color:--embeddable-controls-borders-colors-normal]
                rounded-[--embeddable-controls-borders-radius]
                text-[color:--embeddable-font-colorNormal]
              `}
              classNames={{
                selected: `
                  bg-[color:--embeddable-controls-inputs-colors-selected]
                  text-[color:--embeddable-font-colorNormal]`,
              }}
              components={{
                MonthCaption: CustomCaption,
                Nav: (props: NavProps) => (
                  <span style={{ position: 'absolute', top: 0, left: 0 }}></span>
                ),
              }}
              weekStartsOn={1}
              mode="range"
              required={true}
              selected={{ from: range?.from, to: range?.to }}
              onSelect={(range) => {
                if (!range?.from || !range?.to) return;

                setTriggerBlur(false);
                ref.current?.focus();

                range.to = endOfDay(range.to);
                setRange({ ...range, relativeTimeString: 'Custom' });

                props.onChange?.(range);
              }}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

const CustomCaption = (props: MonthCaptionProps) => {
  const { goToMonth, nextMonth, previousMonth } = useDayPicker();
  const dateUTC = toUTC(props.calendarMonth.date) || new Date();

  return (
    <h2 className="flex items-center">
      <button
        className={`
          border
          h-7
          inline-flex
          items-center
          justify-center
          w-7
          bg-[color:--embeddable-controls-backgrounds-soft]
          border-[color:--embeddable-controls-borders-colors-heavy]
          rounded-[--embeddable-controls-borders-radius]
        `}
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
      >
        <ChevronLeft />
      </button>
      <span className="mx-auto text-sm">
        {formatValue(dateUTC.toJSON(), { dateFormat: 'MMMM yyy' })}
      </span>
      <button
        className={`
          border
          h-7
          inline-flex
          items-center
          justify-center
          w-7
          bg-[color:--embeddable-controls-backgrounds-soft]
          border-[color:--embeddable-controls-borders-colors-heavy]
          rounded-[--embeddable-controls-borders-radius]
        `}
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
      >
        <ChevronRight />
      </button>
    </h2>
  );
};
