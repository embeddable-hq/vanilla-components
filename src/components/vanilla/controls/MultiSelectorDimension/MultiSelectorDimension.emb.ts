import { Value } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component, { Props } from './index';
import { selectorOptionIncludesSearch } from '../Selector.utils';

export const meta = {
  name: 'MultiSelectorDimension',
  label: 'Dimensions multi-select',
  defaultWidth: 300,
  defaultHeight: 80,
  classNames: ['on-top'],
  category: 'Controls: measures and dimensions',
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset',
      category: 'Dropdown values',
    },
    {
      name: 'options',
      array: true,
      type: 'dimension',
      label: 'Choices',
      config: {
        dataset: 'ds',
      },
      category: 'Dropdown values',
      inputs: [
        {
          name: 'overrideName',
          type: 'string',
          label: 'Override name',
          description: 'Overrides the default name shown',
        },
      ],
    },
    {
      name: 'defaultValue',
      type: 'dimension',
      array: true,
      label: 'Default value',
      category: 'Pre-configured variables',
      config: {
        dataset: 'ds',
      },
    },
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      category: 'Settings',
    },

    {
      name: 'allowNoValue',
      type: 'boolean',
      label: 'Allow no value',
      category: 'Settings',
      defaultValue: false,
    },
  ],
  events: [
    {
      name: 'onChange',
      label: 'Change',
      properties: [
        {
          name: 'value',
          type: 'dimension',
          array: true,
        },
      ],
    },
  ],
  variables: [
    {
      name: 'Dimension multi choice',
      type: 'dimension',
      array: true,
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
      options: inputs.options || [],
    };
  },
  events: {
    onChange: (value) => {
      return {
        value: value || Value.noFilter(),
      };
    },
  },
});
