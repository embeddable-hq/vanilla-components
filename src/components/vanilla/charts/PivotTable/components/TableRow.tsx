import React, { ReactElement, useMemo } from 'react';
import { Column } from './TableHead';
import { TableHeaderType } from '../enums/TableHeaderType';
import { keyBy } from '../../../../util/dataManipulation';

type Props = {
  columns: Column[];
  rowData: Record<string, any>;
  renderCell?: (value: string, column: Column, columns: Column[], columnIndex: number) => ReactElement;
}

export default ( { columns, rowData, renderCell }: Props) => {
  const rowDataToRender = useMemo(() => {
    if (columns[0].type === TableHeaderType.DIMENSION) {
      return keyBy(rowData, (record) => record[columns[0].key])
    }

    return rowData[0];
  }, [columns, rowData]);

  const renderColumns = (columns: Column[], data: Record<string, any>) => (
    columns.map((column, columnIndex) => {
      switch (column.type) {
        case TableHeaderType.ROW_HEADER:
          // Each group has the same row dimension value, so it doesn't metter which record we use
          return renderCell
            ? renderCell(rowData?.[0]?.[column.key], column, columns, columnIndex)
            : <td key={`${columnIndex}-${column.key}`}>{ rowData?.[0]?.[column.key] }</td>;

        case TableHeaderType.DIMENSION: {
          // In case of dimension, we recursively render children columns
          return renderColumns(column.children!, data[column.label]);
        }

        case TableHeaderType.MEASURE: {
          return renderCell
            ? renderCell(data?.[column.key], column, columns, columnIndex)
            : <td key={`${columnIndex}-${column.key}`}>{ data?.[column.key] }</td>;
        }

        default:
          return <td key={`${columnIndex}-${column.key}`}></td>;
      }
    })
  );

  return (
    <tr className="hover:bg-gray-400/5">
      { renderColumns(columns, rowDataToRender) }
    </tr>
  );
}