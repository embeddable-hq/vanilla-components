import { loadData } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'KPIChart',
  label: 'KPI',
  classNames: ['inside-card'],
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the chart',
      category: 'Configure chart'
    },
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset',
      defaultValue: false,
      category: 'Configure chart'
    },
    {
      name: 'metric',
      type: 'measure',
      label: 'KPI',
      config: {
        dataset: 'ds'
      },
      category: 'Configure chart'
    },
    {
      name: 'prefix',
      type: 'string',
      label: 'Prefix',
      description: 'Prefix',
      category: 'Chart settings'
    },
    {
      name: 'suffix',
      type: 'string',
      label: 'Suffix',
      description: 'Suffix',
      category: 'Chart settings'
    }
  ],
  events: []
};

export default defineComponent(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      value: loadData({
        from: inputs.ds,
        measures: [inputs.metric]
      })
    };
  }
});
