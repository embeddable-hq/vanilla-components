import React, { ReactElement, useMemo } from 'react';
import { Column } from './TableHead';
import { TableHeaderType } from '../enums/TableHeaderType';

type Props<T> = {
  columns: Column[];
  rowData: T | T[];
  rowHeader: string | undefined;
  renderCell?: (value: string | undefined, column: Column, columnIndex: number) => ReactElement;
}

const TableRow = <T,>({ columns, rowData, rowHeader, renderCell }: Props<T>) => {
  const renderColumns = (columns: Column[], data: T | T[]) => (
    columns.map((column, columnIndex) => {
      switch (column.type) {
        case TableHeaderType.ROW_HEADER:
          return renderCell
            ? renderCell(rowHeader, column, columnIndex)
            : <td key={`${columnIndex}-${column.key}`}>{ rowHeader }</td>;

        case TableHeaderType.DIMENSION: {
          // In case of dimension, we recursively render children columns
          const columns = column.children!.map(col => ({
            ...col,
            parent: column
          }));
          return renderColumns(columns, data[column.label]);
        }

        case TableHeaderType.MEASURE: {
          return renderCell
            ? renderCell(data?.[column.key], column, columnIndex)
            : <td key={`${columnIndex}-${column.key}`}>{ data?.[column.key] }</td>;
        }

        default:
          return <td key={`${columnIndex}-${column.key}`}></td>;
      }
    })
  );

  return (
    <tr className="hover:bg-gray-400/5">
      { renderColumns(columns, rowData) }
    </tr>
  );
}

export default TableRow;