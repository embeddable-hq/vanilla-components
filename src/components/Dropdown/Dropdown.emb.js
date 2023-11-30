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
      defaultValue: false
    },
    {
      name: 'value',
      type: 'string',
      label: 'Value'
    },
    {
      name: 'property',
      type: 'dimension',
      label: 'Property',
      config: {
        dataset: 'ds'
      }
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
      name: 'Dropdown Value',
      type: 'string',
      defaultValue: '',
      inputs: ['value'],
      events: [{ name: 'onChange', property: 'value' }]
    }
  ]
};

export default defineComponent(Dropdown, meta, {
  props: (props) => {
    return {
      ...props,
      options: loadData({
        from: props.ds,
        dimensions: [props.property]
      })
    };
  },
  events: {
    onChange: (option) => {
      return { value: option.value };
    }
  }
});
