import { DimensionOrMeasure, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component, { Props } from './index';

export const meta = {
  name: 'DynamicAxisBar',
  label: 'Dynamic-axis bar chart',
  classNames: ['inside-card'],
  category: 'Misc',
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset to download from',
      category: 'Chart data',
    },
    {
      name: 'xAxis',
      type: 'dimension',
      label: 'Default X-axis',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'xAxisOptions',
      type: 'dimension',
      array: true,
      label: 'X-axis options',
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
      name: 'granularity',
      type: 'granularity',
      label: 'Granularity (for dates)',
      defaultValue: 'week',
      category: 'Variables to configure',
    },
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the button',
      category: 'Chart settings',
    },
    {
      name: 'description',
      type: 'string',
      label: 'Description',
      description: 'The description for the button',
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
      name: 'reverseXAxis',
      type: 'boolean',
      label: 'Reverse X Axis',
      category: 'Chart settings',
      defaultValue: false,
    },
    {
      name: 'dps',
      type: 'number',
      label: 'Decimal Places',
      category: 'Formatting',
    },
    {
      name: 'enableDownloadAsPNG',
      type: 'boolean',
      label: 'Show download as PNG',
      category: 'Export options',
      defaultValue: true,
    },
    {
      name: 'enableDownloadAsCSV',
      type: 'boolean',
      label: 'Show download as CSV',
      category: 'Export options',
      defaultValue: true,
    },
  ],
} as const satisfies EmbeddedComponentMeta;

type EmbeddableState = {
  page: number;
  dimension?: {
    title: string;
    nativeType: 'string' | 'number' | 'boolean' | 'time';
    name: string;
    __type__: 'dimension';
  };
};

export default defineComponent<Props, typeof meta, EmbeddableState>(Component, meta, {
  props: (inputs: Inputs<typeof meta>, [embState]) => {
    const selectedDimension: DimensionOrMeasure = embState?.dimension?.title
      ? embState.dimension
      : inputs.xAxis;

    const isTimeDimension = selectedDimension.nativeType === 'time';

    return {
      ...inputs,
      reverseXAxis: inputs.reverseXAxis || isTimeDimension,
      results: isTimeDimension
        ? loadData({
            from: inputs.ds,
            timeDimensions: [
              {
                dimension: selectedDimension.name,
                granularity: inputs.granularity,
              },
            ],
            measures: inputs.metrics,
            orderBy: [
              {
                property: selectedDimension,
                direction: 'desc',
              },
            ],
            limit: 100,
          })
        : loadData({
            from: inputs.ds,
            dimensions: [selectedDimension],
            measures: inputs.metrics,
            orderBy: [
              {
                property: inputs.metrics[0],
                direction: 'desc',
              },
            ],
            limit: 100,
          }),
    };
  },
});
