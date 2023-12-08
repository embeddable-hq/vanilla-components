import { useEmbeddableState } from '@embeddable.com/react';
import { OrderBy, OrderDirection } from '@embeddable.com/core';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeaderCell } from '@tremor/react';

import useFont from '../../hooks/useFont';
import useResize from '../../hooks/useResize';

import Title from '../Title';
import Spinner from '../Spinner';
import { ChevronRight, ChevronLeft, SortDown, SortUp } from '../icons';

type Column = {
  name: string;
  title: string;
  description: string | null;
};

type Props = {
  title?: string;
  limit: number;
  columns: Column[];
  maxPageRows?: number;
  tableData: TableData;
  defaultSort: OrderBy[];
};

type TableData = {
  error?: string;
  isLoading: boolean;
  data?: any[];
};

export default (props: Props) => {
  const { columns, tableData } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, height] = useResize(ref);
  const { format } = useMemo(() => new Intl.NumberFormat(), []);

  useFont();

  const [meta, setMeta] = useEmbeddableState({
    page: 0,
    maxRowsFit: 0,
    sort: props.defaultSort
  }) as any;

  const updateSort = useCallback(
    (column: Column) => {
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
  }, [height]);

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

  return (
    <div className="h-full flex flex-col justify-start">
      <Title title={props.title} />
      <div className="grow overflow-hidden relative" ref={ref}>
        {!!meta && !(props.tableData?.isLoading && !props.tableData?.data?.length) && (
          <Table className="overflow-visible">
            <TableHead className="border-y border-[#B8BDC6]">
              <TableRow>
                {columns?.map((h, i) => {
                  const sortIndex = meta?.sort?.findIndex((c) => c.property.name === h.name) || [];

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
                          title={typeof c === 'number' ? format(c) : c}
                        >
                          {typeof c === 'number' ? format(c) : c}
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
