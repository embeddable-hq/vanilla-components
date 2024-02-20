import { dateParser } from '@cubejs-backend/api-gateway/dist/src/dateParser';
import { Dimension, Granularity, TimeRange } from '@embeddable.com/core';
import { DataResponse } from '@embeddable.com/react';
import {
  differenceInCalendarDays,
  differenceInSeconds,
  endOfDay,
  format,
  getYear,
  subDays,
  subMonths,
  subQuarters,
  subYears
} from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';

import Container from '../../Container';
import DateRangePicker from '../DateRangePicker';
import Dropdown from '../Dropdown';
import { Inputs } from './ComparisonFilter.emb';

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
  hour: 3600000,
  day: 86400000,
  week: 604800000,
  month: 2628500000,
  quarter: 7885000000,
  year: 31541965000
};

export type Props = Inputs & {
  onChangePeriod: (v: TimeRange | null) => void;
  onChangeComparison: (v: TimeRange | null) => void;
  onChangeGranularity: (v: Granularity | null) => void;
};

export default (props: Props) => {
  const [period, setPeriod] = useState(props.defaultPeriod);
  const [compareOption, setCompareOption] = useState('No comparison');
  const [comparison, setComparison] = useState<TimeRange | null>(null);
  const [granularity, setGranularity] = useState(props.defaultGranularity);

  const granularityOptions: DataResponse = useMemo(() => {
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
  }, [[period]]);

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
          note: getNote(subDays(period.from, days), endOfDay(subDays(period.to, days)))
        },
        {
          value: 'Previous month',
          note: getNote(subMonths(period.from, 1), endOfDay(subMonths(period.to, 1)))
        },
        {
          value: 'Previous quarter',
          note: getNote(subQuarters(period.from, 1), endOfDay(subQuarters(period.to, 1)))
        },
        {
          value: 'Previous year',
          note: getNote(subYears(period.from, 1), endOfDay(subYears(period.to, 1)))
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

  useEffect(() => {
    if (
      !props.defaultPeriod?.from &&
      !props.defaultPeriod?.to &&
      props.defaultPeriod?.relativeTimeString
    ) {
      const [from, to] = dateParser(props.defaultPeriod?.relativeTimeString, 'UTC');

      if (!from || !to) return;

      props.defaultPeriod.from = new Date(from);

      props.defaultPeriod.to = new Date(to);
    }
  }, [props]);

  return (
    <Container title={props.title}>
      <div className="flex items-center h-10">
        <div className="grow basis-0 max-w-96 h-full">
          <DateRangePicker
            value={period}
            onChange={(period) => {
              setPeriod(period as TimeRange);

              props.onChangePeriod((period as TimeRange) || null);

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
        <div className="shrink whitespace-nowrap text-[14px] font-semibold text-[#505775] mx-3 leading-none">
          compare to
        </div>
        <div className="grow basis-0 max-w-[150px] h-full">
          <Dropdown
            unclearable
            minDropdownWidth={320}
            defaultValue={compareOption}
            options={comparisonOptions}
            placeholder="Comparison"
            onChange={(value) => {
              setCompareOption(value);

              if (value === 'No comparison') {
                setComparison(null);

                props.onChangeComparison(null);

                return;
              }

              if (!period?.from || !period?.to) return;

              if (value === 'Previous month') {
                const update = {
                  relativeTimeString: '',
                  from: subMonths(period.from, 1),
                  to: endOfDay(subMonths(period.to, 1))
                };

                setComparison(update);

                props.onChangeComparison(update);

                return;
              }

              if (value === 'Previous quarter') {
                const update = {
                  relativeTimeString: '',
                  from: subQuarters(period.from, 1),
                  to: endOfDay(subQuarters(period.to, 1))
                };

                setComparison(update);

                props.onChangeComparison(update);

                return;
              }

              if (value === 'Previous year') {
                const update = {
                  relativeTimeString: '',
                  from: subYears(period.from, 1),
                  to: endOfDay(subYears(period.to, 1))
                };

                setComparison(update);

                props.onChangeComparison(update);

                return;
              }

              // Previous period
              const days = Math.abs(differenceInCalendarDays(period.from, period.to)) + 1;

              const update = {
                relativeTimeString: '',
                from: subDays(period.from, days),
                to: endOfDay(subDays(period.to, days))
              };

              setComparison(update);

              props.onChangeComparison(update);
            }}
            property={valueProp}
          />
        </div>
        {!!props.showGranularity && (
          <div className="grow basis-0 max-w-[115px] h-full ml-3">
            <Dropdown
              unclearable
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
