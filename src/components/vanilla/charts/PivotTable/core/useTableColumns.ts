import { useMemo } from 'react';
import { Dimension, Measure } from '@embeddable.com/core';
import { Column } from './Column';
import { ColumnType } from '../enums/ColumnType';
import { createColumnKey } from '../utils/key';
import formatValue from '../../../../util/format';
import { DATE_DISPLAY_FORMATS } from '../../../../constants';

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
    granularity?: string,
  } = {}
): TableColumnHook => {
  function getRowDimensionColumns(aggregateRowDimensions: boolean = false, parent: Column | null = null): Column[] {
    const rowDimensionCols = rowDimensions.map(rowDimension => new Column({
      label: rowDimension.title,
      key: rowDimension.name,
      depth: columnDimensions.length,
      type: ColumnType.ROW_HEADER,
      dataType: rowDimension.nativeType,
      parent
    }));

    if (aggregateRowDimensions) {
      return [new Column({
        label: rowDimensions.map(rowDimension => rowDimension.title).join(' → '),
        key: '__group.key',
        depth: columnDimensions.length,
        type: ColumnType.ROW_HEADER_GROUP,
        group: rowDimensionCols,
        parent
      })]
    } else {
      return rowDimensionCols;
    }
  }

  function createRowDimensionsColumn(columnDimensions: Dimension[], depth: number = 0, parent: Column | null = null): Column[] {
    if (!columnDimensions.length) {
      return getRowDimensionColumns(config.aggregateRowDimensions && rowDimensions.length > 1, parent);
    }

    const [currentColumnDimension, ...restColumnDimensions] = columnDimensions;

    const rowDimensionColumn = new Column({
      label: currentColumnDimension.title,
      key: currentColumnDimension.name,
      depth,
      type: ColumnType.DIMENSION,
      dataType: currentColumnDimension.nativeType,
      parent
    });

    const children = createRowDimensionsColumn(restColumnDimensions, depth + 1, rowDimensionColumn);
    rowDimensionColumn.addChildren(children);

    return [rowDimensionColumn];
  }

  function createMeasureColumns(columnDimensions: Dimension[], depth = 0, parent: Column | null = null, dimensionValuesInARow: string[] = []): Column[] {
    if (!columnDimensions.length) {
      return measures.map(measure => new Column({
        label: measure.title,
        key: createColumnKey([...dimensionValuesInARow, measure.name]),
        depth,
        type: ColumnType.MEASURE,
        dataType: measure.nativeType,
        parent: parent || null
      }));
    }

    const [currentColumnDimension, ...restColumnDimensions] = columnDimensions;

    return columnDimensionValues[currentColumnDimension.name].map(dimensionValue => {
      const column = new Column({
        label: formatValue(dimensionValue, {
          // type: currentColumnDimension.nativeType === 'time' ? 'date' : currentColumnDimension.nativeType as any,
          ...(config.granularity && currentColumnDimension.nativeType === 'time' && dimensionValue ? {
            dateFormat: DATE_DISPLAY_FORMATS[config.granularity as keyof typeof DATE_DISPLAY_FORMATS]
          } : {})
        }) ?? '-',
        key: createColumnKey([...dimensionValuesInARow, dimensionValue]),
        depth,
        type: ColumnType.DIMENSION,
        dataType: currentColumnDimension.nativeType,
        parent: parent
      });

      const children = createMeasureColumns(restColumnDimensions, depth + 1, column, [...dimensionValuesInARow, dimensionValue]);
      column.addChildren(children);

      return column;
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