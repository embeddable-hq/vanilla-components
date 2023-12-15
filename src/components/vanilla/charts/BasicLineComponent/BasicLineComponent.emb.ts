import { defineComponent } from '@embeddable.com/react';
import { loadData } from '@embeddable.com/core';

import Component from './index';

export const meta = {
  name: 'BasicLineComponent',
  label: 'Basic Line',
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
        dataset: 'ds',
        supportedTypes: ['time']
      }
    },
    {
      name: 'granularity',
      type: 'granularity',
      label: 'Granularity'
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
      name: 'applyFill',
      type: 'boolean',
      label: 'Color fill space under line',
    },
    {
      name: 'yAxisMin',
      type: 'number',
      label: 'Y-Axis minimum value',
    },
  ],
};

const timeDimension = (dimension, granularity) => {
  return ({
    dimension: dimension.name,
    granularity: granularity
  });
}

export default defineComponent(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        timeDimensions: [
          timeDimension(inputs.xAxis, inputs.granularity)
        ],
        measures: inputs.metrics,
      })
    };
  }
});