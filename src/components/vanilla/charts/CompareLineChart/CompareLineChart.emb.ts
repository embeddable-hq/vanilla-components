import { OrderBy, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'CompareLineChart',
  label: 'Line comparison (time-series)',
  classNames: ['inside-card'],
  category: 'Charts: time-series comparison',
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset',
      defaultValue: false,
      category: 'Chart data',
    },
    {
      name: 'xAxis',
      type: 'dimension',
      label: 'X-Axis',
      config: {
        dataset: 'ds',
        supportedTypes: ['time'],
      },
      category: 'Chart data',
    },
    {
      name: 'comparisonXAxis',
      type: 'dimension',
      label: 'Comparison X-Axis (optional)',
      config: {
        dataset: 'ds',
        supportedTypes: ['time'],
      },
      category: 'Chart data',
    },
    {
      name: 'metrics',
      type: 'measure',
      array: true,
      label: 'Metrics',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'granularity',
      type: 'granularity',
      label: 'Granularity',
      defaultValue: 'day',
      category: 'Variables to configure',
    },
    {
      name: 'timeFilter',
      type: 'timeRange',
      label: 'Primary date range',
      description: 'Date range',
      category: 'Variables to configure',
    },
    {
      name: 'prevTimeFilter',
      type: 'timeRange',
      label: 'Comparison date range',
      description: 'Date range',
      category: 'Variables to configure',
    },
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the chart',
      category: 'Chart settings',
    },
    {
      name: 'description',
      type: 'string',
      label: 'Description',
      description: 'The description for the chart',
      category: 'Chart settings',
    },
    {
      name: 'xAxisTitle',
      type: 'string',
      label: 'X-Axis Title',
      category: 'Chart settings',
    },
    {
      name: 'comparisonXAxisTitle',
      type: 'string',
      label: 'Comparison X-Axis Title (optional)',
      description: 'Title for the comparison X-Axis',
      category: 'Chart settings',
      defaultValue: '',
    },
    {
      name: 'yAxisTitle',
      type: 'string',
      label: 'Y-Axis Title',
      category: 'Chart settings',
    },
    {
      name: 'showLabels',
      type: 'boolean',
      label: 'Show Labels',
      category: 'Chart settings',
      defaultValue: false,
    },
    {
      name: 'applyFill',
      type: 'boolean',
      label: 'Color fill space under line',
      category: 'Chart settings',
      defaultValue: false,
    },
    {
      name: 'yAxisMin',
      type: 'number',
      label: 'Y-Axis minimum value',
      category: 'Chart settings',
    },
    {
      name: 'showLegend',
      type: 'boolean',
      label: 'Show Legend',
      category: 'Chart settings',
      defaultValue: true,
    },
    {
      name: 'enableDownloadAsCSV',
      type: 'boolean',
      label: 'Show download as CSV',
      category: 'Export options',
      defaultValue: true,
    },
    {
      name: 'enableDownloadAsPNG',
      type: 'boolean',
      label: 'Show download as PNG',
      category: 'Export options',
      defaultValue: true,
    },
    {
      name: 'dps',
      type: 'number',
      label: 'Decimal Places',
      category: 'Formatting',
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    const orderProp: OrderBy[] = [];

    orderProp.push({
      property: inputs.xAxis,
      direction: 'desc',
    });

    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        limit: 500,
        orderBy: orderProp,
        timeDimensions: [
          {
            dimension: inputs.xAxis?.name,
            granularity: inputs.granularity,
          },
          ...(inputs.comparisonXAxis
            ? [
                {
                  dimension: inputs.comparisonXAxis.name,
                  granularity: inputs.granularity,
                },
              ]
            : []),
        ],
        measures: inputs.metrics,
        filters:
          inputs.timeFilter && inputs.xAxis
            ? [
                {
                  property: inputs.xAxis,
                  operator: 'inDateRange',
                  value: inputs.timeFilter,
                },
              ]
            : undefined,
      }),
      prevResults: loadData({
        from: inputs.ds,
        timeDimensions: [
          {
            dimension: inputs.xAxis?.name,
            granularity: inputs.granularity,
          },
        ],
        limit: !inputs.prevTimeFilter ? 1 : 500,
        orderBy: orderProp,
        measures: inputs.metrics,
        filters:
          inputs.prevTimeFilter && inputs.xAxis
            ? [
                {
                  property: inputs.xAxis,
                  operator: 'inDateRange',
                  value: {
                    from: inputs.prevTimeFilter.from,
                    relativeTimeString: '',
                    to: inputs.prevTimeFilter.to,
                  },
                },
              ]
            : undefined,
      }),
    };
  },
});
