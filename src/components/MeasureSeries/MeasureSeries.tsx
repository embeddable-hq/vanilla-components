import Chart from 'react-apexcharts';
import { format, parseJSON } from 'date-fns';
import React, { useMemo, useRef } from 'react';

import { COLORS } from '../../constants';
import useFont from '../../hooks/useFont';
import useResize from '../../hooks/useResize';

import '../index.css';
import Spinner from '../Spinner';

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
  measures: DimensionOrMeasure[];
  date: DimensionOrMeasure;
  xAxisTitle?: string;
  yAxisTitle?: string;
  showLabels?: boolean;
  showLegend?: boolean;
};

export default (props: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, height] = useResize(ref);

  console.log('measure series props', props);

  useFont();

  const { labels, series } = useMemo(() => {
    type Memo = {
      labels: string[];
      grouped: { [a: string]: { [b: string]: number } };
    };

    if (!props.line?.data || !props.measures?.length || !props.date?.name) {
      return { labels: [], series: [] };
    }

    const { grouped, labels } = props.line.data.reduce(
      (memo: Memo, record) => {
        const date = record[props.date?.name || ''] as string;

        if (!date) return memo;

        props.measures.forEach((m) => {
          memo.grouped[m.name] = memo.grouped[m.name] || {};

          memo.grouped[m.name][date] = parseInt(`${record[m.name] || 0}`, 10);
        });

        if (!memo.labels.includes(date)) memo.labels.push(date);

        return memo;
      },
      { labels: [], grouped: {} }
    );

    const series = Object.keys(grouped).map((name) => ({
      name: props.measures.find((m) => m.name === name)?.title || '',
      data: labels.map((label) => grouped[name][label] || 0)
    }));

    return { labels, series };
  }, [props]);
  console.log('measure series series and labels', series, labels);
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
                // const color = opt.w.config.colors[opt.seriesIndex];
                // const label = series[opt.seriesIndex]?.name || '';
                // const value = opt.series[opt.seriesIndex][opt.dataPointIndex];
                console.log(opt, series, labels);
                return '<div class="chart-tooltip"></div>';

                // return `<div class="chart-tooltip">
                //   <strong>${props.count.title}: ${value}</strong>
                //   <div><b style="background-color:${color}"></b>${label}</div>
                // </div>`;
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
