import { loadData } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import LineChart from './LineChart';

export const meta = {
  name: 'LineChart',
  label: 'Line Chart',
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
      name: 'groupingA',
      type: 'dimension',
      label: 'Grouping A',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'groupingB',
      type: 'dimension',
      label: 'Grouping B',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'count',
      type: 'measure',
      label: 'Count',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'showLabels',
      type: 'boolean',
      label: 'Show Labels'
    },
    {
      name: 'Showlegend',
      type: 'boolean',
      label: 'Show Legend'
    }
  ],
  events: []
};

export default defineComponent(LineChart, meta, {
  props: (props) => {
    return {
      ...props,
      line: loadData({
        from: props.ds,
        dimensions: [props.groupingA, props.groupingB].filter((g) => !!g),
        measures: [props.count]
      })
    };
  }
});
