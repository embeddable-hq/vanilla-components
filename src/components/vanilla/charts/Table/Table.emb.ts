import { defineComponent } from '@embeddable.com/react';
import { loadData, isMeasure, isDimension } from '@embeddable.com/core';

import Component from './index';

export const meta = {
  name: 'Table',
  label: 'Table',
  classNames: ['inside-card'],
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title'
    },
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset to display',
      description: 'Dataset',
      defaultValue: false
    },
    {
      name: 'columns',
      type: 'dimensionOrMeasure',
      label: 'Columns',
      array: true,
      config: {
        dataset: 'ds'
      }
    },
    {
      name: 'maxPageRows',
      type: 'number',
      label: 'Max Page Rows'
    }
  ],
  events: []
};

export default defineComponent(Component, meta, {
  props: (inputs, [state]) => {
    const limit =
      inputs.maxPageRows || state?.maxRowsFit
        ? Math.min(inputs.maxPageRows || 1000, state?.maxRowsFit || 1000)
        : 1;

    const defaultSort =
      inputs.columns?.map((property) => ({
        property,
        direction: 'asc'
      })) || [];

    return {
      ...inputs,
      limit,
      defaultSort,
      tableData: loadData({
        from: inputs.ds,
        dimensions: inputs.columns?.filter((c) => isDimension(c)) || [],
        measures: inputs.columns?.filter((c) => isMeasure(c)) || [],
        limit,
        offset: limit * (state?.page || 0),
        orderBy: state?.sort || defaultSort
      })
    };
  }
});
