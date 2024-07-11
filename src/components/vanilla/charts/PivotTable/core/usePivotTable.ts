import { useMemo } from 'react';
import { Dimension, Measure } from '@embeddable.com/core';
import RowModel, { Row } from './RowModel';
import { useTableColumns } from './useTableColumns';
import { SortDirection } from '../../../../../enums/SortDirection';
import { Column } from './Column';

type PivotTableHook = {
  rows: Row[],
  columns: Column[],
  getLeafColumns: () => Column[]
};

export const usePivotTable = <T>(
  dimensionalData: T[][],
  measures: Measure[],
  rowDimensions: Dimension[] = [],
  columnDimensions: Dimension[] = [],
  config: {
    aggregateRowDimensions?: boolean;
    defaultColumnsSort?: SortDirection;
  } = {}
): PivotTableHook => {
  const rowModel = useMemo(() => new RowModel(
    dimensionalData as Record<string, string>[][],
    measures,
    rowDimensions,
    columnDimensions,
  ), [dimensionalData, measures, rowDimensions, columnDimensions]);

  const columnDimensionsValues = columnDimensions.reduce((acc, columnDimension) => ({
    ...acc,
    [columnDimension.name]: rowModel.getColumnDimensionValues(columnDimension.name)
  }), {});

  // TODO: sort columnDimensionsValues according to defaultColumnsSort config value
  const { columns, getLeafColumns } = useTableColumns(
    columnDimensions,
    rowDimensions,
    measures,
    columnDimensionsValues,
    {
      aggregateRowDimensions: config.aggregateRowDimensions
    }
  );

  return {
    rows: rowModel.rows,
    columns,
    getLeafColumns,
  };
};