import React, { ReactElement } from 'react';
import cn from '../../../../util/cn';
import { TableHeaderType } from '../enums/TableHeaderType';
import { SortDown, SortUp } from '../../../icons';
import { SortDirection } from '../../../../../enums/SortDirection';
import { REGULAR_FONT_SIZE } from '../../../../constants';

export type Column = {
  label: string;
  key: string;
  type: TableHeaderType;
  children?: Column[];
  parent?: Column;
  sortable?: boolean;
  minWidth?: number;
}

type Props = {
  columns: Column[];
  sortBy?: Column;
  sortDirection?: SortDirection;
  onSortingChange?: (column: Column, sortDirection: SortDirection) => void;
  fontSize?: string;
}

export default function TableHead({ columns, sortBy, sortDirection, onSortingChange, fontSize = REGULAR_FONT_SIZE }: Props) {
  const renderColumn = (column: Column, columnIndex: number): ReactElement => {
    const isSticky = column.type === TableHeaderType.ROW_HEADER || column.children?.some(child => child.type === TableHeaderType.ROW_HEADER);
    const shouldBeLeftAligned = column.type !== TableHeaderType.DIMENSION || column.children?.filter(child => child.type === TableHeaderType.MEASURE).length === 1;
    const shouldRenderRightBorder = !column.parent || column.parent?.children?.at(-1)?.key === column.key;
    const isDimension = column.type === TableHeaderType.DIMENSION;
    const isSortable = column.sortable && !isDimension;
    const isSorted = sortBy?.key === column.key && (!column.parent || column.parent?.label === sortBy?.parent?.label);

    return (
      <th
        key={`${column.key}-${columnIndex}`}
        colSpan={column.children?.length}
        className={cn('p-2', 'border-y', 'first:border-l', {
          'text-left': shouldBeLeftAligned,
          'border-r': shouldRenderRightBorder,
          'border-b-0': column.children?.length,
          'sticky left-0 z-10 bg-white': isSticky,
          'cursor-pointer': isSortable,
        })}
        style={column.minWidth ? { minWidth: column.minWidth } : {}}
        {...(
          isSortable
            ? {
              onClick: () => {
                onSortingChange?.(column, sortBy?.key === column.key && sortDirection === SortDirection.DESCENDING ? SortDirection.ASCENDING : SortDirection.DESCENDING)
              }
            }
            : null
        )}
      >
        {
          isSortable
            ? (
              <div className="flex items-center justify-between">
                <span
                  className="text-[#333942]"
                  style={{ fontSize }}
                >
                  {column.label}
                </span>
                {
                  isSorted ? (
                    sortDirection === SortDirection.ASCENDING
                      ? <SortUp fill="currentcolor" />
                      : <SortDown fill="currentcolor" />
                  ) : <SortDown fill="#c8c8c8" />
                }
              </div>
            )
            : (
              <span
                className="text-[#333942]"
                style={{ fontSize }}
              >
                {column.label}
              </span>
            )
        }
      </th>
    )
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
            columns={columns.map(column => column?.children?.map(child => ({
              ...child,
              parent: column
            })) || []).flat()}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortingChange={onSortingChange}
            fontSize={fontSize}
          />
        ) : null
      }
    </>
  )
}