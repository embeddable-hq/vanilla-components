import React, { useMemo, useState } from 'react';
import { Dimension, Measure } from '@embeddable.com/core';
import cn from '../../../util/cn';
import TableHead, { Column } from './components/TableHead';
import TableRow from './components/TableRow';
import { WarningIcon } from '../../icons';
import { TableHeaderType } from './enums/TableHeaderType';
import { SortDirection } from '../../../../enums/SortDirection';
import { MeasureVisualizationFormat } from './enums/MeasureVisualizationFormat';
import TableCell from './components/TableCell';
import { COLORS, REGULAR_FONT_SIZE } from '../../../constants';
import formatValue from '../../../util/format';
import { useSortablePivotTable } from './useSortablePivotTable';

type Props<T> = {
  rawData: T[];
  rowDimensions?: Dimension[];
  columnDimensions?: Dimension[];
  measures: Measure[];
  defaultRowDimensionSortDirection?: SortDirection;
  defaultColumnDimensionSortDirection?: SortDirection;
  minColumnWidth?: number;
  minRowDimensionColumnWidth?: number;
  nullValueCharacter?: string;
  measureVisualizationFormat: MeasureVisualizationFormat;
  columnSortingEnabled?: boolean;
  fontSize?: string;
}

const PivotTable = <T,>({
  rawData,
  columnDimensions,
  rowDimensions,
  defaultRowDimensionSortDirection,
  measures,
  defaultColumnDimensionSortDirection,
  minColumnWidth,
  minRowDimensionColumnWidth,
  nullValueCharacter,
  measureVisualizationFormat,
  columnSortingEnabled = true,
  fontSize = REGULAR_FONT_SIZE
}: Props<T>) => {
  const [
    sortedRowDimensionValues,
    sortedColumnDimensionValues,
    tableData,
    handleSortingChange
  ] = useSortablePivotTable<T>(
    rawData,
    rowDimensions,
    columnDimensions,
    defaultRowDimensionSortDirection,
    defaultColumnDimensionSortDirection
  );


  const tableColumns: Column[] = useMemo(() => {
    if (columnDimensions?.length) {
      return [
        ...(rowDimensions?.length ? [{
          label: columnDimensions[0].title,
          key: columnDimensions[0].name,
          type: TableHeaderType.DIMENSION,
          sortable: false,
          children: [{
            label: rowDimensions[0].title,
            key: rowDimensions[0].name,
            type: TableHeaderType.ROW_HEADER,
            sortable: columnSortingEnabled,
            minWidth: minRowDimensionColumnWidth || minColumnWidth
          }]
        }] : []),
        ...sortedColumnDimensionValues.map((dimensionValue) => ({
          label: dimensionValue,
          key: columnDimensions[0].name,
          type: TableHeaderType.DIMENSION,
          sortable: false,
          children: measures.map((measure) => ({
            label: measure.title,
            key: measure.name,
            type: TableHeaderType.MEASURE,
            sortable: columnSortingEnabled,
            minWidth: minColumnWidth,
          }))
        }))
      ]
    } else if (rowDimensions?.length) {
      return [
        {
          label: rowDimensions[0].title,
          key: rowDimensions[0].name,
          type: TableHeaderType.ROW_HEADER,
          sortable: columnSortingEnabled,
          minWidth: minRowDimensionColumnWidth || minColumnWidth,
        },
        ...(measures?.map((measure) => ({
          label: measure.title,
          key: measure.name,
          type: TableHeaderType.MEASURE,
          sortable: columnSortingEnabled,
          minWidth: minColumnWidth,
        })) || [])
      ]
    } else {
      return [];
    }
  }, [rawData, columnDimensions, rowDimensions, measures]);


  const [rowSortDescriptor, setRowSortDescriptor] = useState<{
    column: Column | undefined;
    direction: SortDirection;
  }>(() => {
    if (rowDimensions?.length && defaultRowDimensionSortDirection) {
      if (columnDimensions?.length) {
        return {
          column: {
            ...tableColumns[0].children?.[0],
            parent: tableColumns[0]
          },
          direction: defaultRowDimensionSortDirection
        }
      } else {
        return {
          column: tableColumns[0],
          direction: defaultRowDimensionSortDirection
        }
      }
    }

    return {};
  });


  const maxValueAmongMeasures = useMemo(() => {
    if (measureVisualizationFormat !== MeasureVisualizationFormat.NUMERIC_VALUES_ONLY) {
      return Math.max(...rawData.map((record: T) => (
        Math.max(...measures.map((measure) => parseFloat(record[measure.name])) || 0)
      )) || 0);
    }

    return 0;
  }, [rawData, measures, measureVisualizationFormat]);


  if (!tableColumns?.length) {
    return (
      <div className="text-sm h-full flex items-center justify-center font-embeddable">
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">Please define at least one data dimension</div>
      </div>
    )
  }

  return (
    <table className="min-w-full border-separate border-spacing-0 table-fixed">
      <thead className="text-[#333942] sticky top-0 z-20 bg-white">
        <TableHead
          columns={tableColumns}
          sortBy={rowSortDescriptor?.column}
          sortDirection={rowSortDescriptor?.direction}
          onSortingChange={(column: Column, sortDirection: SortDirection) => {
            setRowSortDescriptor({
              column,
              direction: sortDirection
            });

            handleSortingChange(column, sortDirection, parseInt(nullValueCharacter || '') === 0);
          }}
          fontSize={fontSize}
        />
      </thead>

      <tbody className="overflow-y-auto">
      {
        sortedRowDimensionValues.map((rowDimension, rowIndex: number) => (
          <TableRow
            key={`${rowIndex}-${rowDimension?.replaceAll(' ', '-').toLowerCase()}`}
            columns={tableColumns}
            rowData={tableData[rowDimension]}
            rowHeader={rowDimension}
            renderCell={(cellValue, column, columnIndex) => {
              const isRowHeader = column.type === TableHeaderType.ROW_HEADER;

              return (
                <TableCell
                  key={`${rowIndex}-${columnIndex}-${column.key}`}
                  isHeader={isRowHeader}
                  className={cn('border-b', {
                    'text-left': isRowHeader,
                    'border-r': measures.at(-1)?.name === column.key || !column.parent || isRowHeader
                  })}
                >
                  <span style={{ fontSize }}>
                    {
                      cellValue === undefined || cellValue === null
                        ? nullValueCharacter
                        : formatValue(cellValue, {type: isRowHeader ? 'string' : 'number'})
                    }
                  </span>
                  {
                    cellValue && measureVisualizationFormat === MeasureVisualizationFormat.VALUE_BARS && !isRowHeader
                      ? (
                        <div
                          className="h-1 rounded-sm"
                          style={{
                            width: `${(parseFloat(cellValue) / maxValueAmongMeasures) * 80}%`,
                            backgroundColor: `${COLORS[measures.findIndex((measure) => measure.name === column.key) % COLORS.length]}`
                          }}
                        />
                      )
                      : null
                  }
                </TableCell>
              );
            }}
          />
        ))
      }
      </tbody>
    </table>
  )
}

export default PivotTable;