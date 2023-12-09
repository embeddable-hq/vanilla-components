import { loadData } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import Dropdown from './Dropdown';

export const meta = {
  name: 'Dropdown',
  label: 'Dropdown',
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
      description: 'Dataset',
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
      name: 'dropdown value',
      type: 'string',
      defaultValue: '',
      inputs: ['defaultValue'],
      events: [{ name: 'onChange', property: 'value' }]
    }
  ]
};

export default defineComponent(Dropdown, meta, {
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
    onChange: (option) => {
      return { value: option?.value || '' };
    }
  }
});
