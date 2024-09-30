import { loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'MultiDimensionLineChart',
  label: 'Multi-dimension line (time-series)',
  classNames: ['inside-card'],
  category: 'Charts: time-series',
  inputs: [
    {
        name: 'ds',
        type: 'dataset',
        label: 'Dataset to display',
        category: 'Chart data'
    },
    {
        name: 'xAxis',
        type: 'dimension',
        label: 'X-Axis',
        config: {
            dataset: 'ds',
            supportedTypes: ['time']
        },
        category: 'Chart data'
    },
    {
        name: 'segment',
        type: 'dimension',
        label: 'Segment',
        config: {
            dataset: 'ds'
        },
        category: 'Chart data'
    },
    {
        name: 'metric',
        type: 'measure',
        label: 'Metric',
        config: {
            dataset: 'ds'
        },
        category: 'Chart data'
    },
    {
        name: 'granularity',
        type: 'granularity',
        label: 'Granularity',
        defaultValue: 'week',
        category: 'Variables to configure'
    },
    {
        name: 'title',
        type: 'string',
        label: 'Title',
        description: 'The title for the chart',
        category: 'Chart settings'
    },
    {
        name: 'description',
        type: 'string',
        label: 'Description',
        description: 'The description for the chart',
        category: 'Chart settings'
    },
    {
        name: 'showLegend',
        type: 'boolean',
        label: 'Show legend',
        defaultValue: true,
        category: 'Chart settings'
    },
    {
        name: 'maxSegments',
        type: 'number',
        label: 'Max Legend Items',
        defaultValue: 8,
        category: 'Chart settings'
    },
    {
        name: 'showLabels',
        type: 'boolean',
        label: 'Show Labels',
        defaultValue: false,
        category: 'Chart settings'
    },
    {
        name: 'yAxisMin',
        type: 'number',
        label: 'Y-Axis minimum value',
        category: 'Chart settings'
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
        defaultValue: true
    }
  ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      isMultiDimensionLine: true,
      results: loadData({
        from: inputs.ds,
        timeDimensions: [
          {
            dimension: inputs.xAxis?.name,
            granularity: inputs.granularity
          }
        ],
        dimensions: [inputs.segment],
        measures: [inputs.metric],
        filters: [{
          property: inputs.xAxis,
          operator: 'notEquals',
          value: [null as any]
        }]
      })
    };
  }
});
