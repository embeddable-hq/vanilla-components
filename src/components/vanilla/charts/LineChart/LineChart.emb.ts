import { loadData } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'LineChart',
  label: 'Line chart (time-series)',
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
      label: 'Dataset',
      description: 'Dataset',
      defaultValue: false,
      category: 'Configure chart'
    },
    {
      name: 'xAxis',
      type: 'dimension',
      label: 'X-Axis',
      config: {
        dataset: 'ds',
        supportedTypes: ['time']
      },
      category: 'Configure chart'
    },
    {
      name: 'granularity',
      type: 'granularity',
      label: 'Granularity',
      category: 'Configure chart'
    },
    {
      name: 'metrics',
      type: 'measure',
      label: 'Metrics',
      array: true,
      config: {
        dataset: 'ds'
      },
      category: 'Configure chart'
    },
    {
      name: 'xAxisTitle',
      type: 'string',
      label: 'X-Axis Title',
      category: 'Chart settings'
    },
    {
      name: 'yAxisTitle',
      type: 'string',
      label: 'Y-Axis Title',
      category: 'Chart settings'
    },
    {
      name: 'showLabels',
      type: 'boolean',
      label: 'Show Labels',
      category: 'Chart settings'
    },
    {
      name: 'showLegend',
      type: 'boolean',
      label: 'Show Legend',
      category: 'Chart settings'
    }
  ],
  events: []
};

export default defineComponent(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      line: loadData({
        from: inputs.ds,
        timeDimensions: [
          {
            dimension: inputs.xAxis?.name,
            granularity: inputs.granularity
          }
        ],
        measures: inputs.metrics
      })
    };
  }
});
