import { dateParser } from '@cubejs-backend/api-gateway/dist/src/dateParser.js';
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
  const { onChangeComparison, defaultPeriod, onChangePeriod } = props;
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

  const granularityOptions = getValidGranularities(period);

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
        onChangeComparison(null);

        return;
      }

      if (!period?.from || !period?.to) return;

      if (value === 'Previous month') {
        onChangeComparison({
          relativeTimeString: '',
          from: subMonths(period.from, 1),
          to: subMonths(period.to, 1)
        });

        return;
      }

      if (value === 'Previous quarter') {
        onChangeComparison({
          relativeTimeString: '',
          from: subQuarters(period.from, 1),
          to: subQuarters(period.to, 1)
        });

        return;
      }

      if (value === 'Previous year') {
        onChangeComparison({
          relativeTimeString: '',
          from: subYears(period.from, 1),
          to: subYears(period.to, 1)
        });

        return;
      }

      // Previous period

      const days = Math.abs(differenceInCalendarDays(period.from, period.to)) + 1;

      onChangeComparison({
        relativeTimeString: '',
        from: subDays(period.from, days),
        to: subDays(period.to, days)
      });
    },
    [onChangeComparison, period, setCompareOption]
  );

  useEffect(() => {
    if (!recalcComparison) return;

    if (compareOption) changeComparisonOption(compareOption);
  }, [compareOption, recalcComparison, changeComparisonOption]);

  //ensure the default period is set correctly on first load
  useEffect(() => {
    if (!defaultPeriod) return;
    if (
      !defaultPeriod?.from &&
      !defaultPeriod?.to &&
      defaultPeriod?.relativeTimeString
    ) {
      const [from, to] = dateParser(defaultPeriod?.relativeTimeString, '');
      if (!from || !to) return;
      defaultPeriod.from = new Date(from);
      defaultPeriod.to = new Date(to);
      setPeriod(defaultPeriod);
      onChangePeriod(defaultPeriod as TimeRange);
      return;
    }
    setPeriod(defaultPeriod);
  }, [defaultPeriod, onChangePeriod]);


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

              const g = getValidGranularities(period as TimeRange).recommended.value
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

function toSeconds (unit: string, n: number): number {
  const unitsInSeconds = {
      minute: 60,
      hour: 3600,
      day: 86400,
      week: 604800,
      month: 2629800,  // Roughly 30.44 days
      quarter: 7889400,  // Roughly 91.31 days
      year: 31557600  // Based on a typical Gregorian year
  };
  return n * unitsInSeconds[unit];
}

function getValidGranularities(period?: TimeRange): DataResponse {
  const data: { value: Granularity }[] = [];

  
  //period boundaries for valid granularity options
  const gSettings = {
    second: { min: 2, max: 100 },
    minute: { min: toSeconds('minute', 2), max: toSeconds('minute', 100) },
    hour: { min: toSeconds('hour', 2), max: toSeconds('hour', 100) },
    day: { min: toSeconds('day', 0.5), max: toSeconds('day', 168) },
    week: { min: toSeconds('week', 2), max: toSeconds('week', 365) },
    month: { min: toSeconds('month', 2), max: toSeconds('month', 730) },
    quarter: { min: toSeconds('quarter', 2), max: toSeconds('quarter', 36) },
    year: { min: toSeconds('year', 1.5), max: toSeconds('year', 1000) }
  }

  const granularities = Object.keys(gSettings);
  const diff = differenceInSeconds(period?.to || new Date(), period?.from || new Date());

  granularities.forEach((value) => {
    const { min, max } = gSettings[value];
    if (diff < min || diff > max) return;
    data.push({ value: value as Granularity });
  });

  let recommendedG = { value: 'day' };
  if (data.length >= 2) recommendedG = data[data.length - 2]; //set the recommended granularity option as the penultimate valid option.

  return {
    isLoading: false,
    data,
    recommended: recommendedG
  };
}
