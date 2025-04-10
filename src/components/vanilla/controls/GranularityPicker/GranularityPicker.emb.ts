import { Value, loadData, Granularity } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component, { Props } from './index';

export const meta = {
  name: 'GranularityPicker',
  label: 'Granularity Picker',
  defaultWidth: 200,
  defaultHeight: 80,
  classNames: ['on-top'],
  category: 'Controls: inputs & dropdowns',
  inputs: [
    {
      name: 'defaultValue',
      type: 'granularity',
      label: 'Default granularity',
      category: 'Chart settings',
    },
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      defaultValue: '',
      category: 'Chart settings',
    },
    ...[
      { value: 'second', defaultValue: false },
      { value: 'minute', defaultValue: false },
      { value: 'hour', defaultValue: false },
      { value: 'day', defaultValue: true },
      { value: 'week', defaultValue: true },
      { value: 'month', defaultValue: true },
      { value: 'quarter', defaultValue: true },
      { value: 'year', defaultValue: true },
    ].map((option: { value: string; defaultValue: boolean }) => ({
      name: option.value,
      type: 'boolean' as const,
      label: `Display ${option.value}`,
      defaultValue: option.defaultValue,
      category: 'Granularity options',
    })),
  ],
  events: [
    {
      name: 'onChange',
      label: 'Change Granularity',
      properties: [
        {
          name: 'value',
          type: 'granularity',
        },
        {
          name: 'dateRange',
          type: 'timeRange',
        },
      ],
    },
  ],
  variables: [
    {
      name: 'granularity',
      type: 'granularity',
      defaultValue: 'day',
      inputs: ['defaultValue'],
      events: [{ name: 'onChange', property: 'value' }],
    },
    {
      name: 'date range',
      type: 'timeRange',
      defaultValue: { relativeTimeString: 'Last 30 days' },
      events: [{ name: 'onChange', property: 'dateRange' }],
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
    };
  },
  events: {
    onChange: ({ value, dateRange }) => {
      if (!dateRange.relativeTimeString) {
        return {
          value: value,
          dateRange: Value.noFilter(),
        };
      }
      return {
        value: value,
        dateRange: dateRange,
      };
    },
  },
});
