import { loadData, Value } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'MultiSelectButtons',
  label: 'Control: Multiselect Buttons',
  defaultWidth: 400,
  defaultHeight: 80,
  inputs: [    
    {
      name: "title",
      type: "string",
      label: "Title",
    },
    {
      name: 'values',
      type: "string",
      array: true,
      label: "Value"
    }, 
    {
      name: 'defaultValue',
      type: 'string',
      array: true,
      label: 'Default value',
    },   
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
      events: [{ name: 'onChange', property: 'value'}]
    }
  ]
};

type Inputs = {
  title: string;
  values: Array<string>;
  defaultValue: string;
}

export default defineComponent<Inputs>(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
    }
  },
  events: {
    onChange: (value) => ({ value: value.length > 0 ? value : Value.noFilter() })
  }
});
