import Chart from 'react-apexcharts';
import React, { useEffect, useMemo, useRef } from 'react';

import useFont from '../../hooks/useFont';
import useResize from '../../hooks/useResize';

import '../index.css';

type Data = {
  error?: string;
  isLoading: boolean;
  data?: { [key: string]: number | string }[];
};

type DimensionOrMeasure = {
  name: string;
  title: string;
  description: string | null;
};

type Props = {
  title?: string;
  columns: Data;
  count: DimensionOrMeasure;
  groupingA: DimensionOrMeasure;
  groupingB?: DimensionOrMeasure;
  xAxisTitle?: string;
  yAxisTitle?: string;
  showLabels?: boolean;
  showLegend?: boolean;
};

export default (props: Props) => {
  const font = useFont();
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, height] = useResize(ref);

  useEffect(
    () => font.load({ Futura: 'futura-medium-bt.ttf', 'Space Mono': 'space-mono-bold.ttf' }),
    []
  );

  const { labels, series } = useMemo(() => {
    type Memo = {
      labels: string[];
      grouped: { [a: string]: { [b: string]: number } };
    };

    if (!props.columns?.data || !props.count?.name || !props.groupingA?.name) {
      return { labels: [], series: [] };
    }

    const { grouped, labels } = props.columns.data.reduce(
      (memo: Memo, record) => {
        const groupA = record[props.groupingA?.name || ''] as string;
        const groupB = record[props.groupingB?.name || ''] || 'default';

        if (!groupA || !groupB) return memo;

        memo.grouped[groupB] = memo.grouped[groupB] || {};

        memo.grouped[groupB][groupA] = record[props.count.name] as number;

        if (!memo.labels.includes(groupA)) memo.labels.push(groupA);

        return memo;
      },
      { labels: [], grouped: {} }
    );

    const series = Object.keys(grouped).map((name) => ({
      name,
      data: labels.map((label) => grouped[name][label] || 0)
    }));

    return { labels, series };
  }, [props]);

  return (
    <div className="h-full">
      {!!props.title && (
        <h2 className="text-[#333942] text-[14px] font-bold justify-start flex mb-8">
          {props.title}
        </h2>
      )}
      <div className="h-full relative flex grow" ref={ref}>
        <Chart
          className="column-chart"
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
              type: 'bar',
              toolbar: {
                show: false
              }
            },
            yaxis: {
              title: { text: props.yAxisTitle, style: { color: '#333942' } }
            },
            xaxis: {
              min: 0,
              title: { text: props.xAxisTitle, style: { color: '#333942' } }
            },
            tooltip: {
              custom: (opt) => {
                const color = opt.w.config.colors[opt.seriesIndex];
                const label = series[opt.seriesIndex]?.name || '';
                const value = opt.series[opt.seriesIndex][opt.dataPointIndex];

                return `<div class="chart-tooltip">
                  <strong>${props.count.title}: ${value}</strong>
                  <div><b style="background-color:${color}"></b>${label}</div>
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
              offsetY: -20
            },
            stroke: {
              show: true,
              width: 7,
              colors: ['transparent']
            },
            plotOptions: {
              bar: {
                borderRadius: 5,
                columnWidth: 22,
                dataLabels: {
                  position: 'top'
                }
              }
            }
          }}
          height={!!props.title ? height - 30 : height}
          width={width}
          series={series}
          type="bar"
        />
        {props.columns?.isLoading && (
          <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
        )}
      </div>
    </div>
  );
};
