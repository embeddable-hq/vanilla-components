import { Dimension, isDimension, isMeasure, loadData, Measure, OrderDirection, OrderBy } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import SortDirectionType from '../../../../types/SortDirection.type.emb';
import Component from './index';
import { SortDirection } from '../../../../enums/SortDirection';
import { MeasureVisualizationFormat } from './enums/MeasureVisualizationFormat';

export const meta = {
  name: 'PivotTable',
  label: 'Pivot table',
  classNames: ['inside-card'],
  category: 'Charts: essentials',
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset to display',
      category: 'Chart data'
    },
    {
      name: 'metrics',
      type: 'measure',
      label: 'Metrics',
      array: true,
      config: {
          dataset: 'ds'
      },
      category: 'Chart data'
    },
    {
      name: 'rowValues',
      type: 'dimension',
      label: 'Row Values',
      array: true,
      config: {
        dataset: 'ds'
      },
      category: 'Chart data'
    },
    {
      name: 'columnValues',
      type: 'dimension',
      label: 'Column Values',
      array: true,
      config: {
        dataset: 'ds'
      },
      category: 'Chart data'
    },
    // Variables to configure
    {
      name: 'granularity',
      type: 'granularity',
      label: 'Granularity (for dates)',
      defaultValue: 'week',
      category: 'Variables to configure'
    },
    // Table settings
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the chart',
      category: 'Chart settings'
    },
    {
      name: 'description',
      type: 'string',
      label: 'Description',
      description: 'The description for the chart',
      category: 'Chart settings'
    },
    // {
    //     name: 'measureVisualizationFormat',
    //     type: MeasureVisualizationFormatType,
    //     label: 'Metrics visualization format',
    //     defaultValue: { value: MeasureVisualizationFormat.NUMERIC_VALUES_ONLY },
    //     category: 'Chart settings'
    // },
    {
      name: 'nullValueCharacter',
      type: 'string',
      label: 'Null value character',
      description: 'Character that should be displayed if value does not exist',
      defaultValue: '∅',
      category: 'Chart settings'
    },
    {
      name: 'columnSortingEnabled',
      type: 'boolean',
      label: 'Enable column sorting',
      defaultValue: true,
      category: 'Chart settings'
    },
    {
      name: 'rowSortDirection',
      type: SortDirectionType,
      defaultValue: { value: SortDirection.ASCENDING },
      label: 'Default Row Sort Direction',
      category: 'Chart settings'
    },
    {
      name: 'columnSortDirection',
      type: SortDirectionType,
      defaultValue: { value: SortDirection.ASCENDING },
      label: 'Default Column Sort Direction',
      category: 'Chart settings'
    },

    // Table styling
    {
      name: 'minColumnWidth',
      type: 'number',
      label: 'Minimum metric column width in pixels',
      defaultValue: 150,
      category: 'Chart styling'
    },
    {
      name: 'minRowDimensionColumnWidth',
      type: 'number',
      label: 'Minimum row value width in pixels',
      defaultValue: 200,
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

const aggregateRowDimensions = true; // This is unfinished functionality to disable aggregation rows and show row dimension in separate column

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>, [state]) => {
    const rowDimensions = (inputs.rowValues || []).filter((input) => isDimension(input)) as Dimension[];
    const columnDimensions = (inputs.columnValues || []).filter((input) => isDimension(input)) as Dimension[];
    const measures = inputs.metrics?.filter((metric) => isMeasure(metric)) as Measure[];

    const filteredRowDimensions: Dimension[] = rowDimensions.filter((dimension) => dimension && isDimension(dimension));

    const sort: OrderBy[] = filteredRowDimensions.map((rowDimension) => ({
      property: rowDimension,
      direction: (inputs.rowSortDirection?.value === SortDirection.ASCENDING ? 'asc' : 'desc') as OrderDirection
    }));


    // Fetch data for each row dimension level
    const dataResults = rowDimensions?.length && aggregateRowDimensions
      ? rowDimensions.reduce((resultSet, dimension, index, dimensions) => {
        const dimensionsToFetch = [...filteredRowDimensions.slice(0, index + 1), ...columnDimensions];

        return {
          ...resultSet,
            [`resultsDimension${index}`]: loadData({
            from: inputs.ds,
            dimensions: dimensionsToFetch.filter(dimension => dimension.nativeType !== 'time'),
            measures: measures,
            timeDimensions: dimensionsToFetch
              .filter(dimension => dimension.nativeType === 'time')
              .map(timeDimension => ({
                dimension: timeDimension.name,
                granularity: inputs.granularity
              })),
            orderBy: sort.slice(0, index + 1),
            limit: 10_000
          })
        };
      }, {})
      : {
        resultsDimension0: loadData({
          from: inputs.ds,
          dimensions: [...filteredRowDimensions || [], ...columnDimensions]
            .filter(dimension => dimension.nativeType !== 'time'),
          timeDimensions: [...filteredRowDimensions || [], ...columnDimensions]
            .filter(dimension => dimension.nativeType === 'time')
            .map(timeDimension => ({
              dimension: timeDimension.name,
              granularity: inputs.granularity
            })),
          measures: measures,
          limit: 10_000
        })
      };

    return {
      ...inputs,
      columnValues: columnDimensions,
      rowSortDirection: inputs.rowSortDirection?.value,
      columnSortDirection: inputs.columnSortDirection?.value,
      // measureVisualizationFormat: inputs.measureVisualizationFormat?.value, // Enable this after Bars mode will be fixed
      measureVisualizationFormat: MeasureVisualizationFormat.NUMERIC_VALUES_ONLY,
      aggregateRowDimensions,
      fontSize: inputs.fontSize,
      ...(dataResults)
    };
  }
});