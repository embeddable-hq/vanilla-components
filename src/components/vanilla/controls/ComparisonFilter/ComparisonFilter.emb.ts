import { Granularity, TimeRange, Value } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import TimeComparisonType from '../../../../types/TimeComparison.type.emb.js';
import { timeRangeToUTC } from '../../../hooks/useTimezone.js';
import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'ComparisonFilter',
  label: 'Control: Comparison Filter',
  defaultWidth: 920,
  defaultHeight: 80,
  classNames: ['on-top'],
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      category: 'Configuration'
    },
    {
      name: 'defaultComparison',
      type: TimeComparisonType,
      label: 'Default comparison option',
      defaultValue: 'No comparison',
      category: 'Settings'
    },
    {
      name: 'defaultPeriod',
      type: 'timeRange',
      label: 'Default period',
      category: 'Settings'
    },
    {
      name: 'defaultGranularity',
      type: 'granularity',
      label: 'Default granularity',
      category: 'Settings'
    },
    {
      name: 'showGranularity',
      type: 'boolean',
      label: 'Show granularity',
      category: 'Settings',
      defaultValue: true
    }
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
      name: 'period',
      type: 'timeRange',
      inputs: ['defaultPeriod'],
      defaultValue: Value.noFilter(),
      events: [{ name: 'onChangePeriod', property: 'value' }]
    },
    {
      name: 'comparison',
      type: 'timeRange',
      defaultValue: Value.noFilter(),
      events: [{ name: 'onChangeComparison', property: 'value' }]
    },
    {
      name: 'granularity',
      type: 'granularity',
      inputs: ['defaultGranularity'],
      defaultValue: Value.noFilter(),
      events: [{ name: 'onChangeGranularity', property: 'value' }]
    }
  ]
};

export type Inputs = {
  title?: string;
  defaultPeriod?: TimeRange;
  defaultComparison?: string;
  defaultGranularity?: Granularity;
  showGranularity?: boolean;
};

export default defineComponent<Inputs>(Component, meta, {
  props: (inputs) => inputs,
  events: {
    onChangePeriod: (v) => {
      const value = timeRangeToUTC(v);

      return { value: value || Value.noFilter() };
    },
    onChangeComparison: (v) => {
      const value = timeRangeToUTC(v);

      return { value: value || Value.noFilter() };
    },
    onChangeGranularity: (value) => {
      return { value: value || Value.noFilter() };
    }
  }
});
