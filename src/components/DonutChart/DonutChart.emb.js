import { loadData } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import DonutChart from './DonutChart';

export const meta = {
  name: 'DonutChart',
  label: 'Donut Chart',
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
      name: 'segments',
      type: 'dimension',
      label: 'Segments',
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
      name: 'showPercentages',
      type: 'boolean',
      label: 'Show as Percentage'
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
      name: 'maxSegments',
      type: 'number',
      label: 'Max Legend Items'
    }
  ],
};

export default defineComponent(DonutChart, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      donut: loadData({
        from: inputs.ds,
        dimensions: [inputs.segments],
        measures: [inputs.metric]
      })
    };
  }
});
