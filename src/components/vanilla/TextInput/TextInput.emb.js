import { defineComponent } from '@embeddable.com/react';

import TextInput from './TextInput';

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

export default defineComponent(TextInput, meta, {
  props: (props) => ({ ...props }),
  events: {
    onChange: (value) => {
      return { value };
    }
  }
});
