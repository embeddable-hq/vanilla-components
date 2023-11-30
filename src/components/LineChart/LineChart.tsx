import Chart from 'react-apexcharts';
import React, { useMemo, useRef } from 'react';

import useResize from '../../hooks/useResize';

import '../index.css';

type Data = {
  error?: string;
  isLoading: boolean;
  data?: any[];
};

type DimensionOrMeasure = {
  name: string;
  title: string;
  description: string | null;
};

type Props = {
  title: string;
  columns: Data;
  count: DimensionOrMeasure;
  groupingA: DimensionOrMeasure;
  groupingB: DimensionOrMeasure;
  showLabels?: boolean;
  showLegend?: boolean;
};

export default (props: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, height] = useResize(ref);

  const { labels, series } = useMemo(() => {
    console.log(props);

    return {
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      series: [
        {
          name: 'Desktops',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ]
    };
  }, [props]);

  return (
    <div className="h-full">
      {!!props.title && (
        <h2 className="text-[#333942] text-[14px] font-bold justify-start flex mb-8">
          {props.title}
        </h2>
      )}
      <div className="relative h-full" ref={ref}>
        <Chart
          className="line-chart"
          height={!!props.title ? height - 25 : height}
          options={{
            colors: [
              '#2859C5',
              '#F58D02',
              '#964FD2',
              '#FF6B6C',
              '#B8B8D1',
              '#FFC145',
              '#4473D9',
              '#FDA32B',
              '#AF79DD',
              '#FF9E9F',
              '#D7D7E5',
              '#FFD37A'
            ],
            chart: {
              type: 'line',
              toolbar: {
                show: false
              },
              zoom: {
                enabled: false
              }
            },
            xaxis: {
              min: 0
            },
            yaxis: {
              tickAmount: 5
            },
            tooltip: {
              custom: ({ series, seriesIndex, w }) => {
                const color = w.config.colors[seriesIndex];
                // const label = props.columns.data
                //   ? props.columns.data[seriesIndex][props.groupingA.name]
                //   : '';
                // const value = series[seriesIndex];

                return `<div class="chart-tooltip">
                <strong>${props.count.title}: ${'value'}</strong>
                <div><b style="background-color:${color}"></b>${'label'}</div>
              </div>`;
              },
              style: {
                fontSize: '9px'
              }
            },
            labels,
            legend: {
              show: !!props.showLegend,
              position: 'bottom',
              markers: {
                radius: 100
              },
              itemMargin: {
                horizontal: 10,
                vertical: 10
              }
            },
            dataLabels: {
              enabled: !!props.showLabels,
              dropShadow: { enabled: false },
              background: {
                enabled: true,
                borderRadius: 10,
                padding: 4
              },
              style: {}
            },
            stroke: {
              show: true,
              width: 3,
              curve: 'smooth'
            },
            plotOptions: {
              bar: {
                borderRadius: 5,
                columnWidth: 22,

              }
            }
          }}
          series={series}
          type="line"
        />
        {props.columns?.isLoading && (
          <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
        )}
      </div>
    </div>
  );
};
