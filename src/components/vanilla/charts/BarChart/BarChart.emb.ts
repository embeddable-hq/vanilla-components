import {
  isDimension,
  isMeasure,
  OrderBy,
  loadData,
  Measure,
  Dimension,
} from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'BarChart',
  label: 'Bar chart',
  classNames: ['inside-card'],
  category: 'Charts: essentials',
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
      name: 'sortBy',
      type: 'dimensionOrMeasure',
      label: 'Sort by (optional)',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Limit results',
      category: 'Chart data',
    },
    {
      name: 'lineMetrics',
      type: 'measure',
      array: true,
      label: 'Add a line(s)',
      config: {
        dataset: 'ds',
      },
      category: 'Optional chart data',
    },
    {
      name: 'showSecondYAxis',
      type: 'boolean',
      label: 'Show 2nd axis',
      category: 'Optional chart data',
      defaultValue: false,
    },
    {
      name: 'secondAxisTitle',
      type: 'string',
      label: '2nd axis title',
      description: 'The title for the chart',
      category: 'Optional chart data',
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
      name: 'showLegend',
      type: 'boolean',
      label: 'Show Legend',
      category: 'Chart settings',
      defaultValue: true,
    },
    {
      name: 'showLabels',
      type: 'boolean',
      label: 'Show Labels',
      category: 'Chart settings',
      defaultValue: false,
    },
    {
      name: 'displayHorizontally',
      type: 'boolean',
      label: 'Display Horizontally',
      category: 'Chart settings',
      defaultValue: false,
    },
    {
      name: 'stackMetrics',
      type: 'boolean',
      label: 'Stack Metrics',
      category: 'Chart settings',
      defaultValue: false,
    },
    {
      name: 'reverseXAxis',
      type: 'boolean',
      label: 'Reverse X Axis',
      category: 'Chart settings',
      defaultValue: false,
    },
    {
      name: 'xAxisTitle',
      type: 'string',
      label: 'X-Axis Title',
      category: 'Chart settings',
    },
    {
      name: 'yAxisTitle',
      type: 'string',
      label: 'Y-Axis Title',
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
    } else if (inputs.limit) {
      orderProp.push({
        property: inputs.metrics[0],
        direction: 'desc',
      });
    }

    // Allow sorting by any dimension or measure regardless of x-axis
    const dimensions = [inputs.xAxis];
    const measures = [...inputs.metrics, ...(inputs.lineMetrics || [])];
    if (inputs.sortBy && isDimension(inputs.sortBy) && !dimensions.includes(inputs.sortBy)) {
      dimensions.push(inputs.sortBy as Dimension);
    }
    if (inputs.sortBy && isMeasure(inputs.sortBy) && !measures.includes(inputs.sortBy)) {
      measures.push(inputs.sortBy as Measure);
    }

    return {
      ...inputs,
      reverseXAxis: inputs.reverseXAxis,
      results: loadData({
        from: inputs.ds,
        dimensions,
        measures,
        orderBy: orderProp,
        limit: inputs.limit || 50,
      }),
    };
  },
});
