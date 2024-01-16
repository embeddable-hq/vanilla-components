import { Dataset, Dimension, Value, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'Dropdown',
  label: 'Dropdown',
  classNames: ['on-top'],
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title'
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
          name: 'value',
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
    }
  ]
};

export type Inputs = {
  title?: string;
  property: Dimension;
  ds: Dataset;
  defaultValue?: string;
  placeholder?: string;
};

export default defineComponent<Inputs>(Component, meta, {
  props: (inputs, [embState]) => {
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
