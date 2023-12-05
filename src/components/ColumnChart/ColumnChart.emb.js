import { loadData } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import ColumnChart from './ColumnChart';

export const meta = {
  name: 'ColumnChart',
  label: 'Column Chart',
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

export default defineComponent(ColumnChart, meta, {
  props: (props) => {
    return {
      ...props,
      columns: loadData({
        from: props.ds,
        dimensions: [props.groupingA, props.groupingB].filter((g) => !!g),
        measures: [props.count]
      })
    };
  }
});
