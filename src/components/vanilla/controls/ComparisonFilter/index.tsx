import { dateParser } from '@cubejs-backend/api-gateway/dist/src/dateParser';
import { DataResponse, Dimension, Granularity, TimeRange } from '@embeddable.com/core';
import {
  differenceInCalendarDays,
  differenceInSeconds,
  format,
  getYear,
  subDays,
  subMonths,
  subQuarters,
  subYears
} from 'date-fns';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import Container from '../../Container';
import DateRangePicker from '../DateRangePicker';
import Dropdown from '../Dropdown';

const valueProp: Dimension = {
  __type__: 'dimension',
  name: 'value',
  nativeType: 'string',
  title: 'Value'
};

const minDuration = {
  second: 2,
  minute: 120,
  hour: 7200,
  day: 172800,
  week: 1209600,
  month: 5257000,
  quarter: 15770000,
  year: 63083930
};

const maxDuration = {
  second: 90000,
  minute: 60000,
  hour: 604800, // 7 days
  day: 86400000,
  week: 604800000,
  month: 2628500000,
  quarter: 7885000000,
  year: 31541965000
};

export type Props = {
  title?: string;
  defaultPeriod?: TimeRange;
  defaultComparison?: string;
  defaultGranularity?: Granularity;
  showGranularity?: boolean;
  onChangePeriod: (v: TimeRange | null) => void;
  onChangeComparison: (v: TimeRange | null) => void;
  onChangeGranularity: (v: Granularity | null) => void;
};

export default (props: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hideDate, setHideDate] = useState(false);
  const [recalcComparison, setRecalcComparison] = useState(true);
  const [period, setPeriod] = useState(props.defaultPeriod);
  const [granularity, setGranularity] = useState(props.defaultGranularity);
  const [compareOption, setCompareOption] = useState(props.defaultComparison);

  useLayoutEffect(() => {
    const interval = setInterval(() => {
      const width = ref.current?.clientWidth;

      if (width) setHideDate(width < 250);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const granularityOptions = calculateGranularityOptions(period);

  const comparisonOptions: DataResponse = useMemo(() => {
    if (!period?.from || !period?.to) {
      return {
        isLoading: false,
        data: [{ value: 'No comparison' }]
      };
    }

    const days = Math.abs(differenceInCalendarDays(period.from, period.to)) + 1;

    return {
      isLoading: false,
      data: [
        { value: 'No comparison' },
        {
          value: 'Previous period',
          note: getNote(subDays(period.from, days), subDays(period.to, days))
        },
        {
          value: 'Previous month',
          note: getNote(subMonths(period.from, 1), subMonths(period.to, 1))
        },
        {
          value: 'Previous quarter',
          note: getNote(subQuarters(period.from, 1), subQuarters(period.to, 1))
        },
        {
          value: 'Previous year',
          note: getNote(subYears(period.from, 1), subYears(period.to, 1))
        }
      ]
    };

    function getNote(from: Date, to: Date) {
      return `${format(
        from,
        getYear(from) === getYear(new Date()) ? 'd MMM' : 'd MMM yyyy'
      )} - ${format(to, getYear(to) === getYear(new Date()) ? 'd MMM' : 'd MMM yyyy')}`;
    }
  }, [period?.from, period?.to]);

  const changeComparisonOption = useCallback(
    (value: string) => {
      setCompareOption(value);

      if (value === 'No comparison') {
        props.onChangeComparison(null);

        return;
      }

      if (!period?.from || !period?.to) return;

      if (value === 'Previous month') {
        props.onChangeComparison({
          relativeTimeString: '',
          from: subMonths(period.from, 1),
          to: subMonths(period.to, 1)
        });

        return;
      }

      if (value === 'Previous quarter') {
        props.onChangeComparison({
          relativeTimeString: '',
          from: subQuarters(period.from, 1),
          to: subQuarters(period.to, 1)
        });

        return;
      }

      if (value === 'Previous year') {
        props.onChangeComparison({
          relativeTimeString: '',
          from: subYears(period.from, 1),
          to: subYears(period.to, 1)
        });

        return;
      }

      // Previous period

      const days = Math.abs(differenceInCalendarDays(period.from, period.to)) + 1;

      props.onChangeComparison({
        relativeTimeString: '',
        from: subDays(period.from, days),
        to: subDays(period.to, days)
      });
    },
    [props.onChangeComparison, period, setCompareOption]
  );

  useEffect(() => {
    if (!recalcComparison) return;

    if (compareOption) changeComparisonOption(compareOption);
  }, [compareOption, recalcComparison, changeComparisonOption]);

  //ensure the default period is set correctly on first load
  useEffect(() => {
    if (!props.defaultPeriod) return;
    if (
      !props.defaultPeriod?.from &&
      !props.defaultPeriod?.to &&
      props.defaultPeriod?.relativeTimeString
    ) {
      const [from, to] = dateParser(props.defaultPeriod?.relativeTimeString, '');
      if (!from || !to) return;
      props.defaultPeriod.from = new Date(from);
      props.defaultPeriod.to = new Date(to);
      setPeriod(props.defaultPeriod);
      props.onChangePeriod(props.defaultPeriod as TimeRange);
      return;
    }
    setPeriod(props.defaultPeriod);
  }, []);


  return (
    <Container title={props.title}>
      <div className="flex items-center h-10">
        <div ref={ref} className="grow basis-0 max-w-96 h-full">
          <DateRangePicker
            hideDate={hideDate}
            value={period}
            onChange={(period) => {
              setPeriod(period as TimeRange);

              props.onChangePeriod((period as TimeRange) || null);

              setRecalcComparison(true);

              const options = calculateGranularityOptions(period as TimeRange);

              if (options?.data?.find((record) => record?.value === granularity)) return;

              const days = Math.abs(
                differenceInCalendarDays(period?.from || new Date(), period?.to || new Date())
              );

              let g: Granularity = 'hour';
              if (days > 168) g = 'month';
              else if (days > 59) g = 'week';
              else if (days > 2) g = 'day';

              if (granularity === g) return;

              setGranularity(g);

              props.onChangeGranularity(g);
            }}
          />
        </div>
        <div className="shrink whitespace-nowrap text-[14px] font-normal text-[#101010] mx-1.5 leading-none">
          compare to
        </div>
        <div className="grow basis-0 max-w-[150px] h-full">
          <Dropdown
            unclearable
            minDropdownWidth={320}
            defaultValue={compareOption}
            options={comparisonOptions}
            placeholder="Comparison"
            onChange={changeComparisonOption}
            property={valueProp}
          />
        </div>
        {!!props.showGranularity && (
          <div className="grow basis-0 max-w-[115px] h-full ml-3">
            <Dropdown
              unclearable
              minDropdownWidth={80}
              defaultValue={granularity}
              options={granularityOptions}
              property={valueProp}
              placeholder="Granularity"
              onChange={(c) => {
                const value = c as Granularity;
                setGranularity(value);
                props.onChangeGranularity(value);
              }}
            />
          </div>
        )}
      </div>
    </Container>
  );
};

function calculateGranularityOptions(period?: TimeRange): DataResponse {
  const data: { value: Granularity }[] = [];
  const granularities = Object.keys(minDuration);
  const difference = differenceInSeconds(period?.to || new Date(), period?.from || new Date());

  granularities.forEach((value) => {
    if (minDuration[value] > difference) return;

    if (maxDuration[value] < difference) return;

    data.push({ value: value as Granularity });
  });

  return {
    isLoading: false,
    data
  };
}
