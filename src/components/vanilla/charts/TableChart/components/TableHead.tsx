import React from 'react';
import { SortDirection } from '../../../../../enums/SortDirection';
import { SortDown, SortUp } from '../../../icons';
import { DimensionOrMeasure } from '@embeddable.com/core';

type Props = {
  columns: DimensionOrMeasure[];
  sortBy?: DimensionOrMeasure;
  sortDirection?: SortDirection;
  onSortingChange?: (column: any, sortDirection: SortDirection) => void;
  minColumnWidth?: number;
};

const TableHead = ({ columns, sortBy, sortDirection, onSortingChange, minColumnWidth }: Props) => {
  return (
    <thead className="border-y border-[#B8BDC6]">
      <tr>
        {columns?.map((column) => {
          const isSorted = sortBy?.name === column.name;
          const newSortDirection = isSorted
            ? sortDirection === SortDirection.ASCENDING
              ? SortDirection.DESCENDING
              : SortDirection.ASCENDING
            : SortDirection.ASCENDING;

          return (
            <th
              key={column.name}
              className="bg-white select-none cursor-pointer p-3"
              style={
                minColumnWidth
                  ? {
                      minWidth: `${minColumnWidth}px`,
                      maxWidth: `${minColumnWidth * 1.2}px`,
                    }
                  : {}
              }
              onClick={() => onSortingChange?.(column, newSortDirection)}
            >
              <div className="flex items-center gap-1 hover:text-black">
                <span className="text-[#333942] mr-1 truncate">
                  {/* Use the label from inputs if available, otherwise use the title */}
                  {column?.inputs?.customColumnLabel ?? column.title}
                </span>

                {isSorted ? (
                  <span className="w-3">
                    {sortDirection === SortDirection.ASCENDING ? (
                      <SortUp fill="currentcolor" />
                    ) : (
                      <SortDown fill="currentcolor" />
                    )}
                  </span>
                ) : null}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
