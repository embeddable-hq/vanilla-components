import { loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import SortDirectionType from '../../../../types/SortDirection.type.emb';
import Component from './index';

export const meta = {
  name: 'PivotTable',
  label: 'Chart: Pivot Table',
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
      label: 'Dataset to display',
      category: 'Configure chart'
    },
    {
      name: 'rowValues',
      type: 'dimension',
      label: 'Row Values',
      config: {
        dataset: 'ds'
      },
      category: 'Configure chart'
    },
    {
      name: 'defaultRowSortDirection',
      type: SortDirectionType as never,
      defaultValue: 'Ascending',
      label: 'Default Row Sort Direction',
      category: 'Configure chart'
    },
    {
      name: 'columnValues',
      type: 'dimension',
      label: 'Column Values',
      config: {
        dataset: 'ds'
      },
      category: 'Configure chart'
    },
    {
      name: 'defaultColumnSortDirection',
      type: SortDirectionType as never,
      defaultValue: 'Ascending',
      label: 'Default Column Sort Direction',
      category: 'Configure chart'
    },
    {
      name: 'metric',
      type: 'measure',
      label: 'Metric',
      config: {
        dataset: 'ds'
      },
      category: 'Configure chart'
    },
    {
      name: 'colMinWidth',
      type: 'number',
      label: 'Minimum column width in pixels',
      defaultValue: 150,
      category: 'Chart styling'
    },
    {
      name: 'dps',
      type: 'number',
      label: 'Decimal Places',
      category: 'Formatting'
    },
    {
      name: 'enableDownloadAsCSV',
      type: 'boolean',
      label: 'Show download as CSV',
      category: 'Export options',
      defaultValue: true,
    },
  ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {

    const dimensions = [inputs.rowValues];
    const defaultSort = [
      {
        property: inputs.rowValues,
        direction: inputs.defaultRowSortDirection?.value === 'Ascending' ? 'asc' : 'desc'
      }
    ];
    if(inputs?.columnValues) { 
      dimensions.push(inputs.columnValues)
      defaultSort.push({
        property: inputs.columnValues,
        direction: inputs.defaultColumnSortDirection?.value === 'Ascending' ? 'asc' : 'desc'
      })
    }      

    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        dimensions: [...dimensions],
        measures: [inputs.metric],
        orderBy: defaultSort
      })
    };
  }
});
