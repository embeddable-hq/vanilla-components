import { OrderBy, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component, { Props } from './index';

export const meta = {
  name: 'QuickPivotTable',
  label: 'Chart: Quick Pivot Table',
  classNames: ['inside-card'],
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      category: 'Configure chart'
    },
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset to display',
      description: 'Dataset',
      defaultValue: false,
      category: 'Configure chart'
    },
    {
      name: 'columns',
      type: 'dimension',
      label: 'Columns',
      array: true,
      config: {
        dataset: 'ds'
      },
      category: 'Configure chart'
    },
    {
      name: 'rows',
      type: 'dimension',
      label: 'Rows',
      array: true,
      config: {
        dataset: 'ds'
      },
      category: 'Configure chart'
    },
    {
      name: 'measures',
      type: 'measure',
      label: 'Measures',
      array: true,
      config: {
        dataset: 'ds'
      },
      category: 'Configure chart'
    }
  ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent<Props, typeof meta>(Component, meta, {
  props: (inputs: Inputs<typeof meta>, [state]) => {
    return {
      ...inputs,
      tableData: loadData({
        from: inputs.ds,
        dimensions: [...inputs.columns, ...inputs.rows],
        measures: [...inputs.measures]
      })
    };
  }
});
