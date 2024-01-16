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

import Component from './index';

export const meta: EmbeddedComponentMeta = {
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

export type Inputs = {
  title?: string;
  ds: Dataset;
  columns: DimensionOrMeasure[];
  maxPageRows?: number;
};

export default defineComponent<Inputs>(Component, meta, {
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
        dimensions: (inputs.columns?.filter((c) => isDimension(c)) as Dimension[]) || [],
        measures: (inputs.columns?.filter((c) => isMeasure(c)) as Measure[]) || [],
        limit,
        offset: limit * (state?.page || 0),
        orderBy: state?.sort || defaultSort
      })
    };
  }
});
