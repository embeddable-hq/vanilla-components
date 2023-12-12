import { defineComponent } from '@embeddable.com/react';
import { Value } from '@embeddable.com/core';

import Component from './index';

export const meta = {
  name: 'DateRangePicker',
  label: 'Date Range Picker',
  classNames: ['on-top'],
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
      defaultValue: Value.noFilter(),
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
    onChange: (value) => {
      console.log('DateRangePicker.onChange', value)
      return ({ value });
    } 
  }
});
