import Chart from 'react-apexcharts';
import { DataResponse } from '@embeddable.com/react';
import { Dimension, Measure } from '@embeddable.com/core';
import React, { useMemo, useRef, useEffect } from 'react';

import useFont from '../../../hooks/useFont';
import useResize from '../../../hooks/useResize';
import { COLORS, EMB_FONT, SMALL_FONT_SIZE } from '../../../constants';

import '../../index.css';
import Title from '../../Title';
import Spinner from '../../Spinner';
import { WarningIcon } from '../../icons';

type Props = {
  title?: string;
  columns: DataResponse;
  metric: Measure;
  xAxis: Dimension;
  secondXAxis?: Dimension;
  maxXAxisItems?: number;
  maxLabels?: number;
  xAxisTitle?: string;
  yAxisTitle?: string;
  showLabels?: boolean;
  showLegend?: boolean;
};

export default (props: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, height] = useResize(ref);

  useFont();

  useEffect(() => {
    console.log('BarChart props', props);
  }, [props]);

  const { labels, series, maxCount } = useMemo(() => {
    type Memo = {
      labels: string[];
      grouped: { [a: string]: { [b: string]: number } };
      maxCount: number;
    };

    if (!props.columns?.data || !props.metric?.name || !props.xAxis?.name) {
      return { labels: [], series: [], maxCount: 1 };
    }

    type MemoObj = { [dimension: string]: true };

    const dimensions = props.columns.data.reduce(
      (memo: { a: MemoObj; b: MemoObj }, record) => {
        const groupA = record[props.xAxis?.name || ''] as string;
        const groupB = record[props.secondXAxis?.name || ''] || 'default';

        memo.a[groupA] = true;
        memo.b[groupB] = true;

        return memo;
      },
      { a: {}, b: {} }
    );

    const keysA = Object.keys(dimensions.a);
    const keysB = Object.keys(dimensions.b);

    const maxKeysA = Math.min(props.maxXAxisItems || 50, 50);
    const maxKeysB = Math.min(props.maxLabels || 50, 50);

    const { grouped, labels, maxCount } = props.columns.data.reduce(
      (memo: Memo, record) => {
        const groupA = record[props.xAxis?.name || ''] as string;
        const groupB = `${record[props.secondXAxis?.name || ''] || 'default'}`;

        if (!groupA) return memo;

        const keyA =
          keysA.length > maxKeysA && keysA.indexOf(groupA) >= maxKeysA - 1 ? 'Other' : groupA;

        const keyB =
          keysB.length > maxKeysB && keysB.indexOf(groupB) >= maxKeysB - 1 ? 'Other' : groupB;

        memo.grouped[keyB] = memo.grouped[keyB] || {};

        memo.grouped[keyB][keyA] = memo.grouped[keyB][keyA] || 0;

        memo.grouped[keyB][keyA] += parseInt(`${record[props.metric.name]}`, 10) as number;

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

  if (props.columns?.error) {
    return (
      <div className="h-full flex items-center justify-center font-embeddable text-sm">
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{props.columns?.error}</div>
      </div>
    );
  }

  return (
    <div className={`h-full relative font-embeddable text-sm ${props.title ? 'pt-6' : ''}`}>
      <Title absolute title={props.title} />
      <div className="h-full relative flex grow" ref={ref}>
        <Chart
          className="bar-chart"
          height="100%"
          options={{
            colors: COLORS,
            chart: {
              type: 'bar',
              toolbar: {
                show: false
              },
              parentHeightOffset: 0,
              fontFamily: EMB_FONT
            },
            grid: {
              show: true,
              padding: { left: 0, right: 0, top: 0, bottom: 0 }
            },
            yaxis: {
              title: { text: props.yAxisTitle, style: { color: '#333942' } },
              tickAmount: Math.min(Math.ceil(height / 100), maxCount),
              crosshairs: { show: false },
              labels: { style: { fontSize: SMALL_FONT_SIZE, colors: ['#959CA8'] } }
            },
            xaxis: {
              min: 0,
              title: { text: props.xAxisTitle, style: { color: '#333942' } },
              crosshairs: { show: false },
              labels: { style: { fontSize: SMALL_FONT_SIZE, colors: ['#959CA8'] } }
            },
            tooltip: {
              custom: (opt) => {
                const left = opt.w.globals.clientX - 50;
                const top = opt.w.globals.clientY - 120;
                const color = opt.w.config.colors[opt.seriesIndex];
                const label = series[opt.seriesIndex]?.name || '';
                const value = opt.series[opt.seriesIndex][opt.dataPointIndex];
                const offsets = opt.w.globals.dom.baseEl.getBoundingClientRect();

                return `<div style="font-size: ${SMALL_FONT_SIZE}; left: ${
                  left - offsets.left
                }px; top: ${top - offsets.top}px;" class="chart-tooltip">
                  <strong>${props.metric.title}: ${value}</strong>
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
              showForSingleSeries: true,
              position: 'bottom',
              markers: {
                radius: 100
              },
              itemMargin: {
                horizontal: 10,
                vertical: 10
              },
              fontSize: SMALL_FONT_SIZE
            },
            dataLabels: {
              enabled: !!props.showLabels,
              dropShadow: { enabled: false },
              style: { fontSize: SMALL_FONT_SIZE }
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
          width={width}
          series={series}
          type="bar"
        />
        {props.columns?.isLoading && !props.columns?.data?.length && (
          <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
        )}
        <Spinner show={props.columns?.isLoading} />
      </div>
    </div>
  );
};
