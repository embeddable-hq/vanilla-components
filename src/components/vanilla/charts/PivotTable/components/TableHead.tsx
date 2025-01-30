import React, { ReactElement } from 'react';
import cn from '../../../../util/cn';
import { ColumnType } from '../enums/ColumnType';
import { Column } from '../core/Column';
import { SortCriteria } from '../../../../util/sortFn';
import { SortDirection } from '../../../../../enums/SortDirection';
import { SortDown, SortUp } from '../../../icons';
import defaultTheme from '../../../../../themes/defaulttheme';
import { Theme } from '../../../../../themes/theme';
import { useOverrideConfig } from '@embeddable.com/react';

type Props = {
  columns: Column[];
  onSortingChange?: (columnKey: string, sortDirection: SortDirection) => void;
  fontSize?: string;
  minColumnWidth?: string;
  minHeaderColumnWidth?: string;
  enableSorting?: boolean;
  sortCriteria?: SortCriteria<any>[];
};

export default function TableHead({
  columns,
  fontSize = `${defaultTheme.font.size}px`,
  minColumnWidth,
  minHeaderColumnWidth,
  enableSorting = true,
  sortCriteria,
  onSortingChange,
}: Props) {
  // Get theme for use in component
  const overrides: { theme: Theme } = useOverrideConfig() as { theme: Theme };
  let { theme } = overrides;
  if (!theme) {
    theme = defaultTheme;
  }
  fontSize = `${theme.font.size}px`;
  const fontColor = theme.font.colorDark;

  const renderColumn = (column: Column, columnIndex: number): ReactElement => {
    const isRowHeader =
      column.type === ColumnType.ROW_HEADER || column.type === ColumnType.ROW_HEADER_GROUP;
    const shouldBeLeftAligned =
      column.type !== ColumnType.DIMENSION ||
      column.children?.filter((child) => child.type === ColumnType.MEASURE).length === 1;
    const leafColumns = column.getLeafColumns();
    const isSticky =
      isRowHeader ||
      leafColumns.some(
        (child) =>
          child.type === ColumnType.ROW_HEADER || child.type === ColumnType.ROW_HEADER_GROUP,
      );
    const shouldRenderRightBorder =
      column.depth === 0 ||
      column.type !== ColumnType.MEASURE ||
      column.parent?.children?.at(-1)?.key === column.key;
    const isSortable = enableSorting && column.type !== ColumnType.DIMENSION;
    const sortedDirection = sortCriteria?.find(
      (criteria) => criteria.key === column.key,
    )?.direction;

    return (
      <th
        key={`${columnIndex}-${column.key}`}
        colSpan={leafColumns.length}
        className={cn('p-2 border-y first:border-l', {
          'border-b-0': column.children?.length,
          'border-r': shouldRenderRightBorder,
          'lg:sticky lg:left-0 lg:z-10 bg-white': isSticky,
          'cursor-pointer': isSortable,
        })}
        style={
          minColumnWidth
            ? {
                minWidth: (isRowHeader ? minHeaderColumnWidth : minColumnWidth) ?? 'auto',
              }
            : {}
        }
        {...(isSortable
          ? {
              onClick: () => {
                onSortingChange?.(
                  column.key,
                  sortedDirection === SortDirection.DESCENDING
                    ? SortDirection.ASCENDING
                    : SortDirection.DESCENDING,
                );
              },
            }
          : null)}
      >
        <div
          className={cn('text-center', {
            'text-left': shouldBeLeftAligned,
            'flex justify-between items-center gap-2': isSortable,
          })}
        >
          <span className={`text-[${fontColor}]`} style={{ fontSize }}>
            {column.label}
          </span>
          {isSortable ? (
            <span
              className={cn('w-3', {
                invisible: !sortedDirection,
              })}
            >
              {sortedDirection === SortDirection.ASCENDING ? (
                <SortUp fill="currentcolor" />
              ) : (
                <SortDown fill="currentcolor" />
              )}
            </span>
          ) : null}
        </div>
      </th>
    );
  };

  if (!columns.length) {
    return null;
  }

  // Recursively render table headers with all dimensions
  return (
    <>
      <tr>{columns.map(renderColumn)}</tr>
      {columns[0].children ? (
        <TableHead
          columns={columns.map((column) => column?.children || []).flat()}
          onSortingChange={onSortingChange}
          fontSize={fontSize}
          minColumnWidth={minColumnWidth}
          minHeaderColumnWidth={minHeaderColumnWidth}
          enableSorting={enableSorting}
          sortCriteria={sortCriteria}
        />
      ) : null}
    </>
  );
}
