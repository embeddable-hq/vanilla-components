import React, { useMemo, useState } from 'react';
import { Dimension, Measure } from '@embeddable.com/core';
import cn from '../../../util/cn';
import TableHead from './components/TableHead';
import TableRow from './components/TableRow';
import { WarningIcon } from '../../icons';
import { ColumnType } from './enums/ColumnType';
import { SortDirection } from '../../../../enums/SortDirection';
import { MeasureVisualizationFormat } from './enums/MeasureVisualizationFormat';
import TableCell from './components/TableCell';
import { COLORS, REGULAR_FONT_SIZE } from '../../../constants';
import formatValue from '../../../util/format';
import { usePivotTable } from './core/usePivotTable';

type Props<T> = {
  data: T[][];
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
  data,
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
      aggregateRowDimensions: true,
      defaultColumnsSort: defaultColumnDimensionSortDirection,
    }
  );

  return (
    <table className="min-w-full border-separate border-spacing-0 table-fixed">
      <thead className="text-[#333942] sticky top-0 z-20 bg-white">
        <TableHead
          columns={columns}
          // sortBy={rowSortDescriptor?.column}
          // sortDirection={rowSortDescriptor?.direction}
          // onSortingChange={(column: Column, sortDirection: SortDirection) => {
          //   setRowSortDescriptor({
          //     column,
          //     direction: sortDirection
          //   });
          //
          //   handleSortingChange(column, sortDirection, parseInt(nullValueCharacter || '') === 0);
          // }}
          fontSize={fontSize}
        />
      </thead>

      <tbody className="overflow-y-auto">
      {
        rows.map(((row, rowIndex) => (
          <TableRow
            key={rowIndex}
            columns={getLeafColumns()}
            row={row}
            renderCell={(rowRecord, column, level) => {
              const isRowHeader = column.type === ColumnType.ROW_HEADER;
              const cellValue = rowRecord[column.key];

              return (
                <TableCell
                  key={`${rowIndex}-${column.key}`}
                  isHeader={isRowHeader}
                  level={isRowHeader ? level : 0}
                  className={cn('border-b', {
                    'text-left': isRowHeader
                  })}
                >
                  <span style={{ fontSize }}>
                    {
                      cellValue === undefined || cellValue === null
                        ? nullValueCharacter
                        : formatValue(cellValue, {type: isRowHeader ? 'string' : 'number'})
                    }
                  </span>
                </TableCell>
              );
            }}
          />
        )))
        // sortedRowDimensionValues.map((rowDimension, rowIndex: number) => (
        //   <TableRow
        //     key={`${rowIndex}-${rowDimension?.replaceAll(' ', '-').toLowerCase()}`}
        //     columns={tableColumns}
        //     rowData={tableData[rowDimension]}
        //     rowHeader={rowDimension}
        //     renderCell={(cellValue, column, columnIndex) => {
        //       const isRowHeader = column.type === TableHeaderType.ROW_HEADER;
        //
        //       return (
        //         <TableCell
        //           key={`${rowIndex}-${columnIndex}-${column.key}`}
        //           isHeader={isRowHeader}
        //           className={cn('border-b', {
        //             'text-left': isRowHeader,
        //             'border-r': measures.at(-1)?.name === column.key || !column.parent || isRowHeader
        //           })}
        //         >
        //           <span style={{ fontSize }}>
        //             {
        //               cellValue === undefined || cellValue === null
        //                 ? nullValueCharacter
        //                 : formatValue(cellValue, {type: isRowHeader ? 'string' : 'number'})
        //             }
        //           </span>
        //           {
        //             cellValue && measureVisualizationFormat === MeasureVisualizationFormat.VALUE_BARS && !isRowHeader
        //               ? (
        //                 <div
        //                   className="h-1 rounded-sm"
        //                   style={{
        //                     width: `${(parseFloat(cellValue) / maxValueAmongMeasures) * 80}%`,
        //                     backgroundColor: `${COLORS[measures.findIndex((measure) => measure.name === column.key) % COLORS.length]}`
        //                   }}
        //                 />
        //               )
        //               : null
        //           }
        //         </TableCell>
        //       );
        //     }}
        //   />
        // ))
      }
      </tbody>
    </table>
  )
}

export default PivotTable;