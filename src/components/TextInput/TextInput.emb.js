import { defineComponent } from '@embeddable.com/react';

import TextInput from './TextInput';

export const meta = {
  name: 'TextInput',
  label: 'Text Input',
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
  ]
};

export default defineComponent(TextInput, meta, {
  props: ({ value }) => ({ value }),
  events: {
    onChange: (value) => ({ value })
  }
});
