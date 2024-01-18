import { Dataset, Dimension, Measure, TimeRange, Value, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
  name: 'Filters',
  label: 'Direct Filters',
  classNames: ['on-top'],
  inputs: [
    {
      name: 'dateValue',
      type: 'timeRange',
      label: 'Initial Date Range'
    },
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset',
      defaultValue: false
    },
    {
      name: 'channelProperty',
      type: 'dimension',
      label: 'Channel',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'sitesProperty',
      type: 'dimension',
      label: 'Sites',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'sortProperty',
      type: 'measure',
      label: 'Sorting Property',
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'sitesDefaultValue',
      type: 'string',
      label: 'Default Site'
    }
  ],
  events: [
    {
      name: 'onChangeDate',
      label: 'Change Date',
      properties: [
        {
          name: 'value',
          type: 'timeRange',
          label: 'value'
        }
      ]
    },
    {
      name: 'onChangeSite',
      label: 'Change Site',
      properties: [
        {
          name: 'value',
          type: 'string'
        }
      ]
    },
    {
      name: 'onChangePages',
      label: 'Change Pages',
      properties: [
        {
          name: 'value',
          type: 'string',
          array: true
        }
      ]
    }
  ],
  variables: [
    {
      name: 'date range value',
      type: 'timeRange',
      defaultValue: Value.noFilter(),
      events: [{ name: 'onChangeDate', property: 'value' }]
    },
    {
      name: 'selected pages',
      type: 'string',
      array: true,
      defaultValue: Value.noFilter(),
      events: [{ name: 'onChangePages', property: 'value' }]
    },
    {
      name: 'selected site',
      type: 'string',
      defaultValue: Value.noFilter(),
      events: [{ name: 'onChangeSite', property: 'value' }]
    }
  ]
};

export type Inputs = {
  value?: TimeRange;
  title?: string;
  ds: Dataset;
  dateValue?: TimeRange;
  sortProperty?: Measure;
  pagesProperty: Dimension;
  sitesProperty: Dimension;
  sitesDefaultValue?: string;
};

export default defineComponent<Inputs>(Component, meta, {
  props: (inputs, [embState]) => {
    return {
      ...inputs,
      pagesOptions: loadData({
        from: inputs.ds,
        dimensions: [inputs.pagesProperty],
        measures: inputs.sortProperty ? [inputs.sortProperty] : [],
        limit: 10,
        orderBy: inputs.sortProperty
          ? [
              {
                direction: 'desc',
                property: inputs.sortProperty
              }
            ]
          : undefined,
        filters:
          embState?.searchPages && inputs.sitesProperty
            ? [
                {
                  operator: 'contains',
                  property: inputs.pagesProperty,
                  value: embState?.searchPages
                }
              ]
            : undefined
      }),
      sitesOptions: loadData({
        from: inputs.ds,
        dimensions: [inputs.sitesProperty],
        measures: inputs.sortProperty ? [inputs.sortProperty] : [],
        limit: 10,
        orderBy: inputs.sortProperty
          ? [
              {
                direction: 'desc',
                property: inputs.sortProperty
              }
            ]
          : undefined,
        filters:
          embState?.searchSites && inputs.sitesProperty
            ? [
                {
                  operator: 'contains',
                  property: inputs.sitesProperty,
                  value: embState?.searchSites
                }
              ]
            : undefined
      })
    };
  },
  events: {
    onChangeDate: (value) => {
      console.log('UPDATING DATE RANGE', value);

      return { value };
    },
    onChangeSite: (value) => {
      console.log('UPDATING SITE', value);

      return {
        value: value || Value.noFilter()
      };
    },
    onChangePages: (selected) => ({ value: selected.length ? selected : Value.noFilter() })
  }
});
