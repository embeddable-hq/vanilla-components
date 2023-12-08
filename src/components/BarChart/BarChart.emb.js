import { loadData } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import BarChart from './BarChart';

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
      name: 'xAxisLabel',
      type: 'dimension',
      label: 'X-Axis',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'xAxis',
      type: 'dimension',
      label: 'X-Axis Label',
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
      name: 'maxXaxisItems',
      type: 'number',
      label: 'Max X-Axis Items'
    },
    {
      name: 'maxLabels',
      type: 'number',
      label: 'Max Labels'
    }
  ],
  events: []
};

export default defineComponent(BarChart, meta, {
  props: (props) => {
    return {
      ...props,
      columns: loadData({
        from: props.ds,
        dimensions: [props.xAxisLabel, props.xAxis].filter((g) => !!g),
        measures: [props.metric]
      })
    };
  }
});
