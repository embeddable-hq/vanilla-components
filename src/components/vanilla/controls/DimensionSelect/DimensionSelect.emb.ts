import { Dimension, Value, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component, { Props } from './index';

export const meta = {
  name: 'DimensionSelect',
  label: 'Dimension Select',
  defaultWidth: 300,
  defaultHeight: 80,
  category: 'Controls: inputs & dropdowns',
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset',
      category: 'Dropdown values',
    },
    {
      name: 'properties',
      type: 'dimension',
      label: 'Properties Available to Select',
      array: true,
      config: {
        dataset: 'ds',
      },
      category: 'Dropdown values',
    },
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      category: 'Settings',
    },
    {
      name: 'defaultValue',
      type: 'string',
      label: 'Default value',
      category: 'Pre-configured variables',
    },
    {
      name: 'placeholder',
      type: 'string',
      label: 'Placeholder',
      category: 'Settings',
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Default number of options',
      defaultValue: 100,
      category: 'Settings',
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
        },
      ],
    },
  ],
  variables: [
    {
      name: 'dimension choice',
      type: 'string',
      defaultValue: Value.noFilter(),
      inputs: ['defaultValue'],
      events: [{ name: 'onChange', property: 'value' }],
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent<Props, typeof meta, { search: string }>(Component, meta, {
  props: (inputs: Inputs<typeof meta>, [embState]) => {
    if (!inputs.ds)
      return {
        ...inputs,
        options: [] as never,
      };

    return {
      ...inputs,
      options: loadData({
        from: inputs.ds,
        dimensions: inputs.properties ? [...inputs.properties] : [],
        limit: inputs.limit || 1000,
        filters:
          embState?.search && inputs.properties
            ? [
                {
                  operator: 'contains',
                  property: inputs.properties[0],
                  value: embState?.search,
                },
              ]
            : undefined,
      }),
    };
  },
  events: {
    onChange: (value: string) => {
      const dimension: Dimension = value ? JSON.parse(value) : undefined;

      return {
        value: dimension ? JSON.stringify(dimension) : Value.noFilter(),
      };
    },
  },
});
