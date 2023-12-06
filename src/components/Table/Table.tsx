import { useEmbeddableState } from '@embeddable.com/react';
import { OrderBy, OrderDirection } from '@embeddable.com/core';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeaderCell } from '@tremor/react';

import useResize from '../../hooks/useResize';

import Spinner from '../Spinner';

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

  const [meta, setMeta] = useEmbeddableState({
    page: 0,
    maxRowsFit: 0,
    sort: props.defaultSort
  }) as any;

  const updateSort = useCallback(
    (column: Column) => {
      if (!meta) return;

      const sort: OrderBy[] = meta.sort.slice();
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
      {!!props.title && (
        <h2 className="text-[#333942] text-[14px] font-bold justify-start flex mb-8">
          {props.title}
        </h2>
      )}
      <div className="grow overflow-hidden relative" ref={ref}>
        {!!meta && !(props.tableData?.isLoading && !props.tableData?.data?.length) && (
          <Table className="overflow-visible">
            <TableHead className="border-y border-[#B8BDC6]">
              <TableRow>
                {columns?.map((h, i) => {
                  const sortIndex = meta.sort.findIndex((c) => c.property.name === h.name);

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
                          {meta.sort[sortIndex]?.direction === 'asc' ? (
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
        <ShevronLeft
          onClick={() => {
            setMeta({ ...meta, page: Math.max(0, (meta?.page || 0) - 1) });
          }}
          className={`cursor-pointer hover:bg-black/10 rounded-full w-8 h-8 p-1 border border-[#DADCE1] flex items-center justify-center ${
            meta.page === 0 ? 'opacity-50 pointer-events-none' : ''
          }`}
        />
        <span className="mx-4">Page {(meta?.page || 0) + 1}</span>
        <ShevronRight
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

const ShevronLeft = ({ className, onClick }: { className?: string; onClick?: () => void }) => (
  <svg
    onClick={onClick}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.3482 12.6485C10.8169 12.1799 10.8169 11.4201 10.3482 10.9515L7.19676 7.8L10.3482 4.64853C10.8169 4.1799 10.8169 3.4201 10.3482 2.95147C9.87961 2.48284 9.11981 2.48284 8.65118 2.95147L4.65118 6.95147C4.18255 7.4201 4.18255 8.1799 4.65118 8.64853L8.65118 12.6485C9.11981 13.1172 9.87961 13.1172 10.3482 12.6485Z"
      fill="#333942"
    />
  </svg>
);

const ShevronRight = ({ className, onClick }: { className?: string; onClick?: () => void }) => (
  <svg
    onClick={onClick}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.65128 12.6485C6.18265 12.1799 6.18265 11.4201 6.65128 10.9515L9.80275 7.8L6.65128 4.64853C6.18265 4.1799 6.18265 3.4201 6.65128 2.95147C7.11991 2.48284 7.8797 2.48284 8.34833 2.95147L12.3483 6.95147C12.817 7.4201 12.817 8.1799 12.3483 8.64853L8.34833 12.6485C7.8797 13.1172 7.11991 13.1172 6.65128 12.6485Z"
      fill="#333942"
    />
  </svg>
);

const SortDown = (props: { fill: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.34837 10.7038C9.27113 10.7974 9.17828 10.8719 9.07543 10.9228C8.97258 10.9737 8.86187 11 8.75 11C8.63813 11 8.52742 10.9737 8.42457 10.9228C8.32172 10.8719 8.22887 10.7974 8.15163 10.7038L4.9518 6.53977C4.84941 6.40639 4.78253 6.24163 4.75921 6.06531C4.73588 5.889 4.75711 5.70864 4.82033 5.54595C4.88355 5.38326 4.98607 5.24518 5.11556 5.14832C5.24504 5.05146 5.39597 4.99995 5.55017 5H11.9498C12.104 4.99995 12.255 5.05146 12.3844 5.14832C12.5139 5.24518 12.6164 5.38326 12.6797 5.54595C12.7429 5.70864 12.7641 5.889 12.7408 6.06531C12.7175 6.24163 12.6506 6.40639 12.5482 6.53977L9.34837 10.7038Z"
      fill={props.fill}
    />
  </svg>
);

const SortUp = (props: { fill: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.59837 5.2962C8.52113 5.20259 8.42828 5.12807 8.32543 5.07716C8.22258 5.02625 8.11187 5 8 5C7.88813 5 7.77742 5.02625 7.67457 5.07716C7.57172 5.12807 7.47887 5.20259 7.40163 5.2962L4.2018 9.46023C4.09941 9.59361 4.03253 9.75837 4.00921 9.93469C3.98588 10.111 4.00711 10.2914 4.07033 10.454C4.13355 10.6167 4.23607 10.7548 4.36556 10.8517C4.49504 10.9485 4.64597 11 4.80017 11H11.1998C11.354 11 11.505 10.9485 11.6344 10.8517C11.7639 10.7548 11.8664 10.6167 11.9297 10.454C11.9929 10.2914 12.0141 10.111 11.9908 9.93469C11.9675 9.75837 11.9006 9.59361 11.7982 9.46023L8.59837 5.2962Z"
      fill={props.fill}
    />
  </svg>
);
