import { defineComponent } from '@embeddable.com/react';
import { Value } from '@embeddable.com/core';

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
      label: 'Initial value'
    },
    {
      name: 'placeholder',
      type: 'string',
      label: 'Placeholder'
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
      return { value: value || Value.noFilter() };
    }
  }
});
