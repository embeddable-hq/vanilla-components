import { Dataset, Dimension, Measure, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'StackedBarChart',
  label: 'Chart: Stacked Bar',
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
      name: 'xAxis',
      type: 'dimension',
      label: 'X-Axis',
      config: {
        dataset: 'ds'
      },
      category: 'Configure chart'
    },
    {
      name: 'segment',
      type: 'dimension',
      label: 'Segment',
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
      label: 'Show legend',
      defaultValue: true,
      category: 'Chart settings'
    },
    {
      name: 'maxSegments',
      type: 'number',
      label: 'Max Legend Items',
      defaultValue: 8,
      category: 'Chart settings'
    },
    {
      name: 'showLabels',
      type: 'boolean',
      label: 'Show Labels',
      defaultValue: false,
      category: 'Chart settings'
    },
    {
      name: 'displayHorizontally',
      type: 'boolean',
      label: 'Display Horizontally',
      defaultValue: false,
      category: 'Chart settings'
    },
    {
      name: 'displayAsPercentage',
      type: 'boolean',
      label: 'Display as Percentages',
      defaultValue: false,
      category: 'Chart settings'
    }
  ]
};

export type Inputs = {
  title?: string;
  ds: Dataset;
  xAxis: Dimension;
  segment: Dimension;
  metric: Measure;
  displayHorizontally?: boolean;
  displayAsPercentage?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  maxSegments?: number;
};

export default defineComponent<Inputs>(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        dimensions: [inputs.xAxis, inputs.segment],
        measures: [inputs.metric]
      })
    };
  }
});
