import { defineComponent } from '@embeddable.com/react';
import { loadData } from '@embeddable.com/core';

import Component from './Tom';

export const meta = {
  name: 'Tom',
  label: 'Basic Line',
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
      label: 'X-axis',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'yAxis',
      type: 'measure',
      label: 'Y-axis',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'showLegend',
      type: 'boolean',
      label: 'Toggle the legend'
    }
  ],
  events: []
};

export default defineComponent(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        dimensions: [inputs.xAxis],
        measures: [inputs.yAxis]
      })
    };
  }
});
