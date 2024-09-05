import { Value } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';
import { endOfDay, startOfDay } from 'date-fns';
import { timeRangeToUTC } from '../../../hooks/useTimezone';

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
      category: 'Settings'
    },
    {
      name: 'showGranularity',
      type: 'boolean',
      label: 'Show granularity picker',
      category: 'Settings',
      defaultValue: false
    },
    {
      name: 'value',
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
      name: 'onChange',
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
      name: 'date range value',
      type: 'timeRange',
      inputs: ['value'],
      defaultValue: { relativeTimeString: 'Last 30 days' },
      events: [{ name: 'onChange', property: 'value' }]
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

  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs
    }
  },
  events: {
    onChange: (v) => {
      if (!v) return { value: Value.noFilter() };

      const value = timeRangeToUTC({ ...v, from: startOfDay(v.from), to: endOfDay(v.to) });

      return { value: value };
    },
    onChangeGranularity: (value) => {
      return { value: value || Value.noFilter() };
    }
  }
});
