import { DataResponse, DimensionOrMeasure, OrderBy, OrderDirection } from '@embeddable.com/core';
import { useEmbeddableState } from '@embeddable.com/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import formatValue from '../../../util/format';
import Container from '../../Container';
import { SortDown, SortUp } from '../../icons';
import debounce from 'lodash.debounce';
import Pagination from './components/Pagination';
import TableHead from './components/TableHead';
import { REGULAR_FONT_SIZE } from '../../../constants';
import { SortDirection } from '../../../../enums/SortDirection';

export type Props = {
  limit?: number;
  results: DataResponse;
  defaultSort?: { property: DimensionOrMeasure; direction: string }[];
  columns: DimensionOrMeasure[];
  title: string;
  fontSize?: string;
  minColumnWidth?: number;
};

type Meta = { page: number; maxRowsFit: number; sort: OrderBy[] };

type Record = { [p: string]: string };

export default (props: Props) => {
  const { columns, results } = props;
  const [maxRowsFit, setMaxRowFit] = useState(0);

  const [meta, setMeta] = useEmbeddableState({
    page: 0,
    maxRowsFit: 0,
    sort: props.defaultSort
  }) as [Meta, (f: (m: Meta) => Meta) => void];

  const calculateMaxRowFix = useCallback(({ height }: { height: number }) => {
    let val = 0;

    const heightWithoutHead = (height || 72) - 72;
    const newMaxRowsFit = Math.floor(heightWithoutHead / 44);

    if (
      (maxRowsFit === newMaxRowsFit && newMaxRowsFit === val) ||
      props.results?.data?.length === 0
    ) {
      return;
    }
    setMaxRowFit((val = newMaxRowsFit));

  }, [maxRowsFit, props.results]);

  useEffect(() => {
    setMeta((meta) => ({ ...meta, maxRowsFit }));
  }, [props.columns, maxRowsFit, setMeta]);

  const updateSort = useCallback(
    (column: DimensionOrMeasure) => {
      if (!meta) return;

      const sort: OrderBy[] = meta.sort?.slice() || [];
      const invert = { asc: 'desc', desc: 'asc' };
      const index = sort.findIndex((c) => c.property.name === column.name);

      if (index === 0) {
        sort[0] = { ...sort[0], direction: invert[sort[0].direction] as OrderDirection };
      } else {
        const [newOrder] = sort.splice(index, 1);
        sort.unshift(newOrder);
      }

      setMeta((meta) => ({ ...meta, sort, page: 0 }));
    },
    [meta, setMeta]
  );

  return (
    <Container
      {...props}
      className="overflow-auto"
      onResize={debounce(calculateMaxRowFix, 400)}
    >
      <div style={{ minWidth: `${columns.length * 100}px` }}>
        {!!meta && !(props.results?.isLoading && !props.results?.data?.length) && (
          <table
            className="overflow-visible w-full"
            style={{ fontSize: `${props.fontSize}px` || REGULAR_FONT_SIZE }}
          >
            <TableHead
              columns={columns}
              sortBy={meta?.sort?.[0]?.property}
              sortDirection={meta?.sort?.[0]?.direction === 'asc' ? SortDirection.ASCENDING : SortDirection.DESCENDING}
              onSortingChange={updateSort}
              minColumnWidth={props.minColumnWidth ? `${props.minColumnWidth}px` : undefined}
            />

            <tbody>
              {results?.data?.slice(0, maxRowsFit).map((row, index) => (
                <tr key={index} className="hover:bg-gray-400/5">
                  {
                    columns.map((column, index) => (
                      <td
                        key={index}
                        className="text-dark p-3"
                        style={{ fontSize: `${props.fontSize}px` || REGULAR_FONT_SIZE }}
                      >
                        <span>
                          {formatColumn(row[column.name], column)}
                        </span>
                      </td>
                    ))
                  }
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        currentPage={meta?.page || 0}
        hasNextPage={props.limit && results?.data?.length ? results?.data?.length < props.limit : false}
        onPageChange={(page) => {
          setMeta((meta) => ({ ...meta, page: page }));
        }}
      />
    </Container>
  );
};

function formatColumn(text: string | number, column: DimensionOrMeasure) {
  if (typeof text === 'number' || column.nativeType === 'number') {
    return formatValue(`${text}`, { type: 'number', meta: column?.meta });
  }

  if (text && column.nativeType === 'time') return formatValue(text, 'date');

  return formatValue(text);
}
