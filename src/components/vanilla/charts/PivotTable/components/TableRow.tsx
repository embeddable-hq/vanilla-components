import React, { ReactElement, useState } from 'react';
import { Column } from '../core/Column';
import cn from '../../../../util/cn';
import TableCell from './TableCell';

type Props = {
  columns: Column[];
  row: Record<string, any>;
  renderCell?: (row: Record<string, any>, column: Column, level: number) => ReactElement;
  level?: number;
}

const TableRow = ({ columns, row, renderCell, level = 0 }: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const renderColumns = (columns: Column[], rowData: Record<string, any>) => (
    columns.map((column: Column) => (
      renderCell
        ? renderCell(rowData, column, level)
        : (
          <TableCell
            key={column.key}
            level={level}
          >
            { rowData[column.key] }
          </TableCell>
        )
    ))
  );

  return (
    <>
      <tr
        className={cn('hover:bg-gray-400/5', {
          'cursor-pointer': row.children?.length
        })}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        { renderColumns(columns, row.data) }
      </tr>
      {
        isExpanded && row.children?.map((subRow: Record<string, any>) => (
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