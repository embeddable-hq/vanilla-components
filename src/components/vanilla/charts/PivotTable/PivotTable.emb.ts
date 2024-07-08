import { Dimension, isDimension, isMeasure, loadData, Measure, OrderDirection } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import SortDirectionType from '../../../../types/SortDirection.type.emb';
import MeasureVisualizationFormatType from './customInputTypes/MeasureVisualizationFormat.type.emb';
import Component from './index';
import { SortDirection } from '../../../../enums/SortDirection';
import { MeasureVisualizationFormat } from './enums/MeasureVisualizationFormat';

export const meta = {
  name: 'PivotTable',
  category: 'Charts',
  label: 'Pivot Table',
  classNames: ['inside-card'],
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the chart',
      category: 'Table configuration'
    },
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset to display',
      category: 'Table configuration'
    },
    {
      name: 'metrics',
      type: 'measure',
      label: 'Metrics',
      array: true,
      config: {
        dataset: 'ds'
      },
      category: 'Table configuration'
    },
    {
      name: 'rowValues',
      type: 'dimension',
      label: 'Row Values',
      config: {
        dataset: 'ds'
      },
      category: 'Table configuration'
    },
    {
      name: 'columnValues',
      type: 'dimension',
      label: 'Column Values',
      config: {
        dataset: 'ds'
      },
      category: 'Table configuration'
    },
    {
      name: 'measureVisualizationFormat',
      type: MeasureVisualizationFormatType,
      label: 'Metrics visualization format',
      defaultValue: { value: MeasureVisualizationFormat.NUMERIC_VALUES_ONLY },
      category: 'Table configuration'
    },

    // Table settings
    {
      name: 'nullValueCharacter',
      type: 'string',
      label: 'Null value character',
      description: 'Character that should be displayed if value does not exist',
      defaultValue: '∅',
      category: 'Table settings'
    },
    {
      name: 'columnSortingEnabled',
      type: 'boolean',
      label: 'Enable column sorting',
      defaultValue: true,
      category: 'Table settings'
    },
    {
      name: 'columnSortDirection',
      type: SortDirectionType as never,
      defaultValue: { value: SortDirection.ASCENDING },
      label: 'Default Column Sort Direction',
      category: 'Table settings'
    },
    {
      name: 'rowSortDirection',
      type: SortDirectionType as never,
      defaultValue: { value: SortDirection.ASCENDING },
      label: 'Default Row Sort Direction',
      category: 'Table settings'
    },

    // Table styling
    {
      name: 'minColumnWidth',
      type: 'number',
      label: 'Minimum metric column width in pixels',
      defaultValue: 150,
      category: 'Table styling'
    },
    {
      name: 'minRowDimensionColumnWidth',
      type: 'number',
      label: 'Minimum row value width in pixels',
      defaultValue: 200,
      category: 'Table styling'
    },
    {
      name: 'fontSize',
      type: 'number',
      label: 'Font size in pixels',
      category: 'Table styling'
    },
  ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>, [state]) => {
    const sort = [];

    if (inputs.rowValues && inputs.rowSortDirection) {
      sort.push({
        property: inputs.rowValues,
        direction: (inputs.rowSortDirection?.value === SortDirection.ASCENDING ? 'asc' : 'desc') as OrderDirection
      });
    }

    if (inputs.columnValues && inputs.columnSortDirection) {
      sort.push({
        property: inputs.columnValues,
        direction: (inputs.columnSortDirection?.value === SortDirection.ASCENDING ? 'asc' : 'desc') as OrderDirection
      });
    }

    return {
      ...inputs,
      rowSortDirection: inputs.rowSortDirection?.value,
      columnSortDirection: inputs.columnSortDirection?.value,
      measureVisualizationFormat: inputs.measureVisualizationFormat?.value,
      fontSize: inputs.fontSize,
      results: loadData({
        from: inputs.ds,
        dimensions: ([inputs.rowValues, inputs.columnValues]?.filter((input) => isDimension(input)) as Dimension[]) || [],
        measures: (inputs.metrics?.filter((metric) => isMeasure(metric)) as Measure[]) || [],
        orderBy: sort
      })
    };
  }
});