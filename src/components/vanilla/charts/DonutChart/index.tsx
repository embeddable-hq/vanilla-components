import Chart from 'react-apexcharts';
import { DataResponse } from '@embeddable.com/react';
import { Dimension, Measure } from '@embeddable.com/core';
import React, { useMemo, useRef, useEffect } from 'react';

import useFont from '../../../hooks/useFont';
import useResize from '../../../hooks/useResize';
import { COLORS, DEFAULT_FONT } from '../../../constants';

import '../../index.css';
import Title from '../../Title';
import Spinner from '../../Spinner';
import { WarningIcon } from '../../icons';

type Props = {
  title?: string;
  donut: DataResponse;
  metric?: Measure;
  segments: Dimension;
  showPercentages?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  maxSegments?: number;
};

export default (props: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, height] = useResize(ref);

  useFont();

  useEffect(() => {
    console.log('DonutChart props', props);
  }, [props]);

  const { labels, series } = useMemo(() => {
    const labels =
      props.donut.data
        ?.sort((a, b) => b[props.metric?.name || ''] - a[props.metric?.name || ''])
        .map((record) => record[props.segments.name]) || [];

    const series =
      props.donut.data
        ?.sort((a, b) => b[props.metric?.name || ''] - a[props.metric?.name || ''])
        .map((record) => parseInt(`${record[props.metric?.name || '']}`, 10)) || [];

    const length = props.donut.data?.length || 0;

    const maxLength = props.maxSegments || length;

    if (length <= maxLength) return { labels, series };

    return {
      labels: labels.reduce((memo, label, i) => {
        if (i >= maxLength) return memo;

        memo.push(i < maxLength - 1 ? label : 'Other');

        return memo;
      }, []),
      series: series.reduce((memo: number[], s, i) => {
        if (i < maxLength - 1) {
          memo.push(s);
          return memo;
        }

        memo[maxLength - 1] = memo[maxLength - 1] || 0;

        memo[maxLength - 1] += s;

        return memo;
      }, [])
    };
  }, [props]);

  if (props.donut?.error) {
    return (
      <div className="h-full flex items-center justify-center">
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{props.donut?.error}</div>
      </div>
    );
  }

  return (
    <div className={`h-full relative ${props.title ? 'pt-6' : ''}`}>
      <Title absolute title={props.title} />
      <div className="h-full relative" ref={ref}>
        <Chart
          className="donut-chart"
          options={{
            colors: COLORS,
            chart: {
              type: 'donut',
              parentHeightOffset: 0,
              fontFamily: DEFAULT_FONT
            },
            grid: {
              show: true,
              padding: { left: 0, right: 0, top: 0, bottom: 0 }
            },
            tooltip: {
              custom: ({ series, seriesIndex, w }) => {
                const left = w.globals.clientX - 50;
                const top = w.globals.clientY - 120;
                const color = w.config.colors[seriesIndex];
                const label = labels[seriesIndex] || '';
                const value = props.showPercentages
                  ? `${Math.round(
                      (100 * series[seriesIndex]) / series.reduce((t, n) => t + n, 0)
                    )}%`
                  : series[seriesIndex];
                const offsets = w.globals.dom.baseEl.getBoundingClientRect();

                return `<div style="left: ${left - offsets.left}px; top: ${
                  top - offsets.top
                }px;" class="chart-tooltip">
                <strong>${props.metric?.title || ''}: ${value}</strong>
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
              ...(props.showPercentages
                ? {}
                : {
                    formatter: (val, props) => props.w.config.series[props.seriesIndex]
                  })
            },
            plotOptions: {
              pie: {
                donut: {
                  size: '45%'
                }
              }
            }
          }}
          height="100%"
          width={width}
          series={series}
          type="donut"
        />

        {props.donut?.isLoading && !props.donut?.data?.length && (
          <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
        )}
        <Spinner show={props.donut?.isLoading} />
      </div>
    </div>
  );
};
