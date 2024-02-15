import { dateParser } from '@cubejs-backend/api-gateway/dist/src/dateParser';
import { Dimension, Granularity, TimeRange } from '@embeddable.com/core';
import { DataResponse } from '@embeddable.com/react';
import { differenceInSeconds, endOfDay } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';

import Container from '../../Container';
import DateRangePicker from '../DateRangePicker';
import Dropdown from '../Dropdown';
import { Inputs } from './ComparisonFilter.emb';

const granularityProperty: Dimension = {
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

export type Props = Inputs & {
  onChangePeriod: (v: TimeRange | null) => void;
  onChangeComparison: (v: TimeRange | null) => void;
  onChangeGranularity: (v: Granularity | null) => void;
};

export default (props: Props) => {
  const [period, setPeriod] = useState(props.defaultPeriod);
  const [comparison, setComparison] = useState(props.defaultComparison);
  const [granularity, setGranularity] = useState(props.defaultGranularity);

  const granularityOptions: DataResponse = useMemo(() => {
    const data: { value: Granularity }[] = [];
    const granularities = Object.keys(minDuration);
    const difference = differenceInSeconds(period?.to || new Date(), period?.from || new Date());

    granularities.forEach((value) => {
      if (minDuration[value] > difference) return;

      data.push({ value: value as Granularity });
    });

    return {
      isLoading: false,
      data
    };
  }, [[period]]);

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
            }}
          />
        </div>
        <div className="shrink whitespace-nowrap text-[14px] font-semibold text-[#505775] mx-3 leading-none">
          compare to
        </div>
        <div className="grow basis-0 max-w-96 h-full">
          <DateRangePicker
            value={comparison}
            onChange={(comparison) => {
              if (comparison?.to) comparison.to = endOfDay(comparison.to);

              setComparison(comparison as TimeRange);

              props.onChangePeriod((comparison as TimeRange) || null);
            }}
          />
        </div>
        {!!props.showGranularity && (
          <div className="grow basis-0 max-w-44 h-full ml-3">
            <Dropdown
              defaultValue={granularity}
              options={granularityOptions}
              property={granularityProperty}
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
