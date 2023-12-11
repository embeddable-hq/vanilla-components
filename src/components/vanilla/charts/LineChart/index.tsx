import Chart from 'react-apexcharts';
import { format, parseJSON } from 'date-fns';
import { DataResponse } from '@embeddable.com/react';
import React, { useMemo, useRef, useEffect } from 'react';
import { Dimension, Measure } from '@embeddable.com/core';

import useFont from '../../../hooks/useFont';
import useResize from '../../../hooks/useResize';
import { COLORS, DEFAULT_FONT } from '../../../constants';

import '../../index.css';
import Title from '../../Title';
import Spinner from '../../Spinner';
import { WarningIcon } from '../../icons';

const granularityFormats = {
  second: 'hh:mm.ss d MMM',
  minute: 'hh:mm d MMM',
  hour: 'hh:mm d MMM',
  day: 'd MMM',
  week: 'd MMM',
  month: 'LLL yy',
  quarter: 'qqq yy',
  year: 'yy'
};

type Props = {
  title?: string;
  granularity?: string;
  line: DataResponse;
  metrics: Measure[];
  xAxis?: Dimension;
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
    console.log('LineChart props', props);
  }, [props]);

  const { labels, series } = useMemo(() => {
    type Memo = {
      labels: string[];
      grouped: { [a: string]: { [b: string]: number } };
    };

    if (!props.line?.data || !props.metrics?.length || !props.xAxis?.name) {
      return { labels: [], series: [] };
    }

    const { grouped, labels } = props.line.data.reduce(
      (memo: Memo, record) => {
        const date = record[props.xAxis?.name || ''] as string;

        if (!date) return memo;

        props.metrics.forEach((m) => {
          memo.grouped[m.name] = memo.grouped[m.name] || {};

          memo.grouped[m.name][date] = parseInt(`${record[m.name] || 0}`, 10);
        });

        if (!memo.labels.includes(date)) memo.labels.push(date);

        return memo;
      },
      { labels: [], grouped: {} }
    );

    const series = Object.keys(grouped).map((name) => ({
      name: props.metrics.find((m) => m.name === name)?.title || '',
      data: labels.map((label) => grouped[name][label] || 0)
    }));

    return { labels, series };
  }, [props]);

  if (props.line?.error) {
    return (
      <div className="h-full flex items-center justify-center">
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{props.line?.error}</div>
      </div>
    );
  }

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
              fontFamily: DEFAULT_FONT,
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
                formatter: (v) =>
                  `${format(parseJSON(v), granularityFormats[props.granularity || 'day'])}`
              },
              overwriteCategories: labels,
              crosshairs: { show: false }
            },
            yaxis: {
              title: { text: props.yAxisTitle, style: { color: '#333942' } },
              crosshairs: { show: false }
            },
            tooltip: {
              custom: (opt) => {
                const left = opt.w.globals.clientX - 50;
                const top = opt.w.globals.clientY - 120;
                const color = opt.w.config.colors[opt.seriesIndex];
                const label = series[opt.seriesIndex]?.name || '';
                const value = opt.series[opt.seriesIndex][opt.dataPointIndex];
                const offsets = opt.w.globals.dom.baseEl.getBoundingClientRect();

                return `<div style="left: ${left - offsets.left}px; top: ${
                  top - offsets.top
                }px;" class="chart-tooltip">
                  <strong>${value}</strong>
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
              background: { enabled: false },
              offsetY: -6,
              style: { colors: ['##333942'] }
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
