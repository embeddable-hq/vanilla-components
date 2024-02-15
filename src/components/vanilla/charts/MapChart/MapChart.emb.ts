import { Dataset, Dimension, Measure, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'MapChart',
  label: 'Chart: Map',
  defaultHeight: 650,
  defaultWidth: 1130,
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
    }
  ]
};

export type Inputs = {
  title: string;
  ds: Dataset;
  segments: Dimension;
  metric: Measure;
};

export default defineComponent<Inputs>(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      db: loadData({
        from: inputs.ds,
        dimensions: [inputs.segments],
        measures: [inputs.metric]
      })
    };
  }
});
