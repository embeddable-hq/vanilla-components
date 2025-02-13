import React, { useState, useMemo } from 'react';
import { Dimension, Measure } from '@embeddable.com/core';
import TableHead from './components/TableHead';
import TableRow from './components/TableRow';
import { SortDirection } from '../../../../enums/SortDirection';
import formatValue from '../../../util/format';
import { usePivotTable } from './core/usePivotTable';
import { multisortFn, SortCriteria } from '../../../util/sortFn';
import { Row } from './core/Row';
import { Theme } from '../../../../themes/theme';
import { useTheme } from '@embeddable.com/react';

type Props<T> = {
  aggregateRowDimensions?: boolean;
  columnDimensions?: Dimension[];
  columnSortingEnabled?: boolean;
  data: T[][];
  defaultColumnDimensionSortDirection?: SortDirection;
  defaultRowDimensionSortDirection?: SortDirection;
  fontSize?: string;
  granularity?: string;
  isRowGroupDefaultExpanded?: boolean;
  measures: Measure[];
  minColumnWidth?: number;
  minRowDimensionColumnWidth?: number;
  nullValueCharacter?: string;
  rowDimensions?: Dimension[];
};

const PivotTable = <T,>({
  aggregateRowDimensions = true,
  columnDimensions,
  columnSortingEnabled = true,
  data,
  defaultColumnDimensionSortDirection,
  defaultRowDimensionSortDirection,
  fontSize = '14px',
  granularity,
  isRowGroupDefaultExpanded = true,
  measures,
  minColumnWidth,
  minRowDimensionColumnWidth,
  nullValueCharacter = '',
  rowDimensions,
}: Props<T>) => {
  const theme: Theme = useTheme() as Theme;
  fontSize = `${theme.font.size}px`;

  const [sortCriteria, setSortCriteria] = useState<SortCriteria<any>[]>(() => {
    if (!rowDimensions || !defaultRowDimensionSortDirection) {
      return [];
    }

    return [
      {
        key: rowDimensions.length === 1 ? rowDimensions[0].name : '__group.key',
        direction: defaultRowDimensionSortDirection,
      },
    ];
  });

  const { rows, columns, getLeafColumns } = usePivotTable<T>(
    data,
    measures,
    rowDimensions,
    columnDimensions,
    {
      aggregateRowDimensions,
      defaultColumnsSort: defaultColumnDimensionSortDirection,
      granularity,
    },
  );

  const sortRows = (rows: Row[], sortCriteria: SortCriteria<any>[]): Row[] => {
    const sortedRows = [...rows];
    sortedRows.sort(multisortFn(sortCriteria));

    sortedRows.forEach((row) => {
      if (row.children?.length) {
        row.children = sortRows(row.children, sortCriteria);
      }
    });

    return sortedRows;
  };

  const sortCriteriaWithDataAccessor = useMemo<SortCriteria<any>[]>(() => {
    const nullValueCharacterAsNumber = parseInt(nullValueCharacter, 10);

    return sortCriteria.map((sortCriterion) => ({
      ...sortCriterion,
      key: (row: Row) =>
        row.data[sortCriterion.key as string] ||
        (isNaN(nullValueCharacterAsNumber) ? null : nullValueCharacterAsNumber),
    }));
  }, [sortCriteria]);

  const sortedRows = useMemo<Row[]>(() => {
    return sortRows(rows, sortCriteriaWithDataAccessor);
  }, [rows, sortCriteriaWithDataAccessor]);

  const getMeasureByLabel = useMemo(
    () => (label: string) => {
      return measures.find((measure) => measure.title === label);
    },
    [measures],
  );

  return (
    <table className="min-w-full border-separate border-spacing-0 table-fixed">
      <thead className="embeddable-table-header sticky top-0 z-20 bg-white">
        <TableHead
          columns={columns}
          minColumnWidth={`${minColumnWidth}px`}
          minHeaderColumnWidth={`${minRowDimensionColumnWidth}px`}
          enableSorting={columnSortingEnabled}
          sortCriteria={sortCriteria}
          onSortingChange={(columnKey, sortDirection) => {
            setSortCriteria([
              {
                key: columnKey,
                direction: sortDirection,
              },
            ]);
          }}
          fontSize={fontSize}
        />
      </thead>

      <tbody className="overflow-y-auto">
        {sortedRows.map((row) => (
          <TableRow
            key={row.id}
            columns={getLeafColumns()}
            row={row}
            isRowGroupDefaultExpanded={isRowGroupDefaultExpanded}
            renderCell={(rowRecord, column) => {
              const cellValue = rowRecord[column.key];

              return (
                <span style={{ fontSize }}>
                  {cellValue === undefined || cellValue === null
                    ? nullValueCharacter
                    : formatValue(cellValue, {
                        //format date columns
                        ...(granularity && column.dataType === 'time'
                          ? {
                              dateFormat:
                                theme.dateFormats[granularity as keyof typeof theme.dateFormats],
                            }
                          : {}),
                        //format measures
                        ...(getMeasureByLabel(column.label)
                          ? { meta: getMeasureByLabel(column.label)?.meta, type: 'number' }
                          : {}),
                      })}
                </span>
              );
            }}
          />
        ))}
      </tbody>
    </table>
  );
};

export default PivotTable;
