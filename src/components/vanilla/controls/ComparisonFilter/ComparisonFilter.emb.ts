import { Value } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import { endOfDay, startOfDay } from 'date-fns';

import TimeComparisonType from '../../../../types/TimeComparison.type.emb';
import { timeRangeToUTC } from '../../../hooks/useTimezone';
import Component from './index';

export const meta = {
  name: 'ComparisonFilter',
  label: 'Comparison filter',
  defaultWidth: 920,
  defaultHeight: 80,
  classNames: ['on-top'],
  category: 'Charts: time-series comparison',
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      category: 'Settings'
    },
    {
      name: 'showGranularity',
      type: 'boolean',
      label: 'Show granularity picker',
      category: 'Settings',
      defaultValue: true
    },
    {
      name: 'defaultComparison',
      type: TimeComparisonType,
      label: 'Default comparison option',
      defaultValue: 'Previous period',
      category: 'Settings'
    },
    {
      name: 'defaultPeriod',
      type: 'timeRange',
      label: 'Primary date range',
      category: 'Pre-configured variables'
    },
    {
      name: 'defaultGranularity',
      type: 'granularity',
      label: 'Default granularity',
      category: 'Pre-configured variables'
    },
  ],
  events: [
    {
      name: 'onChangePeriod',
      label: 'Change Period',
      properties: [
        {
          name: 'value',
          type: 'timeRange',
          label: 'value'
        }
      ]
    },
    {
      name: 'onChangeComparison',
      label: 'Change Comparison',
      properties: [
        {
          name: 'value',
          type: 'timeRange',
          label: 'value'
        }
      ]
    },
    {
      name: 'onChangeGranularity',
      label: 'Change Granularity',
      properties: [
        {
          name: 'value',
          type: 'granularity',
          label: 'value'
        }
      ]
    }
  ],
  variables: [
    {
      name: 'primary date range',
      type: 'timeRange',
      inputs: ['defaultPeriod'],
      defaultValue: { relativeTimeString: 'Last 30 days' },
      events: [{ name: 'onChangePeriod', property: 'value' }]
    },
    {
      name: 'comparison date range',
      type: 'timeRange',
      defaultValue: Value.noFilter(),
      events: [{ name: 'onChangeComparison', property: 'value' }]
    },
    {
      name: 'granularity',
      type: 'granularity',
      inputs: ['defaultGranularity'],
      defaultValue: 'day',
      events: [{ name: 'onChangeGranularity', property: 'value' }]
    }
  ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => inputs,
  events: {
    onChangePeriod: (v) => {
      if (!v) return { value: Value.noFilter() };

      const value = timeRangeToUTC({ ...v, from: startOfDay(v.from), to: endOfDay(v.to) });

      return { value: value };
    },
    onChangeComparison: (v) => {
      if (!v) return { value: Value.noFilter() };

      const value = timeRangeToUTC({ ...v, from: startOfDay(v.from), to: endOfDay(v.to) });

      return { value: value };
    },
    onChangeGranularity: (value) => {
      return { value: value || Value.noFilter() };
    }
  }
});
