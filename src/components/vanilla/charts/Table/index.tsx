import { DataResponse } from '@embeddable.com/react';
import { DimensionOrMeasure } from '@embeddable.com/core';

import { useEmbeddableState } from '@embeddable.com/react';

const getEmbeddableState = debug => {
  if(debug) {
    return (initialState) => [
        initialState,
        (newState) => initialState = newState
      ];
  }
  return useEmbeddableState;
}


import { OrderBy, OrderDirection } from '@embeddable.com/core';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeaderCell } from '@tremor/react';

import useFont from '../../../hooks/useFont';
import useResize from '../../../hooks/useResize';

import Title from '../../Title';
import Spinner from '../../Spinner';
import { ChevronRight, ChevronLeft, SortDown, SortUp, WarningIcon } from '../../icons';

type Props = {
  title?: string;
  limit: number;
  columns: DimensionOrMeasure[];
  maxPageRows?: number;
  tableData: DataResponse;
  defaultSort: OrderBy[];
  debug: boolean;
};

export default (props: Props) => {
  const { columns, tableData } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, height] = useResize(ref);
  const embeddableState = getEmbeddableState(props.debug);

  const format = (text, column) => {
    if(typeof text === 'number') {
      return new Intl.NumberFormat().format(text);
    }
    if(text && column.nativeType === 'time') {
      if(text.endsWith('T00:00:00.000')) {
        return new Intl.DateTimeFormat().format(new Date(text));
      }
      return new Date(text).toLocaleString();
    }
    return text;
  }

  useFont();

  useEffect(() => {
    console.log('Table props', props);
  }, [props]);

  const [meta, setMeta] = embeddableState({
    page: 0,
    maxRowsFit: 0,
    sort: props.defaultSort
  }) as any;

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

      setMeta({ ...meta, sort, page: 0 });
    },
    [meta, setMeta]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const heightWithoutHead = height - 30;
      const maxRowsFit = Math.floor(heightWithoutHead / 53);

      setMeta({ ...meta, maxRowsFit });
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [height, setMeta]);

  const rows = useMemo(
    () =>
      tableData?.data?.map(
        (record) =>
          columns?.map((prop) => {
            if (!prop) return '';

            const parsed = parseFloat(record[prop.name]);

            return `${parsed}` === record[prop.name] ? parsed : record[prop.name] || '';
          }) || []
      ) || [],
    [tableData]
  );

  if (props.tableData?.error) {
    return (
      <div className="h-full flex items-center justify-center">
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{props.tableData?.error}</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-start">
      <Title title={props.title} />
      <div className="grow overflow-hidden relative" ref={ref}>
        {!!meta && !(props.tableData?.isLoading && !props.tableData?.data?.length) && (
          <Table className="overflow-visible">
            <TableHead className="border-y border-[#B8BDC6]">
              <TableRow>
                {columns?.map((h, i) => {
                  const sortIndex = meta?.sort?.findIndex((c) => c.property.name === h.name) || 0;

                  return (
                    <TableHeaderCell
                      onClick={() => updateSort(h)}
                      key={i}
                      className="bg-white select-none cursor-pointer text-[#333942]"
                    >
                      <div className="flex items-center justify-start basis-0 grow w-0 text-[#333942] hover:text-black font-bold text-[12px]">
                        {h?.title}
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
                    </TableHeaderCell>
                  );
                })}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index} className="hover:bg-gray-400/5">
                  {row.map((c, i) => (
                    <TableCell key={i} className="text-sm text-dark">
                      <span className="text-overflow-dynamic-container">
                        <span
                          className="text-overflow-dynamic-ellipsis"
                          title={format(c, columns[i])}
                        >
                          {format(c, columns[i])}
                        </span>
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {(!meta || (props.tableData?.isLoading && !props.tableData?.data?.length)) && (
          <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
        )}
        <Spinner show={!meta || props.tableData?.isLoading} />
      </div>
      <div className="flex mt-2 items-center justify-center text-[12px] font-bold text-[#333942] select-none">
        <ChevronLeft
          onClick={() => {
            setMeta({ ...meta, page: Math.max(0, (meta?.page || 0) - 1) });
          }}
          className={`cursor-pointer hover:bg-black/10 rounded-full w-8 h-8 p-1 border border-[#DADCE1] flex items-center justify-center ${
            meta?.page === 0 ? 'opacity-50 pointer-events-none' : ''
          }`}
        />
        <span className="mx-4">Page {(meta?.page || 0) + 1}</span>
        <ChevronRight
          onClick={() => {
            setMeta({ ...meta, page: (meta?.page || 0) + 1 });
          }}
          className={`cursor-pointer hover:bg-black/10 rounded-full w-8 h-8 p-1 border border-[#DADCE1] flex items-center justify-center ${
            rows.length < props.limit ? 'opacity-50 pointer-events-none' : ''
          }`}
        />
      </div>
    </div>
  );
};
