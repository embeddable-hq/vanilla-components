import {
  Dataset,
  Dimension,
  Granularity,
  Measure,
  TimeRange,
  loadData
} from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'CompareLineChart',
  label: 'Chart: Line (time-series) comparison',
  classNames: ['inside-card'],
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the chart',
      category: 'Configure chart'
    },
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset',
      defaultValue: false,
      category: 'Configure chart'
    },
    {
      name: 'xAxis',
      type: 'dimension',
      label: 'X-Axis',
      config: {
        dataset: 'ds',
        supportedTypes: ['time']
      },
      category: 'Configure chart'
    },
    {
      name: 'granularity',
      type: 'granularity',
      label: 'Granularity',
      category: 'Configure chart'
    },
    {
      name: 'metrics',
      type: 'measure',
      array: true,
      label: 'Metrics',
      config: {
        dataset: 'ds'
      },
      category: 'Configure chart'
    },
    {
      name: 'timeFilter',
      type: 'timeRange',
      label: 'Time Filter',
      description: 'Date range',
      category: 'Chart settings'
    },
    {
      name: 'prevTimeFilter',
      type: 'timeRange',
      label: 'Previous Time Filter',
      description: 'Date range',
      category: 'Chart settings'
    },
    {
      name: 'xAxisTitle',
      type: 'string',
      label: 'X-Axis Title',
      category: 'Chart settings'
    },
    {
      name: 'yAxisTitle',
      type: 'string',
      label: 'Y-Axis Title',
      category: 'Chart settings'
    },
    {
      name: 'showLabels',
      type: 'boolean',
      label: 'Show Labels',
      category: 'Chart settings',
      defaultValue: false
    },
    {
      name: 'applyFill',
      type: 'boolean',
      label: 'Color fill space under line',
      category: 'Chart settings',
      defaultValue: false
    },
    {
      name: 'yAxisMin',
      type: 'number',
      label: 'Y-Axis minimum value',
      category: 'Chart settings'
    },
    {
      name: 'showLegend',
      type: 'boolean',
      label: 'Show Legend',
      category: 'Chart settings',
      defaultValue: true
    }
  ]
};

export type Inputs = {
  title?: string;
  ds: Dataset;
  xAxis: Dimension;
  granularity: Granularity;
  metrics: Measure[];
  timeFilter?: TimeRange;
  prevTimeFilter?: TimeRange;
  yAxisMin?: number;
  xAxisTitle?: string;
  yAxisTitle?: string;
  applyFill?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
};

export default defineComponent<Inputs>(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        timeDimensions: [
          {
            dimension: inputs.xAxis?.name,
            granularity: inputs.granularity
          }
        ],
        measures: inputs.metrics,
        filters:
          inputs.timeFilter?.from && inputs.xAxis
            ? [
                {
                  property: inputs.xAxis,
                  operator: 'inDateRange',
                  value: inputs.timeFilter
                }
              ]
            : undefined
      }),
      prevResults: loadData({
        from: inputs.ds,
        timeDimensions: [
          {
            dimension: inputs.xAxis?.name,
            granularity: inputs.granularity
          }
        ],
        limit: !inputs.prevTimeFilter?.from ? 1 : undefined,
        measures: inputs.metrics,
        filters:
          inputs.prevTimeFilter?.from && inputs.xAxis
            ? [
                {
                  property: inputs.xAxis,
                  operator: 'inDateRange',
                  value: inputs.prevTimeFilter
                }
              ]
            : undefined
      })
    };
  }
});