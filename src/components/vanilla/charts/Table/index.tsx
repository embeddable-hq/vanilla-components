import { DimensionOrMeasure, OrderBy, OrderDirection } from '@embeddable.com/core';
import { DataResponse, useEmbeddableState } from '@embeddable.com/react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import useFont from '../../../hooks/useFont';
import useResize from '../../../hooks/useResize';
import ChartContainer from '../../ChartContainer';
import Spinner from '../../Spinner';
import Title from '../../Title';
import { ChevronLeft, ChevronRight, SortDown, SortUp, WarningIcon } from '../../icons';
import { Inputs } from './Table.emb';

type Props = Inputs & {
  limit?: number;
  tableData: DataResponse;
  defaultSort?: OrderBy[];
};

type Record = { [p: string]: string };

export default (props: Props) => {
  const { columns, tableData } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, height] = useResize(ref);

  const format = (text, column) => {
    if (typeof text === 'number') {
      return new Intl.NumberFormat().format(text);
    }
    if (text && column.nativeType === 'time') {
      if (text.endsWith('T00:00:00.000')) {
        return new Intl.DateTimeFormat().format(new Date(text));
      }
      return new Date(text).toLocaleString();
    }
    return text;
  };

  useFont();

  const [meta, setMeta] = useEmbeddableState({
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
      const heightWithoutHead = height - 40;
      const maxRowsFit = Math.floor(heightWithoutHead / 45);

      setMeta({ ...meta, maxRowsFit });
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [height, setMeta]);

  const rows = useMemo(
    () =>
      tableData?.data?.map(
        (record: Record) =>
          columns?.map((prop) => {
            if (!prop) return '';

            const parsed = parseFloat(record[prop.name]);

            return `${parsed}` === record[prop.name] ? parsed : record[prop.name] || '';
          }) || []
      ) || [],
    [tableData]
  );

  return (
    <ChartContainer title={props.title} results={props.tableData}>
      <div className="grow flex flex-col justify-start w-full overflow-x-auto font-embeddable text-sm">
        <div
          className="grow overflow-hidden relative"
          style={{ minWidth: `${columns.length * 100}px` }}
          ref={ref}
        >
          {!!meta && !(props.tableData?.isLoading && !props.tableData?.data?.length) && (
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
                            <span className="block text-ellipsis overflow-hidden">{h?.title}</span>
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
                {rows.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-400/5">
                    {row.map((c, i) => (
                      <td key={i} className="text-sm text-dark p-3">
                        <span className="text-overflow-dynamic-container">
                          <span
                            className="text-overflow-dynamic-ellipsis"
                            title={format(c, columns[i])}
                          >
                            {format(c, columns[i])}
                          </span>
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {(!meta || (props.tableData?.isLoading && !props.tableData?.data?.length)) && (
            <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
          )}
        </div>
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
            props.limit ? rows.length < props.limit : false ? 'opacity-50 pointer-events-none' : ''
          }`}
        />
      </div>
    </ChartContainer>
  );
};
