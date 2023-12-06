import { loadData } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import MeasureSeries from './MeasureSeries';

export const meta = {
  name: 'MeasureSeries',
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
      name: 'measures',
      type: 'measure',
      label: 'Measures',
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

export default defineComponent(MeasureSeries, meta, {
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
