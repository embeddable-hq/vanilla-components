import { Dataset, Dimension, Measure, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'BasicStackedBarComponent',
  label: 'Chart: Stacked Bar',
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
      name: 'xAxis',
      type: 'dimension',
      label: 'X-Axis',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'segment',
      type: 'dimension',
      label: 'Segment',
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
      label: 'Show legend',
      defaultValue: true
    },
    {
      name: 'maxSegments',
      type: 'number',
      label: 'Max Legend Items',
      defaultValue: 8
    },
    {
      name: 'showLabels',
      type: 'boolean',
      label: 'Show Labels',
      defaultValue: false
    },
    {
      name: 'yAxisMin',
      type: 'number',
      label: 'Y-Axis minimum value',
      defaultValue: 0
    },
    {
      name: 'displayHorizontally',
      type: 'boolean',
      label: 'Display Horizontally',
      defaultValue: false
    },
    {
      name: 'displayAsPercentage',
      type: 'boolean',
      label: 'Display as Percentages',
      defaultValue: false
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
