import { Dimension, Measure, OrderBy, isDimension, isMeasure, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';



import SortDirectionType from '../../../../types/SortDirection.type.emb';
import Component, { Props } from './index';


export const meta = {
  name: 'TableChart',
  label: 'Table',
  defaultHeight: 300,
  defaultWidth: 900,
  classNames: ['inside-card'],
  category: 'Charts: essentials',
  inputs: [
    {
        name: 'ds',
        type: 'dataset',
        label: 'Dataset to display',
        description: 'Dataset',
        defaultValue: false,
        category: 'Chart data'
    },
    {
        name: 'columns',
        type: 'dimensionOrMeasure',
        label: 'Columns',
        array: true,
        config: {
            dataset: 'ds'
        },
        category: 'Chart data'
    },
    // Chart settings
    {
        name: 'title',
        type: 'string',
        label: 'Title',
        category: 'Chart settings'
    },
    {
        name: 'description',
        type: 'string',
        label: 'Description',
        description: 'The description for the chart',
        category: 'Chart settings'
    },
    {
        name: 'maxPageRows',
        type: 'number',
        label: 'Max Page Rows',
        category: 'Chart settings'
    },
    {
        name: 'defaultSort',
        type: 'dimensionOrMeasure',
        config: {
            dataset: 'ds'
        },
        label: 'Default Sort',
        category: 'Chart settings'
    },
    {
        name: 'defaultSortDirection',
        type: SortDirectionType as never,
        defaultValue: 'Ascending',
        label: 'Default Sort Direction',
        category: 'Chart settings'
    },
    {
        name: 'enableDownloadAsCSV',
        type: 'boolean',
        label: 'Show download as CSV',
        category: 'Export options',
        defaultValue: true
    },
    // Table styling
    {
      name: 'minColumnWidth',
      type: 'number',
      label: 'Minimum column width in pixels',
      defaultValue: 150,
      category: 'Chart styling'
    },
    {
      name: 'fontSize',
      type: 'number',
      label: 'Font size in pixels',
      category: 'Chart styling'
    }
]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent<
  Props,
  typeof meta,
  { maxRowsFit: number; sort: OrderBy[]; page: number }
>(Component, meta, {
  props: (inputs: Inputs<typeof meta>, [state]) => {
    const limit =
      inputs.maxPageRows || state?.maxRowsFit
        ? Math.min(inputs.maxPageRows || 1000, Math.max(state?.maxRowsFit, 1) || 1000)
        : 1;

    const defaultSortDirection = inputs.defaultSortDirection?.value === 'Ascending' ? 'asc' : 'desc';

    const defaultSort =
      inputs.columns
        ?.filter((c) => c.name !== inputs.defaultSort?.name)
        .map((property) => ({
            property,
            direction: defaultSortDirection
          })) || [];

    if (inputs.defaultSort) {
      defaultSort.unshift({
        property: inputs.defaultSort,
        direction: defaultSortDirection
      });
    }

    return {
      ...inputs,
      limit,
      defaultSort,
      results: loadData({
        from: inputs.ds,
        dimensions: (inputs.columns?.filter((c) => isDimension(c)) as Dimension[]) || [],
        measures: (inputs.columns?.filter((c) => isMeasure(c)) as Measure[]) || [],
        limit,
        offset: limit * (state?.page || 0),
        orderBy: state?.sort || defaultSort
      })
    };
  }
});