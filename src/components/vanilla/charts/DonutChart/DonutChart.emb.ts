import { Dataset, Dimension, Measure, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'DonutChart',
  label: 'Donut Chart',
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
      label: 'Dataset',
      description: 'Dataset',
      defaultValue: false
    },
    {
      name: 'segments',
      type: 'dimension',
      label: 'Segments',
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
      name: 'showPercentages',
      type: 'boolean',
      label: 'Show as Percentage'
    },
    {
      name: 'showLabels',
      type: 'boolean',
      label: 'Show Labels'
    },
    {
      name: 'showLegend',
      type: 'boolean',
      label: 'Show Legend'
    },
    {
      name: 'maxSegments',
      type: 'number',
      label: 'Max Legend Items'
    }
  ]
};

export type Inputs = {
  title?: string;
  ds: Dataset;
  segments: Dimension;
  metric: Measure;
  showPercentages?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  maxSegments?: number;
};

export default defineComponent<Inputs>(Component, meta, {
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
