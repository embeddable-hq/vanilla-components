import { defineComponent } from '@embeddable.com/react';
import { loadData } from '@embeddable.com/core';

import Component from './index';

export const meta = {
  name: 'BasicPieComponent',
  label: 'Basic Pie',
  classNames: ['inside-card'],
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the chart'
    },
    {
      name: "ds",
      type: "dataset",
      label: "Dataset to display",
    },
    {
      name: "slice",
      type: "dimension",
      label: "Slice",
      config: {
        dataset: "ds",
      },
    },
    {
      name: "metric",
      type: "measure",
      label: "Metric",
      config: {
        dataset: "ds",
      },
    },
    {
      name: 'showLegend',
      type: 'boolean',
      label: 'Turn on the legend',
    },
    {
      name: 'maxSegments',
      type: 'number',
      label: 'Max legend items',
    },
    {
      name: 'showLabels',
      type: 'boolean',
      label: 'Show Labels'
    },
  ],
};

export default defineComponent(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        dimensions: [inputs.slice],
        measures: [inputs.metric],
      })
    };
  }
});