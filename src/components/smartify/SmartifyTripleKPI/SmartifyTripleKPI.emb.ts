import { Dataset, Measure, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'SmartifyTripleKPI',
  label: 'Smartify Triple KPI',
  inputs: [
    {
      name: 'title_1',
      type: 'string',
      label: 'Title',
      description: 'Select the chart title'
    },
    {
      name: 'title_2',
      type: 'string',
      label: 'Title of the second metric',
      description: 'Select the chart title'
    },
    {
      name: 'title_3',
      type: 'string',
      label: 'Title of the second metric',
      description: 'Select the chart title'
    },
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset'
    },
    {
      name: 'metric_1',
      type: 'measure',
      label: 'Metric 1 KPI',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'metric_2',
      type: 'measure',
      label: 'Metric 2 KPI',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'metric_3',
      type: 'measure',
      label: 'Metric 3 KPI',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'colorDeco',
      type: 'string',
      label: 'Border color'
    },
    {
      name: 'colorBg',
      type: 'string',
      label: 'Background color'
    },
    {
      name: 'description',
      type: 'string',
      label: 'Metric description'
    },
    {
      name: 'prefix_1',
      type: 'string',
      label: 'Prefix 1',
      description: 'Prefix 1',
      category: 'Chart settings'
    },
    {
      name: 'suffix_1',
      type: 'string',
      label: 'Suffix 1',
      description: 'Suffix 1',
      category: 'Chart settings'
    },
    {
      name: 'prefix_2',
      type: 'string',
      label: 'Prefix 2',
      description: 'Prefix 2',
      category: 'Chart settings'
    },
    {
      name: 'suffix_2',
      type: 'string',
      label: 'Suffix 2',
      description: 'Suffix 2',
      category: 'Chart settings'
    },
    {
      name: 'prefix_3',
      type: 'string',
      label: 'Prefix 3',
      description: 'Prefix 3',
      category: 'Chart settings'
    },
    {
      name: 'suffix_3',
      type: 'string',
      label: 'Suffix 3',
      description: 'Suffix 3',
      category: 'Chart settings'
    }
  ],
  events: []
};

export type Inputs = {
  title_1?: string;
  title_2?: string;
  title_3?: string;
  ds: Dataset;
  metric_1: Measure;
  metric_2: Measure;
  metric_3: Measure;
  colorDeco: string;
  colorBg: string;
  prefix_1: string;
  suffix_1: string;
  prefix_2: string;
  suffix_2: string;
  prefix_3: string;
  suffix_3: string;
  description: string;
};

export default defineComponent<Inputs>(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      value: loadData({
        from: inputs.ds,
        measures: [inputs.metric_1, inputs.metric_2, inputs.metric_3]
      })
    };
  }
});
