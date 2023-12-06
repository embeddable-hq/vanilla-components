import { defineComponent } from '@embeddable.com/react';
import { loadData, isMeasure, isDimension } from '@embeddable.com/core';

import Table from './Table';

export const meta = {
  name: 'Table',
  label: 'Table',
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

export default defineComponent(Table, meta, {
  props: (props, [state]) => {
    const limit =
      props.maxPageRows || state?.maxRowsFit
        ? Math.min(props.maxPageRows || 1000, state?.maxRowsFit || 1000)
        : 1;

    const defaultSort =
      props.columns?.map((property) => ({
        property,
        direction: 'asc'
      })) || [];

    return {
      ...props,
      limit,
      defaultSort,
      tableData: loadData({
        from: props.ds,
        dimensions: props.columns?.filter((c) => isDimension(c)) || [],
        measures: props.columns?.filter((c) => isMeasure(c)) || [],
        limit,
        offset: limit * (state?.page || 0),
        orderBy: state?.sort || defaultSort
      })
    };
  }
});
