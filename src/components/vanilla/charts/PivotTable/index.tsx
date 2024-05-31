import React, { useMemo } from 'react';
import Container from '../../Container';
import formatValue from '../../../util/format';

type Props = {
  // title: string;
  // body: string;
};

export default (props: Props) => {
  const { results, rowValues, columnValues, metric, title, colMinWidth, dps } = props;
  const { data, isLoading, error } = results;

  const countDimensions = (() => {
    if (rowValues && columnValues) return 2;
    if (rowValues && !columnValues) return 1;
  })();

  const { tableData, columnsRef, rowsRef } = useMemo(() => {
    if(countDimensions === 2 && !error) {
      return build2DData(props)
    } else return { tableData: null, columnsRef: null, rowsRef: null };
  }, [props, countDimensions, error]);

  const headerStyle = {
    minWidth: colMinWidth ? parseInt(colMinWidth) : inherit
  }

  return (
    <Container
      {...props}
      className="overflow-auto">
      {
        !(results?.isLoading && !results?.data?.length) && (
          (countDimensions === 2)            
            ? build2DTable(tableData, columnsRef, columnValues, rowsRef, rowValues, metric, headerStyle, dps)
            : build1DTable(results, rowValues, metric, headerStyle, dps)
        )
      }
    </Container>
  )
};

function build2DTable(tableData, columnsRef, columnValues, rowsRef, rowValues, metric, headerStyle, dps) {
  return (
    <table className="border-table two-d-table min-w-full">
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
          <th style={headerStyle} className={`bg-white select-none text-[#333942] p-2 sticky top-[37px]`}>
            <div className="text-left">{rowValues?.title}</div>
          </th>
          {columnsRef?.uniqueValues.map((header, index) => (
            <th style={headerStyle} key={index} className={`bg-white select-none text-[#333942] p-2 sticky top-[37px]`}>
              <div className="text-left">{header}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData?.map((row, index) => {
          return (
            <tr key={index} className="hover:bg-gray-400/5">
              <td className="bg-white text-sm text-dark p-2">
                <div><b>{rowsRef.uniqueValues[index]}</b></div>
              </td>
              {row.map((value, i) => (
                <td key={i} className="text-sm text-dark p-2">
                  <div className="text-right">{formatValue(value, { type: "number", meta: metric.meta, dps: dps })}</div>
                </td>
              ))}
          </tr>
          )
        })}      
    </tbody>
  </table>
  )
}
 
function build1DTable(results, rowValues, metric, headerStyle, dps) {

  return !(results?.isLoading && !results?.data?.length) && (<table className="border-table min-w-full">
      <thead className="">
        <tr className="">
          <th 
            style={headerStyle}
            className="bg-white select-none text-[#333942] p-2 sticky top-0">
            <div className="text-left">{rowValues?.title}</div>
          </th>
          <th
            style={headerStyle}
            className="bg-white text-sm text-dark p-2 sticky top-0">
            <div className="text-right">{metric?.title}</div>
          </th>
        </tr>
      </thead>
      <tbody>
          {results?.data?.map((row, index) => {
            return (
              <tr key={index} className="hover:bg-gray-400/5">
                <td className="bg-white text-sm text-dark p-2">
                  <div><b>{row[rowValues?.name]}</b></div>
                </td>
                <td className="text-sm text-dark p-2">
                  <div className="text-right">{formatValue(row[metric.name], { type: "number", meta: metric.meta, dps: dps })}</div>
                </td>
            </tr>
            )
          })}        
      </tbody>
    </table>)
}

function build2DData(props: Props) {

  const { results, rowValues, columnValues, metric } = props;
  const { data } = results;

  //create an array of the unique values for the dimension columns from the result set and populate a reference object showing the index of each unique value in that array
  const headerRef = (data, dimension): { uniqueValues: string[], indexes: { [key: string]: number } } => {
    const uniqueValues = [];
    const indexes = {};
    data?.forEach(item => {
      const value = item[dimension.name];
      if (!(value in indexes)) {
        indexes[value] = uniqueValues.length;
        uniqueValues.push(value || "No Value");
      }
    });
    return { uniqueValues, indexes };
  }
  const rowsRef = headerRef(data, rowValues);
  const columnsRef = headerRef(data, columnValues);

  //Create an array of arrays for the pivoted table data, prefilling with 0s.
  const tableData = Array.from({ length: rowsRef.uniqueValues.length }, () =>
    Array(columnsRef.uniqueValues.length).fill(0)
  );

  //populate tableData with the actual data from the result set.
  data?.forEach((item) => {
    const rowIndex = rowsRef.indexes[item[rowValues.name]];
    const columnIndex = columnsRef.indexes[item[columnValues.name]];
    tableData[rowIndex][columnIndex] = item[metric.name];
  })

  return {
    tableData: tableData,
    columnsRef: columnsRef,
    rowsRef: rowsRef
  }
}