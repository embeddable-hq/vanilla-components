import { loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';



import Component from './index';

export const meta = {
  name: 'MapChart',
  label: 'World map',
  classNames: ['inside-card'],
  defaultHeight: 650,
  defaultWidth: 1130,
  category: 'Geographical',
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
      name: 'segments',
      type: 'dimension',
      label: 'Segments',
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
        dimensions: [inputs.segments],
        measures: [inputs.metric]
      })
    };
  }
});