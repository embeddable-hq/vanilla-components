import { DataResponse, DimensionOrMeasure, OrderBy, OrderDirection, Dimension } from '@embeddable.com/core';
import { useEmbeddableState } from '@embeddable.com/react';
import React, { useCallback, useEffect, useState } from 'react';

import { SortDirection } from '../../../../enums/SortDirection';
import { REGULAR_FONT_SIZE } from '../../../constants';
import formatValue from '../../../util/format';
import Container from '../../Container';
import Pagination from './components/Pagination';
import TableHead from './components/TableHead';

export type Props = {
  limit?: number;
  results: DataResponse;
  defaultSort?: { property: DimensionOrMeasure; direction: string }[];
  columns: DimensionOrMeasure[];
  title: string;
  fontSize?: number;
  minColumnWidth?: number;
  rowFilterDimension?: Dimension;
  onClick: (v?:number) => void;
};

type Meta = { page: number; maxRowsFit: number; sort: OrderBy[] };

export default (props: Props) => {
  const { columns, results } = props;
  const [maxRowsFit, setMaxRowFit] = useState(0);
  const [resizing, setResizing] = useState(false);

  const [meta, setMeta] = useEmbeddableState({
    page: 0,
    maxRowsFit: 0,
    sort: props.defaultSort,
  }) as [Meta, (f: (m: Meta) => Meta) => void];

  const calculateMaxRowFix = useCallback(
    ({ height }: { height: number }) => {
      let val = 0;

      const heightWithoutHead = (height || 76) - 76;
      const newMaxRowsFit = Math.floor(heightWithoutHead / 44);

      if (
        (maxRowsFit === newMaxRowsFit && newMaxRowsFit === val) ||
        props.results?.data?.length === 0
      ) {
        return;
      }
      setMaxRowFit((val = newMaxRowsFit));
    },
    [maxRowsFit, props.results],
  );

  useEffect(() => {
    if (!resizing) {
      setMeta((meta) => ({ ...meta, maxRowsFit }));
    }
  }, [props.columns, maxRowsFit, setMeta, resizing]);

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
    [meta, setMeta],
  );

  const handleClick = (value:number) => {
    if(value){
      props.onClick(value);
      setMeta((meta) => ({ ...meta, page: 0 }));
    }
  }

  return (
    <Container
      {...props}
      onResize={calculateMaxRowFix}
      setResizeState={(value) => setResizing(value)}
      className="overflow-y-auto"
      childContainerClassName="overflow-x-auto"
    >
      <div style={{ minWidth: `${columns.length * (props.minColumnWidth ?? 100)}px` }}>
        {!!meta && !(props.results?.isLoading && !props.results?.data?.length) && (
          <table
            className="overflow-visible w-full"
            style={{ fontSize: props.fontSize ? `${props.fontSize}px` : REGULAR_FONT_SIZE }}
          >
            <TableHead
              columns={columns}
              sortBy={meta?.sort?.[0]?.property}
              sortDirection={
                meta?.sort?.[0]?.direction === 'asc'
                  ? SortDirection.ASCENDING
                  : SortDirection.DESCENDING
              }
              onSortingChange={updateSort}
              minColumnWidth={props.minColumnWidth ? props.minColumnWidth : undefined}
            />

            <tbody>
              {results?.data?.slice(0, maxRowsFit).map((row, index) => {

                const filterValue = props.rowFilterDimension && row[props.rowFilterDimension.name];

                return (
                <tr
                  key={index}
                  onClick={() => handleClick(filterValue)}
                  className={`hover:bg-gray-400/5 ${filterValue ? 'cursor-pointer' : ''}`}>
                  {columns.map((column, index) => {
                    const cellValue = row[column.name];
                    return (
                    <td
                      key={index}
                      className="text-dark p-3 truncate"
                      style={{
                        fontSize: props.fontSize ? `${props.fontSize}px` : REGULAR_FONT_SIZE,
                        maxWidth: props.minColumnWidth ? `${props.minColumnWidth * 1.2}px` : 'auto',
                      }}
                    >
                      <span title={formatColumn(cellValue, column) ?? ''}>
                        {formatColumn(cellValue, column)}
                      </span>
                    </td>
                  )})}
                </tr>
              )})}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        currentPage={meta?.page || 0}
        hasNextPage={
          props.limit && results?.data?.length ? results?.data?.length < props.limit : false
        }
        onPageChange={(page) => {
          setMeta((meta) => ({ ...meta, page: page }));
        }}
      />
    </Container>
  );
};

function formatColumn(text: string | number, column: DimensionOrMeasure) {
  if (typeof text === 'number' || column.nativeType === 'number') {
    return formatValue(`${text || 0}`, { type: 'number', meta: column?.meta });
  }

  if (text && column.nativeType === 'time') return formatValue(text, 'date');

  return formatValue(text);
}
