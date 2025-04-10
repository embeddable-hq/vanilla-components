import { useEmbeddableState } from '@embeddable.com/react';
import { Dimension, Granularity } from '@embeddable.com/core';
import React, { useState } from 'react';
import Container from '../../Container';
import Dropdown from '../Dropdown';

export type Props = {
  day?: boolean;
  defaultValue: Granularity;
  hour?: boolean;
  minute?: boolean;
  month?: boolean;
  onChange: (object: object) => void;
  quarter?: boolean;
  second?: boolean;
  title?: string;
  week?: boolean;
  year?: boolean;
};

type GranularityResponse = {
  isLoading: boolean;
  data: { value: string }[];
};

export default (props: Props) => {
  const { title } = props;
  const [granularity, setGranularity] = useState(props.defaultValue);

  const options: Granularity[] = [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'quarter',
    'year',
  ];

  const timeFilters: { [key: string]: string | undefined } = {
    second: 'last 1 minute',
    minute: 'last 1 hour',
    hour: 'last 24 hours',
    day: 'last 30 days',
    week: 'last 12 months',
    month: 'last 24 months',
    quarter: 'last 24 months',
    year: undefined, //clears filter
  };

  const handleChange = (granularity: string) => {
    const eventObject = {
      value: granularity,
      dateRange: {
        to: undefined,
        from: undefined,
        relativeTimeString: timeFilters[granularity],
      },
    };
    props.onChange(eventObject);
    setGranularity(granularity as Granularity);
  };

  const granularityOptions = (): GranularityResponse => {
    const data: { value: Granularity }[] = [];
    //display options selected by user
    options.filter((option) => props[option])?.forEach((option) => data.push({ value: option }));
    return {
      isLoading: false,
      data: data,
    };
  };

  const valueProp: Dimension = {
    __type__: 'dimension',
    name: 'value',
    nativeType: 'string',
    title: 'Value',
  };

  return (
    <Container title={title}>
      <div className="flex items-center h-10 ">
        <div className="grow basis-0 h-full">
          <Dropdown
            unclearable
            minDropdownWidth={320}
            defaultValue={props.defaultValue}
            options={granularityOptions()}
            placeholder="Granularity"
            property={valueProp}
            onChange={(v) => handleChange(v)}
          />
        </div>
      </div>
    </Container>
  );
};
