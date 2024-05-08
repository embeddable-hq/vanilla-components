/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import Pivot from 'quick-pivot';

import Container from '../../Container';

export type Props = {
  tableData: DataResponse;
  columns: Dimension[];
  rows: Dimension[];
  measures: Measure[];
  title: string;
};

export default (props: Props) => {
  const { columns, tableData, rows, measures } = props;

  const rowsToPivot = rows.map((row) => row.name);
  const colsToPivot = columns.map((row) => row.name);
  const aggregationDimension = measures[0].name;
  const aggregator = 'sum';

  const pivot = new Pivot(
    tableData.data,
    rowsToPivot,
    colsToPivot,
    aggregationDimension,
    aggregator
  );

  console.log('pivot', pivot);
  console.log('pivot options', rowsToPivot, colsToPivot, aggregationDimension, aggregator);

  return (
    <Container className="overflow-y-scroll h-auto" title={props.title} results={props.tableData}>
      {tableData.data && pivot.data && (
        <div className="max-w-7xl mx-auto overflow-auto mt-10">
          <PivotTable data={pivot.data} />
        </div>
      )}
    </Container>
  );
};

const PivotTable = ({ data }: any) => {
  const { table } = data;

  const rows = table.filter((row: any) => row.type === 'data' || row.type === 'rowHeader');

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

  console.log('firstLevelHeaders', firstLevelHeaders);
  console.log('secondLevelHeaders', secondLevelHeaders);

  return (
    <div>
      <table>
        <thead className="last:border-t-0">
          <div className="flex flex-row border-y border-[#B8BDC6] ">
            {firstLevelHeaders &&
              firstLevelHeaders[0] &&
              firstLevelHeaders[0].map((header: any, idx: any) => (
                <p
                  key={header}
                  className="bg-white text-[#333942] hover:text-black font-bold text-sm select-none cursor-pointer text-[#333942] p-3 !w-[200px] block text-ellipsis overflow-hidden whitespace-nowrap"
                >
                  {header}
                </p>
              ))}
          </div>
          <div className="flex flex-row border-b border-[#B8BDC6]">
            {secondLevelHeaders &&
              secondLevelHeaders[0] &&
              secondLevelHeaders[0].map((header: any, index: any) => (
                <p
                  key={`${header}-${index}`}
                  className="bg-white text-[#333942] hover:text-black font-bold text-sm select-none cursor-pointer text-[#333942] p-3 !w-[200px] block text-ellipsis overflow-hidden whitespace-nowrap"
                >
                  {header}
                </p>
              ))}
          </div>
        </thead>
        <tbody>
          {rows?.map((row: any, index: any) => (
            <tr key={`${row}-${index}`} className="hover:bg-gray-400/5">
              <tr key={`${row}-${index}`}>
                {row.value.map((value: any, idx: any) => (
                  <td
                    className={`!w-[200px] text-sm text-dark p-3 ${
                      row.type === 'rowHeader' ? 'bg-gray-200' : ''
                    }`}
                    key={idx}
                  >
                    {value || ''}
                  </td>
                ))}
              </tr>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
