import { Dataset, Dimension, Measure, TimeRange, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'KPIChart',
  label: 'Chart: Single KPI',
  defaultWidth: 200,
  defaultHeight: 150,
  classNames: ['inside-card'],
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the chart',
      category: 'Configure chart'
    },
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset',
      defaultValue: false,
      category: 'Configure chart'
    },
    {
      name: 'metric',
      type: 'measure',
      label: 'KPI',
      config: {
        dataset: 'ds'
      },
      category: 'Configure chart'
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
      name: 'timeProperty',
      type: 'dimension',
      label: 'Time Property',
      description: 'Used by time filters',
      config: {
        dataset: 'ds',
        supportedTypes: ['time']
      },
      category: 'Chart settings'
    },
    {
      name: 'timeFilter',
      type: 'timeRange',
      label: 'Time Filter',
      description: 'Date range',
      category: 'Chart settings'
    },
    {
      name: 'prevTimeFilter',
      type: 'timeRange',
      label: 'Previous Time Filter',
      description: 'Date range',
      category: 'Chart settings'
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
  timeProperty?: Dimension;
  timeFilter?: TimeRange;
  prevTimeFilter?: TimeRange;
};

export default defineComponent<Inputs>(Component, meta, {
  props: (inputs) => {
    return {
      ...inputs,
      value: loadData({
        from: inputs.ds,
        measures: [inputs.metric],
        filters:
          inputs.timeFilter?.from && inputs.timeProperty
            ? [
                {
                  property: inputs.timeProperty,
                  operator: 'inDateRange',
                  value: inputs.timeFilter
                }
              ]
            : undefined
      }),
      prevValue:
        inputs.timeProperty &&
        loadData({
          from: inputs.ds,
          measures: [inputs.metric],
          filters:
            inputs.prevTimeFilter?.from && inputs.timeProperty
              ? [
                  {
                    property: inputs.timeProperty,
                    operator: 'inDateRange',
                    value: inputs.prevTimeFilter
                  }
                ]
              : undefined
        })
    };
  }
});
