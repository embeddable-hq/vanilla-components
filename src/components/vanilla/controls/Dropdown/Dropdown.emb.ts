import { Value, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component, { Props } from './index';

export const meta = {
  name: 'Dropdown',
  label: 'Dropdown',
  defaultWidth: 300,
  defaultHeight: 80,
  classNames: ['on-top'],
  category: 'Controls: inputs & dropdowns',
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset',
      required: true,
      category: 'Dropdown values'
    },
    {
      name: 'property',
      type: 'dimension',
      label: 'Property',
      required: true,
      config: {
        dataset: 'ds'
      },
      category: 'Dropdown values'
    },
    {
      name: 'id',
      type: 'dimension',
      label: 'Id',
      required: false,
      config: {
        dataset: 'ds'
      },
      category: 'Dropdown values'
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
      label: 'Default value',
      category: 'Pre-configured variables'
    },
    {
      name: 'placeholder',
      type: 'string',
      label: 'Placeholder',
      category: 'Settings'
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Default number of options',
      defaultValue: 100,
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
        },
        {
          name: 'id',
          type: 'string'
        }
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
    },
    {
      name: 'dropdown id',
      type: 'string',
      defaultValue: Value.noFilter(),
      events: [{ name: 'onChange', property: 'id' }]
    }
  ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent<Props, typeof meta, { search: string }>(Component, meta, {
  props: (inputs: Inputs<typeof meta>, [embState]) => {
    if (!inputs.ds)
      return {
        ...inputs,
        options: [] as never
      };

    return {
      ...inputs,
      options: loadData({
        from: inputs.ds,
        dimensions: inputs.id ? [inputs.property, inputs.id] : [inputs.property],
        limit: inputs.limit || 1000,
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
    onChange: (e) => {
      return {
        value: e.value || Value.noFilter(),
        id: e.id || Value.noFilter()
      };
    }
  }
});
