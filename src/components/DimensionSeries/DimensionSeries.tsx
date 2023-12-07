import Chart from 'react-apexcharts';
import { format, parseJSON } from 'date-fns';
import React, { useMemo, useRef } from 'react';

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
  granularity?: string;
  line: Data;
  count: DimensionOrMeasure;
  date: DimensionOrMeasure;
  grouping: DimensionOrMeasure;
  xAxisTitle?: string;
  yAxisTitle?: string;
  showLabels?: boolean;
  showLegend?: boolean;
};

export default (props: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, height] = useResize(ref);

  useFont();

  const { labels, series } = useMemo(() => {
    type Memo = {
      labels: string[];
      grouped: { [a: string]: { [b: string]: number } };
    };

    if (!props.line?.data || !props.count?.name || !props.date?.name) {
      return { labels: [], series: [] };
    }

    const { grouped, labels } = props.line.data.reduce(
      (memo: Memo, record) => {
        const groupA = record[props.date?.name || ''] as string;
        const groupB = record[props.grouping?.name || ''] || 'default';

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
      <Title title={props.title} />
      <div className="relative h-full" ref={ref}>
        <Chart
          className="line-chart"
          height={!!props.title ? height - 30 : height}
          options={{
            colors: COLORS,
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
              type: 'datetime',
              categories: labels,
              title: { text: props.xAxisTitle, style: { color: '#333942' } },
              labels: {
                formatter: (v) => `${format(parseJSON(v), 'P')}`
              }
            },
            yaxis: {
              tickAmount: 5,
              title: { text: props.yAxisTitle, style: { color: '#333942' } }
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
                columnWidth: 22
              }
            }
          }}
          series={series}
          type="line"
        />
        {props.line?.isLoading && !props.line?.data?.length && (
          <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
        )}
        <Spinner show={props.line?.isLoading} />
      </div>
    </div>
  );
};
