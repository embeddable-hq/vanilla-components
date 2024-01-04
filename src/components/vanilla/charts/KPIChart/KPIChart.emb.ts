import { loadData } from '@embeddable.com/core';
import { defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'KPIChart',
  label: 'Chart: Single KPI',
  defaultWidth: 200, // pixel width
  defaultHeight: 150, // pixel height
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

export default defineComponent(Component, meta, {
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
