import { useMemo } from 'react';
import { Dimension, Measure } from '@embeddable.com/core';
import RowModel from './RowModel';
import { useTableColumns } from './useTableColumns';
import { SortDirection } from '../../../../../enums/SortDirection';
import { Column } from './Column';
import { Row } from './Row';
import { basicSortFn } from '../../../../util/sortFn';

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
    granularity?: string,
  } = {}
): PivotTableHook => {
  const rowModel = useMemo(() => new RowModel(
    dimensionalData as Record<string, string>[][],
    measures,
    rowDimensions,
    columnDimensions,
    config.aggregateRowDimensions
  ), [dimensionalData, measures, rowDimensions, columnDimensions, config.aggregateRowDimensions]);

  const columnDimensionsValues = useMemo(() => columnDimensions.reduce((acc, columnDimension) => ({
    ...acc,
    [columnDimension.name]: rowModel.getColumnDimensionValues(columnDimension.name).sort((a, b) => basicSortFn(a, b, config.defaultColumnsSort ?? SortDirection.ASCENDING))
  }), {}), [columnDimensions, rowModel, config.defaultColumnsSort]);

  const { columns, getLeafColumns } = useTableColumns(
    columnDimensions,
    rowDimensions,
    measures,
    columnDimensionsValues,
    {
      aggregateRowDimensions: config.aggregateRowDimensions,
      granularity: config.granularity
    }
  );

  return {
    rows: rowModel.rows,
    columns,
    getLeafColumns,
  };
};