import { OrderBy, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'StackedBarChart',
  label: 'Grouped bar chart',
  classNames: ['inside-card'],
  category: 'Charts: essentials',
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset to display',
      category: 'Chart data',
    },
    {
      name: 'xAxis',
      type: 'dimension',
      label: 'X-Axis',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'segment',
      type: 'dimension',
      label: 'Grouping',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'metric',
      type: 'measure',
      label: 'Metric',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'sortBy',
      type: 'dimensionOrMeasure',
      label: 'Sort by (optional)',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
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
      name: 'stackBars',
      type: 'boolean',
      label: 'Stack bars',
      defaultValue: true,
      category: 'Chart settings',
    },
    {
      name: 'showLegend',
      type: 'boolean',
      label: 'Show legend',
      defaultValue: true,
      category: 'Chart settings',
    },
    {
      name: 'maxSegments',
      type: 'number',
      label: 'Max Legend Items',
      defaultValue: 8,
      category: 'Chart settings',
    },
    {
      name: 'showLabels',
      type: 'boolean',
      label: 'Show Labels',
      defaultValue: false,
      category: 'Chart settings',
    },
    {
      name: 'showTotals',
      type: 'boolean',
      label: 'Show Totals Above Stacked Bars',
      defaultValue: false,
      category: 'Chart settings',
    },
    {
      name: 'displayHorizontally',
      type: 'boolean',
      label: 'Display Horizontally',
      defaultValue: false,
      category: 'Chart settings',
    },
    {
      name: 'reverseXAxis',
      type: 'boolean',
      label: 'Reverse X Axis',
      category: 'Chart settings',
      defaultValue: false,
    },
    {
      name: 'displayAsPercentage',
      type: 'boolean',
      label: 'Display as Percentages',
      defaultValue: false,
      category: 'Chart settings',
    },
    {
      name: 'dps',
      type: 'number',
      label: 'Decimal Places',
      category: 'Formatting',
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
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    const orderProp: OrderBy[] = [];

    if (inputs.sortBy) {
      orderProp.push({
        property: inputs.sortBy,
        direction: inputs.sortBy.nativeType == 'string' ? 'asc' : 'desc',
      });
    }

    return {
      ...inputs,
      isGroupedBar: true,
      results: loadData({
        from: inputs.ds,
        dimensions: [inputs.xAxis, inputs.segment],
        measures: [inputs.metric],
        orderBy: orderProp,
      }),
    };
  },
});
