import { useMemo, useState } from 'react';
import { Column } from './components/TableHead';
import { SortDirection } from '../../../../enums/SortDirection';
import { basicSort } from '../../../util/sortFn';
import { Dimension } from '@embeddable.com/core';
import { keyBy } from '../../../util/keyBy';
import { TableHeaderType } from './enums/TableHeaderType';

function getDimensionValues<T>(dataset: T[], dimension: Dimension): string[] {
  return [...new Set(dataset.map((record: T) => record[dimension?.name]))];
}

type SortablePivotTableHook<T> = [
  (string | undefined)[],
  string[],
  Record<string, Record<string, T>>,
  (sortColumn: Column, sortDirection: SortDirection, shouldSortEmptyValues?: boolean) => void
];

export const useSortablePivotTable = <T>(
  rawData: T[],
  rowDimensions: Dimension[] = [],
  columnDimensions: Dimension[] = [],
  defaultRowDimensionSortDirection: SortDirection | undefined,
  defaultColumnDimensionSortDirection: SortDirection | undefined
): SortablePivotTableHook<T> => {
  const sortedColumnDimensionValues: string[] = useMemo(() => {
    if (columnDimensions?.length) {
      const columnDimensionValues = getDimensionValues<T>(rawData, columnDimensions[0]);
      return defaultColumnDimensionSortDirection
        ? columnDimensionValues.sort((a, b) => basicSort(a, b, defaultColumnDimensionSortDirection))
        : columnDimensionValues;
    } else {
      return [];
    }
  }, [rawData, columnDimensions]);

  const rowDimensionValues = useMemo<(string | undefined)[]>(() => {
    if (rowDimensions?.length) {
      return getDimensionValues<T>(rawData, rowDimensions[0]);
    } else {
      return [undefined];
    }
  }, [rawData, rowDimensions]);

  const [sortedRowDimensionValues, setSortedRowDimensionValues] = useState<(string | undefined)[]>(() => {
    if (defaultRowDimensionSortDirection) {
      return rowDimensionValues.sort((a, b) => basicSort(a, b, defaultRowDimensionSortDirection));
    }
    return rowDimensionValues;
  });

  const tableData = useMemo(() => {
    const groupedData = keyBy(rawData, [
      ...rowDimensions.map(dimension => dimension.name as keyof T),
      ...columnDimensions.map(dimension => dimension.name as keyof T)
    ]);

    if (!rowDimensions?.length) {
      return { undefined: groupedData };
    }

    return groupedData;
  }, [rawData, rowDimensions, columnDimensions]);

  const handleSortingChange = (sortColumn: Column, sortDirection: SortDirection, shouldSortEmptyValues?: boolean) => {
    if (sortColumn.type === TableHeaderType.ROW_HEADER) {
      setSortedRowDimensionValues(sortedRowDimensionValues.sort((a, b) => basicSort(a, b, sortDirection)));
      return;
    }

    const sortedFilteredRowDimensionValues = getDimensionValues(rawData
        .filter((record: T) => sortColumn.parent ? record[sortColumn.parent.key] === sortColumn.parent.label : true)
        .sort((a, b) => basicSort(a[sortColumn.key], b[sortColumn.key], sortDirection)),
      rowDimensions[0]);

    const restRowDimensionValues = sortedRowDimensionValues.filter((rowDimension) => !sortedFilteredRowDimensionValues.includes(rowDimension));

    if (!shouldSortEmptyValues || sortDirection === SortDirection.DESCENDING) {
      setSortedRowDimensionValues([...sortedFilteredRowDimensionValues, ...restRowDimensionValues]);
    } else {
      setSortedRowDimensionValues([...restRowDimensionValues, ...sortedFilteredRowDimensionValues]);
    }
  };

  return [
    sortedRowDimensionValues,
    sortedColumnDimensionValues,
    tableData,
    handleSortingChange,
  ];
}