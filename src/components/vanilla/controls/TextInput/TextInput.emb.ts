import { Value } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'TextInput',
  category: 'Controls',
  label: 'Text',
  defaultWidth: 300,
  defaultHeight: 80,
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title',
      category: 'Configuration'
    },
    {
      name: 'value',
      type: 'string',
      label: 'Initial value',
      category: 'Settings'
    },
    {
      name: 'placeholder',
      type: 'string',
      label: 'Placeholder',
      category: 'Settings'
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
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => ({
    ...inputs
  }),
  events: {
    onChange: (value) => {
      return { value: value || Value.noFilter() };
    }
  }
});