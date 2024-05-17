/* eslint-disable no-extra-boolean-cast */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import classNames from 'classnames';
import _ from 'lodash';
import { FileWarningIcon } from 'lucide-react';
import Pivot from 'quick-pivot';
import { useCallback, useMemo, useState } from 'react';

import formatValue from '../../../util/format';
import Container from '../../Container';

export type Props = {
  tableData: DataResponse;
  columns: Dimension[];
  rows: Dimension[];
  measures: Measure;
  title: string;
  maxWidth?: number;
  minWidth?: number;
};

export default (props: Props) => {
  const { columns, tableData, rows, measures, maxWidth, minWidth } = props;
  console.log('props', props);
  const rowsToPivot = rows.map((row) => row.name);
  const colsToPivot = columns.map((row) => row.name);
  const aggregationDimension = measures.name;
  const aggregator = 'sum';
  const rowHeader = rows.map((row) => row.title);

  const pivot = useMemo(() => {
    // if (tableData.isLoading) return null;
    // if (!tableData.data) {
    //   return null;
    // }
    return new Pivot(
      tableData.data,
      rowsToPivot,
      colsToPivot,
      aggregationDimension,
      aggregator,
      rowHeader
    );
  }, [aggregationDimension, colsToPivot, rowsToPivot, tableData, rows, measures, columns]);

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
          <PivotTable
            data={pivot.data}
            rowsToPivot={rowsToPivot}
            colsToPivot={colsToPivot}
            rowsData={rows}
            columnsData={columns}
            measures={measures}
            maxWidth={maxWidth}
            minWidth={minWidth}
          />
        ))}
    </Container>
  );
};

