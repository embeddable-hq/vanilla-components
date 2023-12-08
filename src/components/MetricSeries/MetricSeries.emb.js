import { loadData } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import MetricSeries from './MetricSeries';

export const meta = {
  name: 'MetricSeries',
  label: 'Measure Series',
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
      name: 'aAxis',
      type: 'dimension',
      label: 'X-Axis',
      config: {
        dataset: 'ds',
        supportedTypes: ['time']
      }
    },
    {
      name: 'granularity',
      type: 'granularity',
      label: 'Granularity'
    },
    {
      name: 'metrics',
      type: 'measure',
      label: 'Metrics',
      array: true,
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

export default defineComponent(MetricSeries, meta, {
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
        measures: props.measures
      })
    };
  }
});
