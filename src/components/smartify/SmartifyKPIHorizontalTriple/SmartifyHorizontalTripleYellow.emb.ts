import { loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'SmartifyHorizontalTripleYellow',
  label: 'Smartify KPI Horizontal Triple Yellow',
  defaultWidth: 150,
  defaultHeight: 120,
  category: 'Smartify: Score Cards',
  classNames: ['inside-card-yellow'],
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
      name: 'metric_one',
      type: 'measure',
      label: 'measureOne',
      config: {
        dataset: 'ds'
      },
      category: 'Chart data',
    },
    {
      name: 'metric_two',
      type: 'measure',
      label: 'measureTwo',
      config: {
        dataset: 'ds'
      },
      category: 'Chart data',
    },
    {
      name: 'metric_three',
      type: 'measure',
      label: 'measureThree',
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
      name: 'oneTitle',
      type: 'string',
      label: 'Title Measure One',
      description: 'The total tile for the measure',
      category: 'Chart settings',
    },
    {
      name: 'twoTitle',
      type: 'string',
      label: 'Title Measure Two',
      description: 'The users title for the measure',
      category: 'Chart settings',
    },
    {
      name: 'threeTitle',
      type: 'string',
      label: 'Title Measure Three',
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
      name: 'prefix_three',
      type: 'string',
      label: 'Prefix Three',
      description: 'Prefix of the third measure',
      category: 'Chart settings',
    },
    {
      name: 'suffix_three',
      type: 'string',
      label: 'Suffix Three',
      description: 'Suffix of the third measure',
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
      measures: [inputs.metric_one, inputs.metric_two, inputs.metric_three],
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
        measures: [inputs.metric_one, inputs.metric_two, inputs.metric_three],
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
      metricOne: inputs.metric_one,
      metricTwo: inputs.metric_two,
      metricThree: inputs.metric_three,
    };
  },
});