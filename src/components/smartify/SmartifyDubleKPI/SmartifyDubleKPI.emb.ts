import { Dataset, Measure, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'SmartifyDubleKPI',
  label: 'Smartify Duble KPI',
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'Select the chart title'
    },
    {
      name: 'sub_title',
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
      name: 'metric_total',
      type: 'measure',
      label: 'Metric Total KPI',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'metric_users',
      type: 'measure',
      label: 'Metric Users KPI',
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
    }
  ],
  events: []
};

export type Inputs = {
  title?: string;
  sub_title?: string;
  ds: Dataset;
  metric_total: Measure;
  metric_users: Measure;
  colorDeco: string;
  colorBg: string;
  prefix_1: string;
  suffix_1: string;
  prefix_2: string;
  suffix_2: string;
  description: string;
};

export default defineComponent<Inputs>(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      value: loadData({
        from: inputs.ds,
        measures: [inputs.metric_total, inputs.metric_users]
      })
    };
  }
});
