import { loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'SimpleKPIChart',
  label: 'Single KPI chart',
  defaultWidth: 200,
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
        category: 'Chart data'
    },
    {
        name: 'metric',
        type: 'measure',
        label: 'KPI',
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
        name: 'description',
        type: 'string',
        label: 'Description',
        description: 'The description for the chart',
        category: 'Chart settings'
    },
    {
        name: 'prefix',
        type: 'string',
        label: 'Prefix',
        description: 'Prefix',
        category: 'Chart settings'
    },
    {
        name: 'suffix',
        type: 'string',
        label: 'Suffix',
        description: 'Suffix',
        category: 'Chart settings'
    },
    {
        name: 'dps',
        type: 'number',
        label: 'Decimal Places',
        category: 'Formatting'
    },
    {
      name: 'fontSize',
      type: 'number',
      label: 'Text size in pixels',
      defaultValue: 44,
      category: 'Formatting'
    },
    {
        name: 'enableDownloadAsCSV',
        type: 'boolean',
        label: 'Show download as CSV',
        category: 'Export options',
        defaultValue: true
    },
  ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        measures: [inputs.metric],
      })
    };
  }
});
