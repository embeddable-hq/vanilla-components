import { loadData, Value } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'Dropdown',
  label: 'Dropdown',
  classNames: ['on-top'],
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the chart'
    },
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset'
    },
    {
      name: 'property',
      type: 'dimension',
      label: 'Property',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'defaultValue',
      type: 'string',
      label: 'Default value'
    }
  ],
  events: [
    {
      name: 'onChange',
      label: 'Change',
      properties: [
        {
          name: 'defaultValue',
          type: 'string'
        }
      ]
    }
  ],
  variables: [
    {
      name: 'dropdown value',
      type: 'string',
      defaultValue: Value.noFilter(),
      inputs: ['defaultValue'],
      events: [{ name: 'onChange', property: 'defaultValue' }]
    }
  ]
};

export default defineComponent(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      options: loadData({
        from: inputs.ds,
        dimensions: [inputs.property]
      })
    };
  },
  events: {
    onChange: (defaultValue) => ({ defaultValue: defaultValue || Value.noFilter() })
  }
});
