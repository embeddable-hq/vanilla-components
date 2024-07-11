import React, { ReactElement } from 'react';
import cn from '../../../../util/cn';
import { ColumnType } from '../enums/ColumnType';
import { SortDown, SortUp } from '../../../icons';
import { SortDirection } from '../../../../../enums/SortDirection';
import { REGULAR_FONT_SIZE } from '../../../../constants';
import { Column } from '../core/Column';

type Props = {
  columns: Column[];
  // sortBy?: Column;
  // sortDirection?: SortDirection;
  // onSortingChange?: (column: Column, sortDirection: SortDirection) => void;
  fontSize?: string;
}

export default function TableHead({ columns, fontSize = REGULAR_FONT_SIZE }: Props) {

  const renderColumn = (column: Column, columnIndex: number): ReactElement => {
    const leafColumns = column.getLeafColumns();
    const isSticky = leafColumns.some(child => child.type === ColumnType.ROW_HEADER);

    return (
      <th
        key={`${columnIndex}-${column.key}`}
        colSpan={leafColumns.length}
        className={cn('p-2', 'border-y', 'first:border-l', {
          'border-b-0': column.children?.length,
          'sticky left-0 z-10 bg-white': isSticky
        })}

      >
        <span
          className="text-[#333942]"
          style={{ fontSize }}
        >
          {column.label}
        </span>
      </th>
    )
  }

  if (!columns.length) {
    return null;
  }
  // Recursively render table headers with all dimensions
  return (
    <>
      <tr>
        { columns.map(renderColumn) }
      </tr>
      {
        columns[0].children ? (
          <TableHead
            columns={columns.map(column => column?.children).flat()}
            // sortBy={sortBy}
            // sortDirection={sortDirection}
            // onSortingChange={onSortingChange}
            fontSize={fontSize}
          />
        ) : null
      }
    </>
  )
}