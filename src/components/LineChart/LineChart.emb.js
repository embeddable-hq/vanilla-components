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
      name: 'date',
      type: 'dimension',
      label: 'Date',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'granularity',
      type: 'granularity',
      label: 'Granularity'
    },
    {
      name: 'grouping',
      type: 'dimension',
      label: 'Grouping',
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
        timeDimensions: props.date
          ? [
              {
                dimension: props.date.name,
                granularity: props.granularity
              }
            ]
          : undefined,
        dimensions: [props.grouping].filter((g) => !!g),
        measures: [props.count]
      })
    };
  }
});
