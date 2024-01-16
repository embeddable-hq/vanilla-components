import { Dataset, Measure, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'KPIChart',
  label: 'KPI',
  classNames: ['inside-card'],
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the chart'
    },
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset',
      defaultValue: false
    },
    {
      name: 'metric',
      type: 'measure',
      label: 'KPI',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'prefix',
      type: 'string',
      label: 'Prefix',
      description: 'Prefix'
    },
    {
      name: 'suffix',
      type: 'string',
      label: 'Suffix',
      description: 'Suffix'
    }
  ],
  events: []
};

export type Inputs = {
  title?: string;
  ds: Dataset;
  metric: Measure;
  prefix?: string;
  suffix?: string;
};

export default defineComponent<Inputs>(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      value: loadData({
        from: inputs.ds,
        measures: [inputs.metric]
      })
    };
  }
});
