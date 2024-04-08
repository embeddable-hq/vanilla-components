import { Value, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component, { Props } from './index';

export const meta = {
  name: 'MultiSelectDropdown',
  label: 'Control: Multi-Select Dropdown',
  defaultWidth: 300,
  defaultHeight: 80,
  classNames: ['on-top'],
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      category: 'Configuration'
    },
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset',
      category: 'Configuration'
    },
    {
      name: 'property',
      type: 'dimension',
      label: 'Property',
      config: {
        dataset: 'ds'
      },
      category: 'Configuration'
    },
    {
      name: 'defaultValue',
      type: 'string',
      array: true,
      label: 'Default value',
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
          type: 'string',
          array: true
        }
      ]
    }
  ],
  variables: [
    {
      name: 'dropdown choices',
      type: 'string',
      defaultValue: Value.noFilter(),
      array: true,
      inputs: ['defaultValue'],
      events: [{ name: 'onChange', property: 'value' }]
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
        dimensions: inputs.property ? [inputs.property] : [],
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
        value: value.length ? value : Value.noFilter()
      };
    }
  }
});
