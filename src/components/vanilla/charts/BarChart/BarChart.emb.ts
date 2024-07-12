import { loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'BarChart',
  category: 'Charts',
  label: 'Bar',
  classNames: ['inside-card'],
  inputs: [
    {
        name: 'ds',
        type: 'dataset',
        label: 'Dataset',
        description: 'Dataset',
        defaultValue: false,
        category: 'Chart data'
    },
    {
        name: 'xAxis',
        type: 'dimension',
        label: 'X-Axis',
        config: {
            dataset: 'ds'
        },
        category: 'Chart data'
    },
    {
        name: 'metrics',
        type: 'measure',
        array: true,
        label: 'Metrics',
        config: {
            dataset: 'ds'
        },
        category: 'Chart data'
    },
    {
        name: 'sortBy',
        type: 'dimensionOrMeasure',
        label: 'Sort by (optional)',
        config: {
            dataset: 'ds'
        },
        category: 'Chart data'
    },
    {
        name: 'title',
        type: 'string',
        label: 'Title',
        description: 'The title for the chart',
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
        name: 'showLabels',
        type: 'boolean',
        label: 'Show Labels',
        category: 'Chart settings',
        defaultValue: false
    },
    {
        name: 'displayHorizontally',
        type: 'boolean',
        label: 'Display Horizontally',
        category: 'Chart settings',
        defaultValue: false
    },
    {
        name: 'stackMetrics',
        type: 'boolean',
        label: 'Stack Metrics',
        category: 'Chart settings',
        defaultValue: false
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
      results: loadData({
        from: inputs.ds,
        dimensions: [inputs.xAxis],
        measures: inputs.metrics,
        orderBy: inputs.sortBy && [
          {
            property: inputs.sortBy,
            direction: inputs.sortBy.nativeType == 'string' ? 'asc' : 'desc'
          }
        ]
      })
    };
  }
});
