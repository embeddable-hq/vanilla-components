import { Dataset, Dimension, Measure, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'PieChart',
  label: 'Chart: Pie',
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
      label: 'Dataset to display',
      category: 'Configure chart'
    },
    {
      name: 'slice',
      type: 'dimension',
      label: 'Slice',
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
      name: 'showLegend',
      type: 'boolean',
      label: 'Turn on the legend',
      defaultValue: true,
      category: 'Chart settings'
    },
    {
      name: 'maxSegments',
      type: 'number',
      label: 'Max Legend items',
      defaultValue: 8,
      category: 'Chart settings'
    },
    {
      name: 'showLabels',
      type: 'boolean',
      label: 'Show Labels',
      defaultValue: false,
      category: 'Chart settings'
    }
  ]
};

export type Inputs = {
  title?: string;
  ds: Dataset;
  slice: Dimension;
  metric: Measure;
  maxSegments?: number;
  showLabels?: boolean;
  showLegend?: boolean;
};

export default defineComponent<Inputs>(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        dimensions: [inputs.slice],
        measures: [inputs.metric]
      })
    };
  }
});
