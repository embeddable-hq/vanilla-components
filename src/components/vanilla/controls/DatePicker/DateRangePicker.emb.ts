import { Granularity, TimeRange, Value } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import { endOfDay, getUnixTime, startOfDay } from 'date-fns';

import { timeRangeToUTC } from '../../../util/timezone';
import Component from './index';

export const meta = {
  name: 'DateRangePicker',
  label: 'Date range picker',
  defaultWidth: 300,
  defaultHeight: 50,
  classNames: ['on-top'],
  category: 'Controls: inputs & dropdowns',
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      category: 'Settings',
    },
    {
      name: 'showGranularity',
      type: 'boolean',
      label: 'Show granularity picker',
      category: 'Settings',
      defaultValue: false,
    },
    {
      name: 'value',
      type: 'timeRange',
      label: 'Primary date range',
      category: 'Pre-configured variables',
    },
    {
      name: 'defaultGranularity',
      type: 'granularity',
      label: 'Default granularity',
      category: 'Pre-configured variables',
    },
  ],
  events: [
    {
      name: 'onChange',
      label: 'Change Period',
      properties: [
        {
          name: 'value',
          type: 'timeRange',
          label: 'value',
        },
      ],
    },
    {
      name: 'onChangeGranularity',
      label: 'Change Granularity',
      properties: [
        {
          name: 'value',
          type: 'granularity',
          label: 'value',
        },
      ],
    },
  ],
  variables: [
    {
      name: 'date range value',
      type: 'timeRange',
      inputs: ['value'],
      defaultValue: { relativeTimeString: 'Last 30 days' },
      events: [{ name: 'onChange', property: 'value' }],
    },
    {
      name: 'granularity',
      type: 'granularity',
      inputs: ['defaultGranularity'],
      defaultValue: 'day',
      events: [{ name: 'onChangeGranularity', property: 'value' }],
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  /* @ts-expect-error - to be fixed in @embeddable.com/react */
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
    };
  },
  events: {
    onChange: (v) => {
      if (!v) return { value: Value.noFilter() };

      let value: TimeRange;
      if (getUnixTime(v.to) - getUnixTime(v.from) < 86400) {
        value = timeRangeToUTC(v);
      } else {
        value = timeRangeToUTC({ ...v, from: startOfDay(v.from), to: endOfDay(v.to) });
      }

      // const value = timeRangeToUTC({ ...v, from: startOfDay(v.from), to: endOfDay(v.to) });
      console.log('v', value);

      return { value: value ? value : Value.noFilter() };
    },
    onChangeGranularity: (value) => {
      console.log('g', value);
      return { value: value || Value.noFilter() };
    },
  },
});
