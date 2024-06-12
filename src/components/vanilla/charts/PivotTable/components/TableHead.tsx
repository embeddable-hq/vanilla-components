import React, { ReactElement } from 'react';
import cn from 'classnames';
import { TableHeaderType } from '../enums/TableHeaderType';

export type Column = {
  label: string;
  key: string;
  type: TableHeaderType;
  children?: Column[];
  minWidth?: number;
}

type Props = {
  columns: Column[] | Array<Column[]>;
}

export default function TableHead({ columns }: Props) {
  const renderColumn = (column: Column | Column[], columnIndex: number, columns: Column[]): ReactElement => {
    if (Array.isArray(column)) {
      return column.map(renderColumn);
    } else {
      const isSticky = column.type === TableHeaderType.ROW_HEADER || column.children?.some(child => child.type === TableHeaderType.ROW_HEADER);
      const shouldBeLeftAligned = column.type !== TableHeaderType.DIMENSION || column.children?.filter(child => child.type === TableHeaderType.MEASURE).length === 1;
      const shouldRenderRightBorder = column.type !== TableHeaderType.MEASURE || columnIndex === columns.length - 1;

      return (
        <th
          key={`${column.key}-${columnIndex}`}
          colSpan={column.children?.length}
          className={cn('p-2', 'border-y', 'first:border-l', {
            'text-left': shouldBeLeftAligned,
            'border-r': shouldRenderRightBorder,
            'border-b-0': column.children?.length,
            'sticky left-0 z-10 bg-white': isSticky
          })}
          style={column.minWidth ? { minWidth: column.minWidth } : {}}
        >
          <span>
            {column.label}
          </span>
        </th>
      )
    }
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
            columns={columns.map(column => column?.children || [])}
          />
        ) : null
      }
    </>
  )
}