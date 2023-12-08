import Chart from 'react-apexcharts';
import React, { useEffect, useMemo, useRef } from 'react';

import { COLORS } from '../../constants';
import useFont from '../../hooks/useFont';
import useResize from '../../hooks/useResize';

import '../index.css';
import Spinner from '../Spinner';
import Title from '../Title';

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
  title?: string;
  donut: Data;
  metric?: DimensionOrMeasure;
  groups: DimensionOrMeasure;
  showPercentages?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  maxGroups?: number;
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
        .map((record) => record[props.groups.name]) || [];

    const series =
      props.donut.data
        ?.sort((a, b) => b[props.metric?.name || ''] - a[props.metric?.name || ''])
        .map((record) => parseInt(`${record[props.metric?.name || '']}`, 10)) || [];

    const length = props.donut.data?.length || 0;

    const maxLength = props.maxGroups || length;

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

  return (
    <div className="h-full">
      <Title title={props.title} />
      <div className="h-full relative" ref={ref}>
        <Chart
          className="donut-chart"
          options={{
            colors: COLORS,
            chart: {
              type: 'donut'
            },
            tooltip: {
              custom: ({ series, seriesIndex, w }) => {
                const color = w.config.colors[seriesIndex];
                const label = labels[seriesIndex] || '';
                const value = props.showPercentages
                  ? `${Math.round(
                    (100 * series[seriesIndex]) / series.reduce((t, n) => t + n, 0)
                  )}%`
                  : series[seriesIndex];

                return `<div class="chart-tooltip">
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
              style: {}
            },
            plotOptions: {
              pie: {
                donut: {
                  size: '45%'
                }
              }
            }
          }}
          height={!!props.title ? height - 30 : height}
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
