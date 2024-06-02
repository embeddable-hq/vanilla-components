import React, { useMemo, useState, useEffect } from 'react';
import Container from '../../Container';
import formatValue from '../../../util/format';
import { SortDown, SortUp } from '../../icons';
import ValueBar from './ValueBar';

type Props = {
  // title: string;
  // body: string;
};

export default (props: Props) => {
  const { results, rowValues, columnValues, metric, title, colMinWidth, dps } = props;
  const { data, isLoading, error } = results;

  const [sortOrder, setSortOrder] = useState({clickedIndex: null, columnSortOrders: []});

  const countDimensions = (() => {
    if (rowValues && columnValues) return 2;
    else if (rowValues && !columnValues) return 1;
    else return null;
  })();

  const { tableData, columnsRef, rowsRef, maxValue } = useMemo(() => {
    if(countDimensions === 2 && !error) {
      return build2DData(props, sortOrder)
    } else return { tableData: null, columnsRef: null, rowsRef: null, maxValue: 0 };
  }, [props, countDimensions, error, sortOrder]);

  const headerStyle = {
    minWidth: colMinWidth ? parseInt(colMinWidth) : inherit
  }

  useEffect(() => {
    const objectsArray = Array.from({ length: columnsRef?.uniqueValues?.length + 1 }, (_, i) => ({ sortAsc: false }));
    const newState = {
      clickedIndex: null,
      columnSortOrders: objectsArray
    }
    setSortOrder(newState) 
  }, [columnsRef?.uniqueValues?.length]);

  const handleSortOrder = (index) => {
    setSortOrder(prevSortOrder => ({
      ...prevSortOrder,
      columnSortOrders: prevSortOrder.columnSortOrders.map((order, i) => {
        if (i === index) {
          return {
            ...order,
            sortAsc: prevSortOrder.clickedIndex === index ? !order.sortAsc : order.sortAsc
          };
        }
        return order;
      }),
      clickedIndex: index
    }));
  };

  return (
    <Container
      {...props}
      className="overflow-auto">
      {
        !(results?.isLoading && !results?.data?.length) && (
          (countDimensions === 2)            
            ? build2DTable(props, tableData, columnsRef, rowsRef, headerStyle, handleSortOrder, sortOrder, maxValue)
            : build1DTable(props, headerStyle)
        )
      }
    </Container>
  )
};

function build2DTable(props, tableData, columnsRef, rowsRef, headerStyle, handleSortOrder, sortOrder, maxValue) {

  const { columnValues, rowValues, metric, dps, displayValueBars } = props;

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
          <th
              onClick={() => handleSortOrder(0)}
              style={headerStyle} className={`bg-white select-none text-[#333942] p-2 sticky top-[37px] cursor-pointer`}>
              <div className="w-100 flex items-center">
                <div className="text-left flex grow">{rowValues?.title}</div>
                <div
                  className={`${sortOrder.clickedIndex === 0 ? 'text-[#FF6B6C]' : 'text-[#333942]'}`}>
                  {sortOrder.columnSortOrders[0]?.sortAsc 
                    ? (<SortUp fill="currentcolor" />)
                    : (<SortDown fill="currentcolor" />)
                    }
                </div>
              </div>
            </th>
          {columnsRef?.uniqueValues.map((header, index) => (
            <th
              onClick={() => handleSortOrder(index+1)}
              style={headerStyle} key={index} className={`bg-white select-none text-[#333942] p-2 sticky top-[37px] cursor-pointer`}>
              <div className="w-100 flex items-center">
                <div className="text-left flex grow">{header}</div>
                <div
                  className={`${sortOrder.clickedIndex === (index+1) ? 'text-[#FF6B6C]' : 'text-[#333942]'}`}>
                  {sortOrder.columnSortOrders[index+1]?.sortAsc 
                    ? (<SortUp fill="currentcolor" />)
                    : (<SortDown fill="currentcolor" />)
                    }
                </div>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData?.map((row, index) => {
          return (
            <tr key={index} className="hover:bg-gray-400/5">
              <td className="bg-white text-sm text-dark p-2">
                <div>{row[0]}</div>
              </td>
              {row.filter((_, i) => i > 0).map((value, i) => {
                return (
                  <td key={i} className="text-sm text-dark p-2">
                    <div className="flex items-center gap-[8px]">
                      <ValueBar displayValueBars={displayValueBars} value={value} maxValue={maxValue}/>
                      <div className="text-right">{formatValue(value, { type: "number", meta: metric.meta, dps: dps })}</div>  
                    </div>                
                  </td>)
              })}
          </tr>
          )
        })}      
    </tbody>
  </table>
  )
}
 
function build1DTable(props, headerStyle) {

  const { results, rowValues, metric, dps } = props;

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
            className="bg-white text-sm text-[#333942] p-2 sticky top-0">
            <div className="text-right">{metric?.title}</div>
          </th>
        </tr>
      </thead>
      <tbody>
          {results?.data?.map((row, index) => {
            return (
              <tr key={index} className="hover:bg-gray-400/5">
                <td className="bg-white text-sm text-dark p-2">
                  <div>{row[rowValues?.name]}</div>
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

function build2DData(props: Props, sortOrder) {

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

  //Create an array of arrays for the pivoted table data, prefilling with 0s and including the unique values from the rowsRef.
  const tableData = Array.from({ length: rowsRef.uniqueValues.length }, (_, index) => [
    rowsRef.uniqueValues[index],
    ...Array(columnsRef.uniqueValues.length).fill(0)
  ]);
  
  //used to calculate lenghth of bar
  let maxValue = 0;

  //populate tableData with the actual data from the result set
  data?.forEach((item) => {
    const rowValue = item[rowValues.name];
    const colValue = item[columnValues.name];
    const metricValue = item[metric.name];
    const rowIndex = rowsRef.indexes[rowValue];
    const columnIndex = columnsRef.indexes[colValue]+1;
    tableData[rowIndex][columnIndex] = metricValue;
    if (props.displayValueBars) {
      maxValue = parseFloat(metricValue) > maxValue ? parseFloat(metricValue) : maxValue;
    }    
  })

  const index = sortOrder.clickedIndex;
  const sortAsc = sortOrder.columnSortOrders[index]?.sortAsc;

  const sortedTableData = index === undefined || sortAsc === undefined
    ? tableData
    : [...tableData].sort((a, b) => {      
      const valueA = a[index];
      const valueB = b[index];
      if (!isNaN(parseFloat(valueA)) && !isNaN(parseFloat(valueB))) {
        return sortAsc ? valueA - valueB : valueB - valueA;
      } else {
        return sortAsc
          ? valueA.toString().localeCompare(valueB.toString())
          : valueB.toString().localeCompare(valueA.toString());
      }
  });

  return {
    tableData: sortedTableData,
    columnsRef: columnsRef,
    rowsRef: rowsRef,
    maxValue: maxValue
  }
}