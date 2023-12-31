import { loadData, Value } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta } from '@embeddable.com/react';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'Dropdown',
  label: 'Dropdown',
  classNames: ['on-top'],
  inputs: [
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
          name: 'value',
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
      events: [{ name: 'onChange', property: 'value' }]
    }
  ]
};

export default defineComponent(Component, meta, {
  props: (inputs: any, [embState]) => {
    return {
      ...inputs,
      options: loadData({
        from: inputs.ds,
        dimensions: [inputs.property],
        limit: 20,
        filters:
          embState?.search && inputs.property
            ? [
                {
                  operator: 'contains',
                  property: inputs.property,
                  value: embState?.search
                }
              ]
            : undefined
      })
    };
  },
  events: {
    onChange: (value) => {
      return {
        value: value || Value.noFilter()
      };
    }
  }
});
