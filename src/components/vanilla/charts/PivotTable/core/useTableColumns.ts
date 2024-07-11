import { useMemo } from 'react';
import { Dimension, Measure } from '@embeddable.com/core';
import { Column } from './Column';
import { ColumnType } from '../enums/ColumnType';
import { createColumnKey } from '../utils/key';

type TableColumnHook = {
  columns: Column[],
  getLeafColumns: () => Column[]
};

export const useTableColumns = (
  columnDimensions: Dimension[],
  rowDimensions: Dimension[],
  measures: Measure[],
  columnDimensionValues: Record<string, string[]>,
  config: {
    aggregateRowDimensions?: boolean;
  } = {}
): TableColumnHook => {
  function getRowDimensionColumns(aggregateRowDimensions: boolean = false): Column[] {
    if (aggregateRowDimensions) {
      return [new Column({
        label: rowDimensions.map(rowDimension => rowDimension.title).join(' → '),
        key: '__group.key',
        depth: columnDimensions.length,
        type: ColumnType.ROW_HEADER
      })]
    } else {
      return rowDimensions.map(rowDimension => new Column({
        label: rowDimension.title,
        key: rowDimension.name,
        depth: columnDimensions.length,
        type: ColumnType.ROW_HEADER
      }))
    }
  }

  function createRowDimensionsColumn(columnDimensions: Dimension[], depth: number = 0): Column[] {
    if (!columnDimensions.length) {
      return getRowDimensionColumns(config.aggregateRowDimensions && rowDimensions.length > 1);
    }

    const [currentColumnDimension, ...restColumnDimensions] = columnDimensions;

    return [new Column({
      label: currentColumnDimension.title,
      key: currentColumnDimension.name,
      depth,
      type: ColumnType.DIMENSION,
      children: createRowDimensionsColumn(restColumnDimensions, depth + 1)
    })];
  }

  function createMeasureColumns(columnDimensions: Dimension[], depth = 0, dimensionValuesInARow: string[] = []): Column[] {
    if (!columnDimensions.length) {
      // Base case: append measures
      return measures.map(measure => new Column({
        label: measure.title,
        key: createColumnKey([...dimensionValuesInARow, measure.name]),
        depth,
        type: ColumnType.MEASURE
      }));
    }

    const [currentColumnDimension, ...restColumnDimensions] = columnDimensions;

    return columnDimensionValues[currentColumnDimension.name].map(dimensionValue => {
      return new Column({
        label: dimensionValue,
        key: createColumnKey([...dimensionValuesInARow, dimensionValue]),
        depth,
        type: ColumnType.DIMENSION,
        children: createMeasureColumns(restColumnDimensions, depth + 1, [...dimensionValuesInARow, dimensionValue])
      });
    });
  }

  const columns: Column[] = useMemo(() => [
    ...(rowDimensions.length ? createRowDimensionsColumn(columnDimensions) : []),
    ...createMeasureColumns(columnDimensions)
  ], [columnDimensions, rowDimensions, measures, columnDimensionValues, config.aggregateRowDimensions]);

  const leafColumns: Column[] = useMemo(() => columns.map(column => column.getLeafColumns()).flat(), [columns]);

  return {
    columns,
    getLeafColumns: () => leafColumns
  };
}