import { DataResponse, DimensionOrMeasure, OrderBy, OrderDirection } from '@embeddable.com/core';
import { useEmbeddableState } from '@embeddable.com/react';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import formatValue from '../../../util/format';
import Container from '../../Container';
import { ChevronLeft, ChevronRight, SortDown, SortUp } from '../../icons';

export type Props = {
  limit?: number;
  results: DataResponse;
  defaultSort?: { property: DimensionOrMeasure; direction: string }[];
  columns: DimensionOrMeasure[];
  title: string;
};

type Meta = { page: number; maxRowsFit: number; sort: OrderBy[] };

type Record = { [p: string]: string };

export default (props: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { columns, results } = props;
  const [maxRowsFit, setMaxRowFit] = useState(0);

  useLayoutEffect(() => {
    let val = 0;

    const interval = setInterval(() => {
      const elem = ref.current?.parentElement?.parentElement;
      const heightWithoutHead = (elem?.clientHeight || 72) - 72;
      const newMaxRowsFit = Math.floor(heightWithoutHead / 44);

      if (
        (maxRowsFit === newMaxRowsFit && newMaxRowsFit === val) ||
        props.results?.data?.length === 0
      ) {
        return;
      }
      setMaxRowFit((val = newMaxRowsFit));
    }, 100);

    return () => clearInterval(interval);
  }, [maxRowsFit, props.results]);

  const [meta, setMeta] = useEmbeddableState({
    page: 0,
    maxRowsFit: 0,
    sort: props.defaultSort
  }) as [Meta, (f: (m: Meta) => Meta) => void];

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

  const rows = useMemo(
    () =>
      results?.data?.map(
        (record: Record) =>
          columns?.map((prop) => {
            if (!prop) return '';

            const parsed = parseFloat(record[prop.name]);

            return `${parsed}` === record[prop.name] ? parsed : record[prop.name] || '';
          }) || []
      ) || [],
    [results, columns]
  );

  return (
    <Container
      {...props}
      className="overflow-y-hidden">
      <div
        ref={ref}
        className="grow flex flex-col justify-start w-full overflow-x-auto font-embeddable text-sm"
      >
        <div
          className="grow overflow-hidden relative"
          style={{ minWidth: `${columns.length * 100}px` }}
        >
          {!!meta && !(props.results?.isLoading && !props.results?.data?.length) && (
            <table className="overflow-visible w-full">
              <thead className="border-y border-[#B8BDC6]">
                <tr>
                  {columns?.map((h, i) => {
                    const sortIndex = meta?.sort?.findIndex((c) => c.property.name === h.name) || 0;

                    return (
                      <th
                        onClick={() => updateSort(h)}
                        key={i}
                        className="bg-white select-none cursor-pointer text-[#333942] p-3"
                      >
                        <div className="flex items-center justify-start basis-0 grow h-5 text-[#333942] hover:text-black font-bold text-sm relative w-full">
                          <div className="absolute left-0 top-0 h-full w-full flex items-center">
                            <span className="block text-ellipsis overflow-hidden whitespace-nowrap">
                              {h?.title}
                            </span>
                            <div
                              className={`${
                                sortIndex === 0 ? 'text-[#FF6B6C]' : 'text-[#333942]'
                              } ml-1`}
                            >
                              {meta?.sort?.[sortIndex]?.direction === 'asc' ? (
                                <SortUp fill="currentcolor" />
                              ) : (
                                <SortDown fill="currentcolor" />
                              )}
                            </div>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {rows.slice(0, maxRowsFit).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-400/5">
                    {row.map((c, i) => (
                      <td key={i} className="text-sm text-dark p-3">
                        <span className="text-overflow-dynamic-container">
                          <span
                            className="text-overflow-dynamic-ellipsis"
                            title={formatColumn(c, columns[i])}
                          >
                            {formatColumn(c, columns[i])}
                          </span>
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {(!meta || (props.results?.isLoading && !props.results?.data?.length)) && (
            <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
          )}
        </div>
      </div>

      <div className="flex mt-2 items-center justify-center text-[12px] font-bold text-[#333942] select-none">
        <ChevronLeft
          onClick={() => {
            setMeta((meta) => ({ ...meta, page: Math.max(0, (meta?.page || 0) - 1) }));
          }}
          className={`cursor-pointer hover:bg-black/10 rounded-full w-8 h-8 p-1 border border-[#DADCE1] flex items-center justify-center ${
            meta?.page === 0 ? 'opacity-50 pointer-events-none' : ''
          }`}
        />
        <span className="mx-4">Page {(meta?.page || 0) + 1}</span>
        <ChevronRight
          onClick={() => {
            setMeta((meta) => ({ ...meta, page: (meta?.page || 0) + 1 }));
          }}
          className={`cursor-pointer hover:bg-black/10 rounded-full w-8 h-8 p-1 border border-[#DADCE1] flex items-center justify-center ${
            (props.limit ? rows.length < props.limit : false)
              ? 'opacity-50 pointer-events-none'
              : ''
          }`}
        />
      </div>
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
