import { Granularity, TimeRange, Value } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'ComparisonFilter',
  label: 'Control: Comparison Filter',
  classNames: ['on-top'],
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      category: 'Configuration'
    },
    {
      name: 'defaultPeriod',
      type: 'timeRange',
      label: 'Default period',
      category: 'Settings'
    },
    {
      name: 'defaultComparison',
      type: 'timeRange',
      label: 'Default comparison',
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
      defaultValue: Value.noFilter(),
      events: [{ name: 'onChangeGranularity', property: 'value' }]
    }
  ]
};

export type Inputs = {
  title?: string;
  defaultPeriod?: TimeRange;
  defaultComparison?: TimeRange;
  defaultGranularity?: Granularity;
  showGranularity?: boolean;
};

export default defineComponent<Inputs>(Component, meta, {
  props: (inputs) => inputs,
  events: {
    onChangePeriod: (value) => {
      return { value: value || Value.noFilter() };
    },
    onChangeComparison: (value) => {
      return { value: value || Value.noFilter() };
    },
    onChangeGranularity: (value) => {
      return { value: value || Value.noFilter() };
    }
  }
});
