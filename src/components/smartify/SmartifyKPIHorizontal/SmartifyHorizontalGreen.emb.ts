import { loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'SmartifyHorizontalGreen',
  label: 'Smartify KPI Horizontal Green',
  defaultWidth: 150,
  defaultHeight: 120,
  category: 'Smartify: Score Cards',
  classNames: ['inside-card-green'],
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
        name: 'metric_total',
        type: 'measure',
        label: 'measureOne',
        config: {
          dataset: 'ds'
        },
        category: 'Chart data',
      },
      {
        name: 'metric_users',
        type: 'measure',
        label: 'measureTwo',
        config: {
          dataset: 'ds'
        },
        category: 'Chart data',
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
        category: 'Chart data'
      },
      {
        name: 'timeFilter',
        type: 'timeRange',
        label: 'Primary date range',
        description: 'Date range',
        category: 'Variables to configure',
      },
      {
        name: 'prevTimeFilter',
        type: 'timeRange',
        label: 'Comparison date range',
        description: 'Date range',
        category: 'Variables to configure',
      },
      {
        name: 'title',
        type: 'string',
        label: 'Chart Title',
        description: 'The title for the chart',
        category: 'Chart settings',
      },
      {
        name: 'totalTitle',
        type: 'string',
        label: 'Title Measure One',
        description: 'The total tile for the measure',
        category: 'Chart settings',
      },
      {
        name: 'usersTitle',
        type: 'string',
        label: 'Title Measure Two',
        description: 'The users title for the measure',
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
        name: 'showPrevPeriodLabel',
        type: 'boolean',
        label: 'Display comparison period label',
        defaultValue: false,
        category: 'Chart settings',
      },
      {
        name: 'prefix_one',
        type: 'string',
        label: 'Prefix One',
        description: 'Prefix of the first measure',
        category: 'Chart settings',
      },
      {
        name: 'suffix_one',
        type: 'string',
        label: 'Suffix One',
        description: 'Suffix of the first measure',
        category: 'Chart settings',
      },
      {
        name: 'prefix_two',
        type: 'string',
        label: 'Prefix Two',
        description: 'Prefix of the second measure',
        category: 'Chart settings',
      },
      {
        name: 'suffix_two',
        type: 'string',
        label: 'Suffix Two',
        description: 'Suffix of the second measure',
        category: 'Chart settings',
      },
      {
        name: 'dps',
        type: 'number',
        label: 'Decimal Places',
        category: 'Formatting',
      },
      {
        name: 'fontSize',
        type: 'number',
        label: 'Text size in pixels',
        defaultValue: 24,
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
        defaultValue: false,
      },
    ],
  } as const satisfies EmbeddedComponentMeta;
  
  export default defineComponent(Component, meta, {
    props: (inputs: Inputs<typeof meta>) => {
      const results = loadData({
        from: inputs.ds,
        measures: [inputs.metric_total, inputs.metric_users],
        filters:
          inputs.timeFilter?.from && inputs.timeProperty
            ? [
                {
                  property: inputs.timeProperty,
                  operator: 'inDateRange',
                  value: inputs.timeFilter,
                },
              ]
            : undefined,
      });
  
      const prevResults =
        inputs.timeProperty &&
        loadData({
          from: inputs.ds,
          measures: [inputs.metric_total, inputs.metric_users],
          limit: !inputs.prevTimeFilter?.from ? 1 : undefined,
          filters: inputs.prevTimeFilter?.from
            ? [
                {
                  property: inputs.timeProperty,
                  operator: 'inDateRange',
                  value: {
                    from: inputs.prevTimeFilter.from,
                    relativeTimeString: '',
                    to: inputs.prevTimeFilter.to,
                  },
                },
              ]
            : undefined,
        });
  
      return {
        ...inputs,
        results,
        prevResults,
        metricTotal: inputs.metric_total,
        metricUsers: inputs.metric_users,
      };
    },
  });