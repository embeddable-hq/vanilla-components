import { dateParser } from '@cubejs-backend/api-gateway/dist/src/dateParser';
import {
  Dataset,
  Dimension,
  Granularity,
  Measure,
  TimeRange,
  loadData
} from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';
import {
  differenceInCalendarDays,
  startOfDay,
  startOfHour,
  startOfMonth,
  startOfWeek,
  subSeconds
} from 'date-fns';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'AreaChart',
  label: 'Webflow Area Chart',
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the chart'
    },
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset',
      defaultValue: false
    },
    {
      name: 'metrics',
      type: 'measure',
      label: 'Metrics',
      array: true,
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'filterDimension',
      type: 'dimension',
      label: 'Filter Dimension',
      config: {
        dataset: 'ds',
        supportedTypes: ['time']
      }
    },
    {
      name: 'filterValue',
      type: 'timeRange',
      label: 'Filter Value'
    }
  ]
};

const currToPrev: { [t: string]: string } = {
  Today: 'Yesterday',
  'This week': 'Last week',
  'This month': 'Last month',
  'This quarter': 'Last quarter',
  'This year': 'Last year'
};

type Inputs = {
  title: string;
  ds: Dataset;
  metrics: Measure[];
  filterDimension: Dimension;
  filterValue: TimeRange;
};

export default defineComponent<Inputs>(Component, meta, {
  props: (inputs) => {
    const parsed = inputs.filterValue?.relativeTimeString
      ? dateParser(inputs.filterValue?.relativeTimeString, 'UTC')
      : [];

    const from = new Date(parsed[0] || inputs.filterValue?.from || new Date());

    const to = new Date(parsed[1] || inputs.filterValue?.to || new Date());

    const days = Math.abs(differenceInCalendarDays(from, to));

    let granularity: Granularity = 'hour';

    if (days > 168) granularity = 'month';
    else if (days > 59) granularity = 'week';
    else if (days > 2) granularity = 'day';

    function startOf(d: Date) {
      if (granularity === 'hour') return startOfHour(d);
      if (granularity === 'day') return startOfDay(d);
      if (granularity === 'week') return startOfWeek(d);
      if (granularity === 'month') return startOfMonth(d);

      return d;
    }

    const previousRelativeTime = currToPrev[inputs.filterValue?.relativeTimeString];

    const prevParsed = previousRelativeTime ? dateParser(previousRelativeTime, 'UTC') : [];

    const prevTo = prevParsed[1] ? new Date(prevParsed[1]) : subSeconds(from, 1);

    const prevFrom = prevParsed[0]
      ? new Date(prevParsed[0])
      : new Date(from.valueOf() - (startOf(to).valueOf() - from.valueOf()));

    return {
      ...inputs,
      granularity,
      current: query(from, to, inputs.filterValue?.relativeTimeString),
      previous: query(prevFrom, prevTo, previousRelativeTime),
      filterValue: {
        relativeTimeString: inputs.filterValue?.relativeTimeString,
        to: to,
        from: from
      },
      previousFilterValue: {
        relativeTimeString: previousRelativeTime || '',
        from: prevFrom,
        to: prevTo
      }
    };

    function query(from: Date, to: Date, relativeTimeString?: string) {
      return loadData({
        from: inputs.ds,
        dimensions: [],
        measures: inputs.metrics,
        timeDimensions: inputs.filterDimension
          ? [
              {
                dimension: inputs.filterDimension.name,
                granularity,
                dateRange: inputs.filterValue ? relativeTimeString || [from, to] : undefined
              }
            ]
          : undefined
      });
    }
  }
});
