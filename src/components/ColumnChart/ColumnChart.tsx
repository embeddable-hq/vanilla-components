import Chart from 'react-apexcharts';
import React, { useMemo, useRef } from 'react';

import { COLORS } from '../../constants';
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
  maxAmountA?: number;
  maxAmountB?: number;
  xAxisTitle?: string;
  yAxisTitle?: string;
  showLabels?: boolean;
  showLegend?: boolean;
};

export default (props: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, height] = useResize(ref);

  useFont();

  const { labels, series, maxCount } = useMemo(() => {
    type Memo = {
      labels: string[];
      grouped: { [a: string]: { [b: string]: number } };
      maxCount: number;
    };

    if (!props.columns?.data || !props.count?.name || !props.groupingA?.name) {
      return { labels: [], series: [], maxCount: 1 };
    }

    type MemoObj = { [dimension: string]: true };

    const dimensions = props.columns.data.reduce(
      (memo: { a: MemoObj; b: MemoObj }, record) => {
        const groupA = record[props.groupingA?.name || ''] as string;
        const groupB = record[props.groupingB?.name || ''] || 'default';

        memo.a[groupA] = true;
        memo.b[groupB] = true;

        return memo;
      },
      { a: {}, b: {} }
    );

    const keysA = Object.keys(dimensions.a);
    const keysB = Object.keys(dimensions.b);

    const maxKeysA = Math.min(props.maxAmountA || 50, 50);
    const maxKeysB = Math.min(props.maxAmountB || 50, 50);

    const { grouped, labels, maxCount } = props.columns.data.reduce(
      (memo: Memo, record) => {
        const groupA = record[props.groupingA?.name || ''] as string;
        const groupB = `${record[props.groupingB?.name || ''] || 'default'}`;

        if (!groupA) return memo;

        const keyA =
          keysA.length > maxKeysA && keysA.indexOf(groupA) >= maxKeysA - 1 ? 'Other' : groupA;

        const keyB =
          keysB.length > maxKeysB && keysB.indexOf(groupB) >= maxKeysB - 1 ? 'Other' : groupB;

        memo.grouped[keyB] = memo.grouped[keyB] || {};

        memo.grouped[keyB][keyA] = memo.grouped[keyB][keyA] || 0;

        memo.grouped[keyB][keyA] += parseInt(`${record[props.count.name]}`, 10) as number;

        if (memo.maxCount < memo.grouped[keyB][keyA]) memo.maxCount = memo.grouped[keyB][keyA];

        if (!memo.labels.includes(keyA)) memo.labels.push(keyA);

        return memo;
      },
      { labels: [], grouped: {}, maxCount: 0 }
    );

    const series = Object.keys(grouped).map((name) => ({
      name,
      data: labels.map((label) => grouped[name][label] || 0)
    }));

    return { labels, series, maxCount };
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
            colors: COLORS,
            chart: {
              type: 'bar',
              toolbar: {
                show: false
              }
            },
            yaxis: {
              title: { text: props.yAxisTitle, style: { color: '#333942' } },
              max: Math.ceil(maxCount + 0.1 * maxCount)
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
