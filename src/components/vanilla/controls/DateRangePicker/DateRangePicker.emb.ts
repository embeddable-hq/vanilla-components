import { Value } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'DateRangePicker',
  label: 'Control: Date Range',
  defaultWidth: 300,
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
      name: 'value',
      type: 'timeRange',
      label: 'Initial value',
      category: 'Settings'
    }
  ],
  events: [
    {
      name: 'onChange',
      label: 'Change',
      properties: [
        {
          name: 'value',
          type: 'timeRange',
          label: 'Date range'
        }
      ]
    }
  ],
  variables: [
    {
      name: 'date range value',
      type: 'timeRange',
      defaultValue: Value.noFilter(),
      inputs: ['value'],
      events: [{ name: 'onChange', property: 'value' }]
    }
  ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs) => ({
    ...inputs
  }),
  events: {
    onChange: (value) => {
      return { value };
    }
  }
});
