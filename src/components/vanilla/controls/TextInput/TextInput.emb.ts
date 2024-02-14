import { Value } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'TextInput',
  label: 'Control: Text',
  defaultWidth: 300,
  defaultHeight: 40,
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

export type Inputs = {
  title?: string;
  value?: string;
  placeholder: string;
};

export default defineComponent<Inputs>(Component, meta, {
  props: (inputs) => ({
    ...inputs
  }),
  events: {
    onChange: (value) => {
      return { value: value || Value.noFilter() };
    }
  }
});
