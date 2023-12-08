import { loadData } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import TimeSeriesLineChart1 from './TimeSeriesLineChart1';

export const meta = {
  name: 'TimeSeriesLineChart1',
  label: 'Time Series Line Chart 1',
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
      name: 'xAxisLabel',
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
    }
  ],
  events: []
};

export default defineComponent(TimeSeriesLineChart1, meta, {
  props: (props) => {
    return {
      ...props,
      line: loadData({
        from: props.ds,
        timeDimensions: props.xAxis
          ? [
              {
                dimension: props.xAxis.name,
                granularity: props.granularity
              }
            ]
          : undefined,
        dimensions: [props.xAxisLabel].filter((g) => !!g),
        measures: [props.metric]
      })
    };
  }
});
