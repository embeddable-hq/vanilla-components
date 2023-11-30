import { loadData } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import GranularityType from '../../types/Granularity.type.emb.js';

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
      type: GranularityType,
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
