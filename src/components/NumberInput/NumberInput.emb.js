import { defineComponent } from '@embeddable.com/react';

import NumberInput from './NumberInput';

export const meta = {
  name: 'NumberInput',
  label: 'Number Input',
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

export default defineComponent(NumberInput, meta, {
  props: ({ value }) => ({ value }),
  events: {
    onChange: (value) => ({ value })
  }
});
