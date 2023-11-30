import { defineComponent } from '@embeddable.com/react';
import { loadData, isMeasure, isDimension } from '@embeddable.com/core';

import Table from './Table';

export const meta = {
  name: 'Table',
  label: 'Table',
  inputs: [
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
    }
  ],
  events: []
};

export default defineComponent(Table, meta, {
  props: (props) => {
    return {
      ...props,
      tableData: loadData({
        from: props.ds,
        dimensions: props.columns?.filter((c) => isDimension(c)) || [],
        measures: props.columns?.filter((c) => isMeasure(c)) || []
      })
    };
  }
});
