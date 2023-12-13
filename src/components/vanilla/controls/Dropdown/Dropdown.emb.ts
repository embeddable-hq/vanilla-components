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
          name: 'chosenValue',
          type: 'string'
        },
        {
          name: 'search',
          type: 'string'
        },
      ]
    }
  ],
  variables: [
    {
      name: 'dropdown choice',
      type: 'string',
      defaultValue: Value.noFilter(),
      inputs: ['defaultValue'],
      events: [{ name: 'onChange', property: 'chosenValue' }]
    },
    {
      name: 'dropdown search',
      type: 'string',
      defaultValue: Value.noFilter(),
      inputs: [],
      events: [{ name: 'onChange', property: 'search' }]
    }
  ]
};

export default defineComponent(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      options: loadData({
        from: inputs.ds,
        dimensions: [inputs.property],
        limit: 100
      })
    };
  },
  events: {
    onChange: ([chosenValue, search]) => {
      console.log('dropdown.onChange', { chosenValue, search})
      return ({ 
        chosenValue: chosenValue || Value.noFilter(),
        search: search || Value.noFilter()
      })
    }
  }
});
