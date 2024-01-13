import { loadData } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'BarChart',
  label: 'Bar Chart',
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
        dataset: 'ds'
      },
      category: 'Configure chart'
    },
    // {
    //   name: 'label',
    //   type: 'dimension',
    //   label: '2nd dimension',
    //   config: {
    //     dataset: 'ds'
    //   }
    // },
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
    },
    {
      name: 'maxXAxisItems',
      type: 'number',
      label: 'Max X-Axis Items',
      category: 'Chart settings'
    },
    // {
    //   name: 'maxLabels',
    //   type: 'number',
    //   label: 'Max Labels'
    // }
  ],
};

export default defineComponent(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      columns: loadData({
        from: inputs.ds,
        dimensions: [inputs.xAxis],
        measures: [inputs.metric]
      })
    };
  }
});
