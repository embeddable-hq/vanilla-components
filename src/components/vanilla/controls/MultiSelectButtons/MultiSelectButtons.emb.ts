import { Value } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'MultiSelectButtons',
  category: 'Controls',
  label: 'Multiselect Buttons',
  defaultWidth: 400,
  defaultHeight: 80,
  inputs: [
    {
      name: 'values',
      type: 'string',
      array: true,
      label: 'Values',
      category: 'Button values'
    },
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      category: 'Settings'
    },
    {
      name: 'defaultValue',
      type: 'string',
      array: true,
      label: 'Default value',
      category: 'Pre-configured variables'
    }
  ],
  events: [
    {
      name: 'onChange',
      label: 'Change',
      properties: [
        {
          name: 'value',
          type: 'string',
          array: true
        }
      ]
    }
  ],
  variables: [
    {
      name: 'chosen value',
      type: 'string',
      array: true,
      defaultValue: Value.noFilter(),
      inputs: ['defaultValue'],
      events: [{ name: 'onChange', property: 'value' }]
    }
  ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs
    };
  },
  events: {
    onChange: (value) => ({ value: value.length > 0 ? value : Value.noFilter() })
  }
});
