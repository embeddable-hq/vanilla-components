import React, { useMemo } from 'react';
import Container from '../../Container';

type Props = {
  // title: string;
  // body: string;
};

export default (props: Props) => {
  const { results, rowValues, columnValues, metric, title } = props;
  const { data, isLoading } = results;

  if (results.isLoading) return;

  const { pivotedData, columnsRef, rowsRef } = useMemo(() => chartData(props), [props]);

  return (
    <Container title={title} className="overflow-auto">
      <table className="border-table min-w-full">
        <thead className="">
          <tr className="">
            <th className="bg-white select-none text-[#333942] p-2 sticky top-0"></th>
            <th
              className="bg-white select-none text-[#333942] p-2 sticky top-0"
              colSpan={columnsRef?.uniqueValues.length}>
              <div className="text-left">{columnValues?.title}</div>
            </th>
          </tr>
          <tr className="">
            <th className={`bg-white select-none text-[#333942] p-2 sticky top-[37px]`}>
              <div className="text-left">{rowValues?.title}</div>
            </th>
            {columnsRef?.uniqueValues.map((header, index) => (
              <th key={index} className={`bg-white select-none text-[#333942] p-2 sticky top-[37px]`}>
                <div className="text-left">{header || "NULL"}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
            {pivotedData?.map((row, index) => {
              return (
                <tr key={index} className="hover:bg-gray-400/5">
                  <td className="bg-white text-sm text-dark p-2">
                    <div><b>{rowsRef.uniqueValues[index]}</b></div>
                  </td>
                  {row.map((value, i) => (
                    <td key={i} className="text-sm text-dark p-2">
                      <div className="text-right">{value}</div>
                    </td>
                  ))}
              </tr>
              )
            })}
          
        </tbody>
      </table>
    </Container>
  )
};

function chartData(props: Props) {

  const { results, rowValues, columnValues, metric } = props;
  const { data } = results;

  //create an array of the unique values for the dimension columns from the result set and populate a reference object showing the index of each unique value in that array
  const headerRef = (data, dimension): { uniqueValues: string[], indexes: { [key: string]: number } } => {
    const uniqueValues = [];
    const indexes = {};
    data.forEach(item => {
      const value = item[dimension.name];
      if (!(value in indexes)) {
        indexes[value] = uniqueValues.length;
        uniqueValues.push(value);
      }
    });
    return { uniqueValues, indexes };
  }
  const rowsRef = headerRef(data, rowValues);
  const columnsRef = headerRef(data, columnValues);

  //Create an array of arrays for the pivoted table data, prefilling with 0s.
  const pivotedData = Array.from({ length: rowsRef.uniqueValues.length }, () =>
    Array(columnsRef.uniqueValues.length).fill(0)
  );

  //populate pivotedData with the actual data from the result set.
  data.forEach((item) => {
    const rowIndex = rowsRef.indexes[item[rowValues.name]];
    const columnIndex = columnsRef.indexes[item[columnValues.name]];
    pivotedData[rowIndex][columnIndex] = item[metric.name];
  })

  return {
    pivotedData: pivotedData,
    columnsRef: columnsRef,
    rowsRef: rowsRef
  }
}