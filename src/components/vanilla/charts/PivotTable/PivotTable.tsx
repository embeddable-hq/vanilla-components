import React, { useState, useMemo, useEffect } from 'react';
import { Dimension, Measure } from '@embeddable.com/core';
import TableHead from './components/TableHead';
import TableRow from './components/TableRow';
import { ColumnType } from './enums/ColumnType';
import { SortDirection } from '../../../../enums/SortDirection';
import { MeasureVisualizationFormat } from './enums/MeasureVisualizationFormat';
import { DATE_DISPLAY_FORMATS, REGULAR_FONT_SIZE } from '../../../constants';
import formatValue from '../../../util/format';
import { usePivotTable } from './core/usePivotTable';
import { basicSortFn, multisortFn, SortCriteria } from '../../../util/sortFn';
import { Row } from './core/Row';

type Props<T> = {
  data: T[][];
  rowDimensions?: Dimension[];
  columnDimensions?: Dimension[];
  measures: Measure[];
  granularity?: string;
  defaultRowDimensionSortDirection?: SortDirection;
  defaultColumnDimensionSortDirection?: SortDirection;
  minColumnWidth?: number;
  minRowDimensionColumnWidth?: number;
  nullValueCharacter?: string;
  measureVisualizationFormat: MeasureVisualizationFormat;
  columnSortingEnabled?: boolean;
  fontSize?: string;
  aggregateRowDimensions?: boolean;
}

const PivotTable = <T,>({
  data,
  columnDimensions,
  rowDimensions,
  defaultRowDimensionSortDirection,
  measures,
  granularity,
  defaultColumnDimensionSortDirection,
  minColumnWidth,
  minRowDimensionColumnWidth,
  nullValueCharacter = '',
  // measureVisualizationFormat,
  fontSize = REGULAR_FONT_SIZE,
  columnSortingEnabled = true,
  aggregateRowDimensions = true
}: Props<T>) => {

  const [sortCriteria, setSortCriteria] = useState<SortCriteria<any>[]>(() => {
    if (!rowDimensions || !defaultRowDimensionSortDirection) {
      return [];
    }

    return [{
      key: rowDimensions.length === 1 ? rowDimensions[0].name : '__group.key',
      direction: defaultRowDimensionSortDirection
    }];
  });

  const {
    rows,
    columns,
    getLeafColumns
  } = usePivotTable<T>(
    data,
    measures,
    rowDimensions,
    columnDimensions,
    {
      aggregateRowDimensions,
      defaultColumnsSort: defaultColumnDimensionSortDirection,
      granularity
    }
  );

  const sortRows = (rows: Row[], sortCriteria: SortCriteria<any>[]): Row[] => {
    const sortedRows = [...rows];
    sortedRows.sort(multisortFn(sortCriteria));

    sortedRows.forEach(row => {
      if (row.children?.length) {
        row.children = sortRows(row.children, sortCriteria);
      }
    })

    return sortedRows;
  }

  const sortCriteriaWithDataAccessor = useMemo<SortCriteria<any>[]>(() => {
    const nullValueCharacterAsNumber = parseInt(nullValueCharacter, 10);

    return sortCriteria.map(sortCriterion => ({
      ...sortCriterion,
      key: (row: Row) => row.data[sortCriterion.key as string] || (isNaN(nullValueCharacterAsNumber) ? null : nullValueCharacterAsNumber)
    }));
  }, [sortCriteria]);

  const sortedRows = useMemo<Row[]>(() => {
    return sortRows(rows, sortCriteriaWithDataAccessor);
  }, [rows, sortCriteriaWithDataAccessor]);

  return (
    <table className="min-w-full border-separate border-spacing-0 table-fixed">
      <thead className="text-[#333942] sticky top-0 z-20 bg-white">
        <TableHead
          columns={columns}
          minColumnWidth={`${minColumnWidth}px`}
          minHeaderColumnWidth={`${minRowDimensionColumnWidth}px`}
          enableSorting={columnSortingEnabled}
          sortCriteria={sortCriteria}
          onSortingChange={(columnKey, sortDirection) => {
            setSortCriteria([{
              key: columnKey,
              direction: sortDirection
            }]);
          }}
          fontSize={fontSize}
        />
      </thead>

      <tbody className="overflow-y-auto">
      {
        sortedRows.map((row => (
          <TableRow
            key={row.id}
            columns={getLeafColumns()}
            row={row}
            renderCell={(rowRecord, column) => {
              const cellValue = rowRecord[column.key];

              return (
                <span style={{ fontSize }}>
                  {
                    cellValue === undefined || cellValue === null
                      ? nullValueCharacter
                      : formatValue(cellValue, {
                        // type: column.dataType === 'time' ? 'date' : column.dataType as any,
                        ...(granularity && column.dataType === 'time' ? {
                          dateFormat: DATE_DISPLAY_FORMATS[granularity as keyof typeof DATE_DISPLAY_FORMATS]
                        } : {})
                      })
                  }
                </span>
              );
            }}
          />
        )))
      }
      </tbody>
    </table>
  )
}

export default PivotTable;