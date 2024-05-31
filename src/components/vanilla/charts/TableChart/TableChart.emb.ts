import { Dimension, Measure, OrderBy, isDimension, isMeasure, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';



import SortDirectionType from '../../../../types/SortDirection.type.emb';
import Component, { Props } from './index';


export const meta = {
  name: 'TableChart',
  label: 'Chart: Table',
  defaultHeight: 300,
  defaultWidth: 900,
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
      type: 'dimensionOrMeasure',
      label: 'Columns',
      array: true,
      config: {
        dataset: 'ds'
      },
      category: 'Configure chart'
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
      defaultValue: true,
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
        ? Math.min(inputs.maxPageRows || 1000, state?.maxRowsFit || 1000)
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