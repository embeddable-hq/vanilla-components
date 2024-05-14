import { loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import { addMilliseconds } from 'date-fns';

import Component from './index';

export const meta = {
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
      label: 'Primary date range',
      description: 'Date range',
      category: 'Chart settings'
    },
    {
      name: 'prevTimeFilter',
      type: 'timeRange',
      label: 'Comparison date range',
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
    },
    {
      name: 'dps',
      type: 'number',
      label: 'Decimal Places',
      category: 'Formatting'
    },
    {
      name: 'enableDownloadAsCSV',
      type: 'boolean',
      label: 'Show download as CSV',
      category: 'Export options',
      defaultValue: true,
    }
  ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        limit: 500,
        timeDimensions: [
          {
            dimension: inputs.xAxis?.name,
            granularity: inputs.granularity
          }
        ],
        measures: inputs.metrics,
        filters:
          inputs.timeFilter && inputs.xAxis
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
        limit: !inputs.prevTimeFilter?.from ? 1 : 500,
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
