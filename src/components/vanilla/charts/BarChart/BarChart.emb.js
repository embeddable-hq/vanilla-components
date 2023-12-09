import { loadData } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'BarChart',
  label: 'Bar Chart',
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
      name: 'xAxis',
      type: 'dimension',
      label: 'X-Axis',
      config: {
        dataset: 'ds'
      }
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
      }
    },
    {
      name: 'xAxisTitle',
      type: 'string',
      label: 'X-Axis Title'
    },
    {
      name: 'yAxisTitle',
      type: 'string',
      label: 'Y-Axis Title'
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
      name: 'maxXAxisItems',
      type: 'number',
      label: 'Max X-Axis Items'
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
