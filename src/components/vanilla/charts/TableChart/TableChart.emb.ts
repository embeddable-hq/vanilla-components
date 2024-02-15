import {
  Dataset,
  Dimension,
  DimensionOrMeasure,
  Measure,
  isDimension,
  isMeasure,
  loadData
} from '@embeddable.com/core';
import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import SortDirectionType from '../../../../types/SortDirection.type.emb.js';
import Component from './index';

export const meta: EmbeddedComponentMeta = {
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
      type: SortDirectionType,
      defaultValue: 'Ascending',
      label: 'Default Sort Direction',
      category: 'Chart settings'
    }
  ],
  events: []
};

export type Inputs = {
  title?: string;
  ds: Dataset;
  columns: DimensionOrMeasure[];
  maxPageRows?: number;
  defaultSort?: DimensionOrMeasure;
  defaultSortDirection?: 'Ascending' | 'Descending';
};

export default defineComponent<Inputs>(Component, meta, {
  props: (inputs, [state]) => {
    const limit =
      inputs.maxPageRows || state?.maxRowsFit
        ? Math.min(inputs.maxPageRows || 1000, state?.maxRowsFit || 1000)
        : 1;

    const defaultSort =
      inputs.columns
        ?.filter((c) => c !== inputs.defaultSort)
        .map((property) => ({
          property,
          direction: 'asc'
        })) || [];

    if (inputs.defaultSort) {
      defaultSort.unshift({
        property: inputs.defaultSort,
        direction: inputs.defaultSortDirection === 'Ascending' ? 'asc' : 'desc'
      });
    }

    return {
      ...inputs,
      limit,
      defaultSort,
      tableData: loadData({
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
