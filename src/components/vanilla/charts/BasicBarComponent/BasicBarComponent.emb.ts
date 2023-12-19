import { defineComponent } from '@embeddable.com/react';
import { loadData } from '@embeddable.com/core';

import Component from './index';

export const meta = {
  name: 'BasicBarComponent',
  label: 'Basic Bar',
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
      name: 'xAxis',
      type: 'dimension',
      label: 'X-Axis',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: "metrics",
      type: "measure",
      array: true,
      label: "Metrics",
      config: {
        dataset: "ds",
      },
    },
    {
      name: 'showLegend',
      type: 'boolean',
      label: 'Show legend',
    },
    {
      name: 'showLabels',
      type: 'boolean',
      label: 'Show Labels'
    },
    {
      name: 'yAxisMin',
      type: 'number',
      label: 'Y-Axis minimum value',
    },
  ],
};

export default defineComponent(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        dimensions: [inputs.xAxis],
        measures: inputs.metrics,
      })
    };
  }
});