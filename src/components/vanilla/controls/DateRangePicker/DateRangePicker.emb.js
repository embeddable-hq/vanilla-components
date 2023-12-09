import { defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'DateRangePicker',
  label: 'Date Range Picker',
  inputs: [
    {
      name: 'value',
      type: 'timeRange',
      label: 'Initial value'
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
      defaultValue: null,
      inputs: ['value'],
      events: [{ name: 'onChange', property: 'value' }]
    }
  ]
};

export default defineComponent(Component, meta, {
  props: (inputs) => ({
    value: inputs.value
  }),
  events: {
    onChange: (value) => ({ value })
  }
});
