import { Dataset, Dimension, Measure, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'SmartifyBarList',
  label: 'Smartify Bar List',
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
      category: 'Configure chart'
    },
    {
      name: 'dimension',
      type: 'dimension',
      label: 'Dimension',
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
      name: 'dimensionHeader',
      type: 'string',
      label: 'Dimension column header',
      category: 'Chart settings'
    },
    {
      name: 'metricHeader',
      type: 'string',
      label: 'Metric column header',
      category: 'Chart settings'
    },

    {
      name: 'colorDeco',
      type: 'string',
      label: 'Top bar color'
    }
  ],
  events: []
};

export type Inputs = {
  title?: string;
  ds: Dataset;
  dimension: Dimension;
  metric: Measure;
  dimensionHeader?: string;
  metricHeader?: string;
};

export default defineComponent<Inputs>(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      columns: loadData({
        from: inputs.ds,
        dimensions: [inputs.dimension],
        measures: [inputs.metric]
      })
    };
  }
});
