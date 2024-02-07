import { Dataset, Dimension, Measure, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'BasicPieComponent',
  label: 'Chart: Pie',
  classNames: ['inside-card'],
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the chart'
    },
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset to display'
    },
    {
      name: 'slice',
      type: 'dimension',
      label: 'Slice',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'metric',
      type: 'measure',
      label: 'Metric',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'showLegend',
      type: 'boolean',
      label: 'Turn on the legend'
    },
    {
      name: 'maxSegments',
      type: 'number',
      label: 'Max legend items'
    },
    {
      name: 'showLabels',
      type: 'boolean',
      label: 'Show Labels'
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
