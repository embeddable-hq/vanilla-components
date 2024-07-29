import React, { ReactElement, useState } from 'react';
import { Column } from '../core/Column';
import cn from '../../../../util/cn';
import TableCell from './TableCell';
import { Row } from '../core/Row';
import { ColumnType } from '../enums/ColumnType';
import { ChevronDown } from '../../../icons';

type Props = {
  columns: Column[];
  row: Row;
  renderCell?: (row: Record<string, any>, column: Column) => ReactElement;
  level?: number;
}

const TableRow = ({ columns, row, renderCell, level = 0 }: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const toggleExpand = () => {
    setIsExpanded((expanded) => !expanded);
  }

  const getTableCell = (column: Column, rowData: Record<string, any>): ReactElement => {
    const isRowHeader = column.type === ColumnType.ROW_HEADER;

    return (
      <TableCell
        key={`${row.id}-${column.key}`}
        isHeader={isRowHeader}
        className={cn('border-b', {
          'border-r': !column.parent || column.parent?.children?.at(-1)?.key === column.key || isRowHeader,
        })}
      >
        <div
          className="flex items-center"
          style={{ marginLeft: isRowHeader ? `${level * 30}px` : 0 }}
        >
          {
            row.children?.length && isRowHeader
              ? (
                <ChevronDown
                  className={cn('w-4 h-4 mr-1 cursor-pointer transform', {
                    '-rotate-90': !isExpanded
                  })}
                  onClick={toggleExpand}
                />
              )
              : null
          }
          { renderCell?.(rowData, column) || rowData[column.key] }
        </div>

      </TableCell>
    );
  }

  const renderColumns = (columns: Column[], rowData: Record<string, any>): ReactElement[] => (
    columns.map((column: Column) => (
      column.type === ColumnType.ROW_HEADER_GROUP && column.group?.length ? getTableCell(column.group[level], rowData) : getTableCell(column, rowData)
    ))
  );

  return (
    <>
      <tr className="bg-white hover:bg-gray-100">
        { renderColumns(columns, row.data) }
      </tr>
      {
        isExpanded && row.children?.map(subRow => (
          <TableRow
            key={subRow.id}
            columns={columns}
            row={subRow}
            renderCell={renderCell}
            level={level + 1}
          />
        ))
      }
    </>
  );
}

export default TableRow;