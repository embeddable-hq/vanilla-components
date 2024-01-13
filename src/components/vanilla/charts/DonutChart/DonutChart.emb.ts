import { loadData } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'DonutChart',
  label: 'Donut Chart',
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
      name: 'segments',
      type: 'dimension',
      label: 'Segments',
      config: {
        dataset: 'ds'
      },
      category: 'Configure chart'
    },
    {
      name: 'metric',
      type: 'measure',
      label: 'Metric',
      config: {
        dataset: 'ds'
      },
      category: 'Configure chart'
    },
    {
      name: 'showPercentages',
      type: 'boolean',
      label: 'Show as Percentage',
      category: 'Chart settings'
    },
    {
      name: 'showLabels',
      type: 'boolean',
      label: 'Show Labels',
      category: 'Chart settings'
    },
    {
      name: 'showLegend',
      type: 'boolean',
      label: 'Show Legend',
      category: 'Chart settings'
    },
    {
      name: 'maxSegments',
      type: 'number',
      label: 'Max Legend Items',
      category: 'Chart settings'
    }
  ],
};

export default defineComponent(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      donut: loadData({
        from: inputs.ds,
        dimensions: [inputs.segments],
        measures: [inputs.metric]
      })
    };
  }
});
