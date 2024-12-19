import { OrderBy, isDimension, isMeasure, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'ScatterChart',
  label: 'Scatter chart',
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
      label: 'Metrics',
      array: true,
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
      name: 'granularity',
      type: 'granularity',
      label: 'Granularity',
      defaultValue: 'week',
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
      name: 'yAxisMin',
      type: 'number',
      label: 'Y-Axis minimum value',
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

    orderProp.push({
      property: inputs.xAxis,
      direction: 'desc',
    });

    const isTimeDimension = inputs.xAxis.nativeType === 'time';

    return {
      ...inputs,
      reverseXAxis: inputs.reverseXAxis,
      isTimeDimension: isTimeDimension,
      results: isTimeDimension
        ? loadData({
            from: inputs.ds,
            orderBy: orderProp,
            timeDimensions: [
              {
                dimension: inputs.xAxis?.name,
                granularity: inputs.granularity,
              },
            ],
            measures: inputs.metrics,
            limit: inputs.limit || 50,
          })
        : loadData({
            from: inputs.ds,
            dimensions: [inputs.xAxis],
            measures: inputs.metrics,
            limit: inputs.limit || 50,
          }),
    };
  },
});
