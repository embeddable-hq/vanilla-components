import { EmbeddableType, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import { SortDirection } from '../../../../enums/SortDirection';
import SortDirectionType from '../../../../types/SortDirection.type.emb';
import Component from './index';

export const meta = {
  name: 'KPIChartText',
  label: 'KPI text',
  defaultWidth: 300,
  defaultHeight: 150,
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
      name: 'dimension',
      type: 'dimension',
      label: 'Value to display',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'metric',
      type: 'measure',
      label: 'Show top value by',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'rowSortDirection',
      type: SortDirectionType,
      defaultValue: SortDirection.DESCENDING,
      label: 'Sort direction',
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
      name: 'displayMetric',
      type: 'boolean',
      label: 'Display metric',
      description: 'Display the metric',
      defaultValue: true,
      category: 'Chart settings',
    },
    {
      name: 'fontSize',
      type: 'number',
      label: 'Text size in pixels',
      defaultValue: 32,
      category: 'Formatting',
    },
    {
      name: 'dps',
      type: 'number',
      label: 'Metric decimal places',
      category: 'Formatting',
    },
    {
      name: 'enableDownloadAsCSV',
      type: 'boolean',
      label: 'Show download as CSV',
      category: 'Export options',
      defaultValue: false,
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
    const defaultSortDirection = inputs.rowSortDirection === 'Ascending' ? 'asc' : 'desc';

    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        measures: [inputs.metric],
        dimensions: [inputs.dimension],
        orderBy: [
          {
            property: inputs.metric,
            direction: defaultSortDirection,
          },
        ],
        limit: 1,
      }),
    };
  },
});
