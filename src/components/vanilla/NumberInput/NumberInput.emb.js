import { Value } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import NumberInput from './NumberInput';

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
      defaultValue: null,
      inputs: ['value'],
      events: [{ name: 'onChange', property: 'value' }]
    }
  ]
};

export default defineComponent(NumberInput, meta, {
  props: (props) => ({ ...props }),
  events: {
    onChange: (value) => {
      const noValue = typeof value !== 'number' && !value;

      return { value: noValue ? Value.noFilter() : parseFloat(`${value}`) };
    }
  }
});
