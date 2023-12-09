import { defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'TextInput',
  label: 'Text Input',
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title'
    },
    {
      name: 'value',
      type: 'string',
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
          type: 'string'
        }
      ]
    }
  ],
  variables: [
    {
      name: 'Text Value',
      type: 'string',
      defaultValue: '',
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
      return { value };
    }
  }
});
