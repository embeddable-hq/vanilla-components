/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import '@webdatarocks/webdatarocks/webdatarocks.min.css';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

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
  const [webdatarocks, setWebdatarocks] = useState<any>(null);
  const [showBars, setShowBars] = useState(false);

  const ref: React.RefObject<any> = React.useRef<any>(null);

  useEffect(() => {
    const loadDynamic = async () => {
      const { Pivot } = await import('@webdatarocks/react-webdatarocks');
      setWebdatarocks({ Pivot });
    };
    loadDynamic();
  }, []);

  useEffect(() => {
    if (!tableData?.data) return;
    const pivot = ref.current?.webdatarocks;
    if (!pivot) return;

    if (!showBars) {
      pivot.customizeCell(function (cell: any, data: any) {
        if (
          data &&
          data.hierarchy &&
          data.hierarchy.uniqueName == 'orders.count' &&
          data.type == 'value'
        ) {
          return cell.text;
        }
      });
    } else {
      pivot.customizeCell(function (cell: any, data: any) {
        pivot.getData({}, (allData: any) => {
          const columnCaption =
            data && data.columns && data.columns[0] && data?.columns[0]?.caption;

          const allValuesToColumnCaption = allData.data.filter(
            (row: any) => row['c0'] === columnCaption && !!row['r0'] && !!row['v0']
          );

          const maxValueObject: any = _.maxBy(allValuesToColumnCaption, 'v0');

          const cellValue = parseInt(cell.text || 0);
          const maxValue = maxValueObject?.v0 || 0;

          // Calculate the bar length as a percentage of the column's max value
          const barLength = (cellValue / maxValue) * 100;

          if (
            data &&
            data.hierarchy &&
            data.hierarchy.uniqueName == 'orders.count' &&
            data.type == 'value'
          ) {
            const html = `<div style="display: flex; flex-direction: row; align-items: center">
                            <div style="width: 50%; background-color: #fff; border-radius: 0px; position:relative; display: flex; flex-direction: row; align-items: center">
                              <div style="width: ${barLength}%; background-color: #2b6cb0; color: #f7fafc; text-align: center; height: 20px; border-radius: 0px;">
                              </div>
                                 <p style="padding: 0 0 0 2px">${cell.text || 0}</p>
                            </div>
                          
                          </div>`;
            return (cell.text = cell.text ? html : '0');
          }
        });
      });
    }
  }, [tableData, showBars]);

  // useEffect(() => {
  //   if (!tableData?.data) return;
  //   const pivot = ref.current?.webdatarocks;
  //   pivot.on('reportcomplete', function () {
  //     pivot.runtimeCustomFormulas = [
  //       {
  //         uniqueName: 'RowSum',
  //         formula: function (row, data) {
  //           let sum = 0;
  //           data.forEach(function (item) {
  //             sum += item[row['RowField']];
  //           });
  //           return sum;
  //         }
  //       }
  //     ];
  //   });

  //   pivot.setReport({
  //     container: '#wdr-component',
  //     dataSource: { data: tableData?.data },
  //     slice: {
  //       rows: rows.map((row) => ({ uniqueName: row.name, caption: row.title })),
  //       columns: columns.map((column) => ({ uniqueName: column.name, caption: column.title })),
  //       measures: measures.map((measure) => ({
  //         uniqueName: measure.name,
  //         aggregation: 'sum',
  //         caption: measure.title
  //       }))
  //     },
  //     options: {
  //       toolbar: false,
  //       showHeaders: false,
  //       configuratorButton: false
  //     }
  //   });
  // }, [columns, measures, rows, tableData?.data]);

  const data = useMemo(() => {
    return {
      container: '#wdr-component',
      dataSource: { data: tableData?.data },
      slice: {
        rows: rows.map((row) => ({ uniqueName: row.name, caption: row.title })),
        columns: columns.map((column) => ({ uniqueName: column.name, caption: column.title })),
        measures: measures.map((measure) => ({
          uniqueName: measure.name,
          aggregation: 'sum',
          caption: measure.title
        }))
      },
      options: {
        toolbar: false,
        showHeaders: false,
        configuratorButton: false,
        grid: {
          showGrandTotals: 'off',
          type: 'classic'
        }
      }
    };
  }, [tableData, rows, columns, measures]);

  const WebDataRocks = webdatarocks?.Pivot;
  console.log('tableData', WebDataRocks);

  return (
    <>
      <Container className="overflow-y-scroll" title={props.title} results={props.tableData}>
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

        {tableData.isLoading === false && (
          <WebDataRocks ref={ref} width="100%" report={data} className=""></WebDataRocks>
        )}
      </Container>
    </>
  );
};
