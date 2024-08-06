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
}

const TableHead = ({ columns, sortBy, sortDirection, onSortingChange, minColumnWidth }: Props) => {
  return (
    <thead className="border-y border-[#B8BDC6]">
      <tr>
        {
          columns.map((column) => {
            const isSorted = sortBy?.name === column.name;

            return (
              <th
                key={column.name}
                className="bg-white select-none cursor-pointer p-3"
                style={minColumnWidth ? { minWidth: `${minColumnWidth}px`, maxWidth: `${minColumnWidth * 1.2}px` } : {}}
                onClick={() => onSortingChange?.(column, isSorted ? sortDirection === SortDirection.ASCENDING ? SortDirection.DESCENDING : SortDirection.ASCENDING : SortDirection.ASCENDING)}
              >
                <div className="flex items-center hover:text-black">
                  <span className="text-[#333942] mr-1">
                    {column.title}
                  </span>

                  {
                    isSorted ? (
                      sortDirection === SortDirection.ASCENDING
                        ? <SortUp fill="currentcolor" />
                        : <SortDown fill="currentcolor" />
                    ) : <SortDown fill="#c8c8c8" />
                  }
                </div>
              </th>
            );
          })
        }
      </tr>
    </thead>
);
}

export default TableHead;