function formatPivotColumn(text: string | number, column: Measure) {
  if (typeof text === 'number' || column.nativeType === 'number') {
    return formatValue(`${text}`, { type: 'number', meta: column?.meta });
  }

  if (text && column.nativeType === 'time') return formatValue(text, 'date');

  return formatValue(text);
}

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
const PivotTable = ({
  data,
  rowsToPivot,
  colsToPivot,
  rowsData,
  columnsData,
  maxWidth = 200,
  minWidth = 100,
  measures
}: any) => {
  const { table: tableData } = data;
  const [showBars, setShowBars] = useState(false);

  const table = useMemo(() => {
    return tableData.map((row: any) => {
      if (row.type === 'colHeader') {
        return { ...row, value: row.value.slice(0, row.value.length - 1) };
      }
      if (row.type === 'data') {
        return { ...row, value: row.value.slice(0, row.value.length - 1) };
      }
      return row;
    });
  }, [tableData]);

  const rows = table?.filter((row: any) => row.type === 'data' || row.type === 'rowHeader');

  const updatedRows = useMemo(() => {
    const deepArr = _.cloneDeep(rows);

    const maxDepth = Math.max(...deepArr.map((row: any) => row.depth));
    console.log('MAX DEPTH', maxDepth);

    if (maxDepth === 0) return deepArr;

    const updated = deepArr.map((row: any) => {
      const { value, depth, type } = row;
      console.log('Before Slice', value);
      if (type === 'rowHeader' && depth === 0) {
        value.splice(depth + 1, 0, ...new Array(maxDepth).fill('').map(() => ''));
        console.log('UPDATED', value);
        return {
          ...row,
          value
        };
      }

      if (type === 'rowHeader' && depth === 1) {
        value.splice(depth + 1, 0, '');
        value.splice(depth - 1, 0, '');
        console.log('UPDATED', value);
        return {
          ...row,
          value
        };
      }

      if (type === 'data') {
        value.splice(0, 0, ...new Array(maxDepth).fill('').map(() => ''));
        console.log('UPDATED', value);
        return {
          ...row,
          value
        };
      }
    });

    return updated;
  }, [rows]);

  const headers = useMemo(() => {
    const headersCount = colsToPivot?.length;
    if (headersCount === 1) {
      const firstLevelHeaders = [
        ...new Set(
          table
            ?.filter((row: any) => row.depth === 0 && row.type === 'colHeader')
            .map((row: any) => row.value)
        )
      ];
      return firstLevelHeaders;
    }
    if (headersCount === 2) {
      const firstLevelHeaders: any = [
        ...new Set(
          table
            ?.filter((row: any) => row.depth === 0 && row.type === 'colHeader')
            .map((row: any) => row.value)
        )
      ];
      const secondLevelHeaders = [
        ...new Set(
          table
            ?.filter((row: any) => row.depth === 1 && row.type === 'colHeader')
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
            ?.filter((row: any) => row.depth === 0 && row.type === 'colHeader')
            .map((row: any) => row.value)
        )
      ];
      const secondLevelHeaders: any = [
        ...new Set(
          table
            ?.filter((row: any) => row.depth === 1 && row.type === 'colHeader')
            .map((row: any) => row.value)
        )
      ];
      const thirdLevelHeaders = [
        ...new Set(
          table
            ?.filter((row: any) => row.depth === 2 && row.type === 'colHeader')
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

  const rowsDataName = useCallback(
    (name: string) => {
      return rowsData?.find((row: any) => row.name === name)?.title || name;
    },
    [rowsData]
  );

  const maxForEachCol = useMemo(() => {
    const obj: any = {};
    let arr = [];
    for (let i = 0; i < rows.length; i++) {
      for (let j = 1; j < rows[i].value.length; j++) {
        arr.push(rows[i].value[j]);
        if (j === rows[i].value.length - 1) {
          const maxOfArr = _.max(arr);
          obj[i] = maxOfArr;
          arr = [];
        }
      }
    }
    return obj;
  }, [rows]);

  console.log('MAX FOR EACH COL', maxForEachCol);

  return (
    <div>
      <div className="flex flex-row w-full justify-end items-center pb-2 px-5">
        <label className="switch">
          <input
            checked={showBars}
            type="checkbox"
            onChange={(e) => {
              setShowBars(e.target.checked);
            }}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <table>
        <thead className="last:border-t-0 sticky top-0 z-50">
          {headers.map((header: any, index: number) => {
            return (
              <tr className="flex flex-row border-b  first:border-t border-[#B8BDC6] " key={index}>
                {rowsToPivot &&
                  rowsToPivot.map((value: any, idx: any) => (
                    <td
                      style={{ minWidth: minWidth, maxWidth: maxWidth }}
                      rowSpan={rowsToPivot?.length}
                      key={`${value}-${idx}`}
                      className="bg-white  hover:text-black font-bold text-sm select-none  text-[#333942] p-3  block"
                    >
                      {index === colsToPivot?.length - 1 ? rowsDataName(value) : ''}
                    </td>
                  ))}
                {header.slice(1).map((row: any, idx: any) => (
                  <td
                    style={{ minWidth: minWidth, maxWidth: maxWidth }}
                    key={idx}
                    className="bg-white  hover:text-black font-bold text-sm select-none  text-[#333942] p-3  block"
                  >
                    {row}
                  </td>
                ))}
              </tr>
            );
          })}
        </thead>
        <tbody>
          {updatedRows.map((row: any, index: any) => (
            <tr key={index} className="flex flex-row">
              {row.value.map((value: any, idx: any) => (
                <td
                  style={{ minWidth: minWidth, maxWidth: maxWidth }}
                  colSpan={idx === 0 && rowsToPivot?.length ? rowsToPivot?.length : 1}
                  className={`text-wrap text-sm text-dark p-3 ${
                    row.type === 'rowHeader' ? 'font-bold' : ''
                  }

            ${!!!value && idx > 1 && 'bg-[#FAFAFA]'}
            `}
                  key={idx}
                >
                  {showBars ? (
                    idx === 0 ? (
                      <span className={classNames('w-[100px]')}>
                        <span className="">{value}</span>
                      </span>
                    ) : (
                      row.type === 'data' && (
                        <div className="flex items-center gap-x-1 whitespace-nowrap">
                          <div
                            className="flex w-full bg-transparent gap-x-1 items-center overflow-hidden"
                            role="progressbar"
                          >
                            <div
                              className="flex flex-row h-2 justify-center overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500"
                              style={{ width: `${(value / maxForEachCol[index]) * 100}%` }}
                            ></div>
                            <div className="">
                              <span>{value}</span>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <span className="text-overflow-dynamic-container">
                      <span className="text-overflow-dynamic-ellipsis">
                        {formatPivotColumn(value, measures?.nativeType)}
                      </span>
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
