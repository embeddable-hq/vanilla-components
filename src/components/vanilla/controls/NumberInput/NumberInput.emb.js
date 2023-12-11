import { Value } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'NumberInput',
  label: 'Number Input',
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title'
    },
    {
      name: 'value',
      type: 'number',
      label: 'Value'
    }
  ],
  events: [
    {
      name: 'onChange',
      label: 'Change',
      properties: [
        {
          name: 'value',
          type: 'number'
        }
      ]
    }
  ],
  variables: [
    {
      name: 'Number Value',
      type: 'number',
      defaultValue: Value.noFilter(),
      inputs: ['value'],
      events: [{ name: 'onChange', property: 'value' }]
    }
  ]
};

export default defineComponent(Component, meta, {
  props: (inputs) => ({ 
    ...inputs 
  }),
  events: {
    onChange: (value) => {
      const noValue = typeof value !== 'number' && !value;

      return { value: noValue ? Value.noFilter() : parseFloat(`${value}`) };
    }
  }
});
