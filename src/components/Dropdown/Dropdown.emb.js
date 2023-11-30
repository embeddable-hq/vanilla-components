import { defineComponent } from '@embeddable.com/react';

import Dropdown from './Dropdown';

export const meta = {
  name: 'Dropdown',
  label: 'Dropdown',
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

export default defineComponent(Dropdown, meta, {
  props: ({ value }) => ({ value }),
  events: {
    onChange: (value) => ({ value })
  }
});
