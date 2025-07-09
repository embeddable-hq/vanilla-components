import { Value, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component, { Props } from './index';

export const meta = {
  name: 'SelectorDimensionOrMeasure',
  label: 'Dimensions and measures single-select',
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
      type: 'dimensionOrMeasure',
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
      type: 'dimensionOrMeasure',
      label: 'Default value',
      category: 'Pre-configured variables',
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
          type: 'dimensionOrMeasure',
        },
      ],
    },
  ],
  variables: [
    {
      name: 'Dimension or measure choice',
      type: 'dimensionOrMeasure',
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
      options: (inputs.options || []).filter(
        (option) =>
          !embState?.search ||
          option.name.includes(embState.search) ||
          option.title.includes(embState.search),
      ),
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
