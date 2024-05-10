/* eslint-disable no-extra-boolean-cast */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import classNames from 'classnames';
import { FileWarningIcon } from 'lucide-react';
import Pivot from 'quick-pivot';
import { useMemo } from 'react';

import Container from '../../Container';

export type Props = {
  tableData: DataResponse;
  columns: Dimension[];
  rows: Dimension[];
  measures: Measure;
  title: string;
};

export default (props: Props) => {
  const { columns, tableData, rows, measures } = props;

  const rowsToPivot = rows.map((row) => row.name);
  const colsToPivot = columns.map((row) => row.name);
  const aggregationDimension = measures.name;
  const aggregator = 'sum';

  const pivot = useMemo(() => {
    if (tableData.isLoading) return null;
    if (!tableData.data) {
      return null;
    }
    return new Pivot(tableData.data, rowsToPivot, colsToPivot, aggregationDimension, aggregator);
  }, [aggregationDimension, colsToPivot, rowsToPivot, tableData]);

  return (
    <Container className="overflow-y-scroll h-auto" title={props.title} results={props.tableData}>
      {!tableData?.isLoading &&
        tableData.data &&
        pivot.data &&
        ((rowsToPivot && rowsToPivot.length > 2) || (colsToPivot && colsToPivot.length > 3) ? (
          <div className="h-full flex items-center justify-center font-embeddable text-sm">
            <FileWarningIcon />
            <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">
              {`The maximum number of rows is 2 and columns is 3. Please reduce the number of rows or columns`}
            </div>
          </div>
        ) : (
          <div className="grow flex flex-col justify-start w-full overflow-x-auto font-embeddable text-sm">
            <PivotTable data={pivot.data} rowsToPivot={rowsToPivot} colsToPivot={colsToPivot} />
          </div>
        ))}
    </Container>
  );
};

const fillDuplicates = (arr1: any[], arr2?: any[]) => {
  let seen: any = {};
  if (!arr2) {
    const processedFirstHeader = arr1.map((header) => {
      if (seen[header]) {
        return '';
      } else {
        seen[header] = true;
        return header;
      }
    });

    return processedFirstHeader;
  }

  const processedSecondHeader = arr2.map((header, idx) => {
    if (!!header) {
      seen = {};
    }
    if (seen[arr1[idx]]) {
      return '';
    } else {
      seen[arr1[idx]] = true;
      return arr1[idx];
    }
  });

  return processedSecondHeader;
};

const PivotTable = ({ data, rowsToPivot, colsToPivot }: any) => {
  const { table } = data;

  const rows = table.filter((row: any) => row.type === 'data' || row.type === 'rowHeader');

  const headers = useMemo(() => {
    const headersCount = colsToPivot?.length;

    if (headersCount === 1) {
      const firstLevelHeaders = [
        ...new Set(
          table
            .filter((row: any) => row.depth === 0 && row.type === 'colHeader')
            .map((row: any) => row.value)
        )
      ];

      return firstLevelHeaders;
    }

    if (headersCount === 2) {
      const firstLevelHeaders: any = [
        ...new Set(
          table
            .filter((row: any) => row.depth === 0 && row.type === 'colHeader')
            .map((row: any) => row.value)
        )
      ];

      const secondLevelHeaders = [
        ...new Set(
          table
            .filter((row: any) => row.depth === 1 && row.type === 'colHeader')
            .map((row: any) => row.value)
        )
      ];

      const firstLevelWithoutDuplicates = fillDuplicates(firstLevelHeaders[0]);

      return [firstLevelWithoutDuplicates, secondLevelHeaders[0]];
    }

    if (headersCount === 3) {
      const firstLevelHeaders: any = [
        ...new Set(
          table
            .filter((row: any) => row.depth === 0 && row.type === 'colHeader')
            .map((row: any) => row.value)
        )
      ];

      const secondLevelHeaders: any = [
        ...new Set(
          table
            .filter((row: any) => row.depth === 1 && row.type === 'colHeader')
            .map((row: any) => row.value)
        )
      ];

      const thirdLevelHeaders = [
        ...new Set(
          table
            .filter((row: any) => row.depth === 2 && row.type === 'colHeader')
            .map((row: any) => row.value)
        )
      ];

      const firstLevelWithoutDuplicates = fillDuplicates(firstLevelHeaders[0]);

      const secondLevelWithoutDuplicates = fillDuplicates(
        secondLevelHeaders[0],
        firstLevelWithoutDuplicates
      );

      return [firstLevelWithoutDuplicates, secondLevelWithoutDuplicates, thirdLevelHeaders[0]];
    } else {
      return [];
    }
  }, [colsToPivot?.length, table]);

  return (
    <div>
      <table>
        <thead className="last:border-t-0">
          {headers.map((header: any, index: number) => {
            return (
              <tr className="flex flex-row border-b first:border-t border-[#B8BDC6] " key={index}>
                {rowsToPivot &&
                  rowsToPivot.map((value: any, idx: any) => (
                    <td
                      rowSpan={rowsToPivot?.length}
                      key={`${value}-${idx}`}
                      className="bg-white text-[#333942] hover:text-black font-bold text-sm select-none cursor-pointer text-[#333942] p-3 !w-[100px] block text-ellipsis overflow-hidden whitespace-nowrap"
                    >
                      {index === colsToPivot?.length - 1 ? value : ''}
                    </td>
                  ))}
                {header.slice(1).map((row: any, idx: any) => (
                  <>
                    <td
                      key={idx}
                      className="bg-white text-[#333942] hover:text-black font-bold text-sm select-none cursor-pointer text-[#333942] p-3 !w-[100px] block text-ellipsis overflow-hidden"
                    >
                      <span className="text-overflow-dynamic-container">
                        <span className="text-overflow-dynamic-ellipsis"> {row}</span>
                      </span>
                    </td>
                  </>
                ))}
              </tr>
            );
          })}
        </thead>
        <tbody>
          {rows.map((row: any, index: any) => (
            <tr key={index} className="flex flex-row hover:bg-gray-400/5">
              {row.value.map((value: any, idx: any) => (
                <td
                  colSpan={idx === 0 && rowsToPivot?.length ? rowsToPivot?.length : 1}
                  className={` text-sm text-dark p-3 text-wrap ${
                    row.type === 'rowHeader' ? 'font-bold' : ''
                  } ${idx === 0 && rowsToPivot?.length > 1 ? 'w-[200px]' : 'w-[100px]'}
                  ${idx === 0 && rowsToPivot?.length === 2 && row.type === 'data' && 'pl-[114px]'}

                `}
                  key={idx}
                >
                  <span
                    className={classNames('text-overflow-dynamic-container w-[100px]', {
                      'w-[80px]': row.type === 'rowHeader' && idx === 0
                    })}
                  >
                    <span className="text-overflow-dynamic-ellipsis">{value}</span>
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
