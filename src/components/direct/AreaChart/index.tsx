import { Dimension, Granularity, Measure, TimeRange } from '@embeddable.com/core';
import { DataResponse } from '@embeddable.com/react';
import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from 'chart.js';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { format, parseJSON } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { EMB_FONT } from '../../constants';
import useFont from '../../hooks/useFont';
import Spinner from '../../vanilla/Spinner';
import { WarningIcon } from '../../vanilla/icons';
import '../../vanilla/index.css';

// DARK MODE
// if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
//   Chart.defaults.borderColor = '#3B3B3B';
//   Chart.defaults.color = '#BDBDBD';
// }

Chart.defaults.font.family = EMB_FONT;

Chart.defaults.font.size = 11;

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

type Stats = {
  max: number;
  currentData: { x: Date; y: number }[];
  previousData: { x: Date; y: number }[];
};

type Props = {
  title?: string;
  granularity: Granularity;
  filterDimension: Dimension;
  metrics: Measure[];
  filterValue: TimeRange;
  previousFilterValue: TimeRange;
  current: DataResponse;
  previous: DataResponse;
};

const formatter = new Intl.NumberFormat();

export default (props: Props) => {
  const [activeMetricIndex, setActiveMetricIndex] = useState(0);

  const bounds = useMemo(() => {
    const from = props.filterValue?.from;
    const to = props.filterValue?.to;
    const prevFrom = props.previousFilterValue.from;
    const prevTo = props.previousFilterValue.to;

    return { from, to, prevFrom, prevTo };
  }, [props]);

  const stats = useMemo(
    () =>
      props.metrics.reduce((stats: { [m: string]: Stats }, metric) => {
        stats[metric.name] = stats[metric.name] || { max: 0, currentSum: 0, previousSum: 0 };

        stats[metric.name].currentData =
          props.current?.data?.map((d) => {
            const y = parseFloat(d[metric.name] || '0');

            if (y > stats[metric.name].max) stats[metric.name].max = y;

            return { x: parseJSON(d[props.filterDimension?.name]), y };
          }) || [];

        stats[metric.name].previousData =
          props.previous?.data?.map((d) => {
            const y = parseFloat(d[metric.name] || '0');

            if (y > stats[metric.name].max) stats[metric.name].max = y;

            return { x: parseJSON(d[props.filterDimension?.name]), y };
          }, []) || [];

        return stats;
      }, {}),
    [props]
  );

  useFont();

  const noData =
    !props.current?.isLoading &&
    !props.current?.data?.length &&
    !props.previous?.isLoading &&
    !props.previous?.data?.length;

  if (props.current?.error || props.previous?.error || noData) {
    return (
      <div
        className={`h-full flex items-center justify-center font-embeddable text-sm dark:text-[#ccc] text-[#333942]`}
      >
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">
          {props.current?.error || props.previous?.error || 'No data'}
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full relative font-embeddable text-sm flex flex-col w-full px-3`}>
      <div className="h-20 flex space-x-4 px-1 relative z-10 ml-5">
        {props.metrics.map((m, index) => {
          const currentSum =
            props.current?.data?.reduce((n: number, r) => n + parseFloat(r?.[m.name]), 0) || 0;
          const previousSum =
            props.previous?.data?.reduce((n: number, r) => n + parseFloat(r?.[m.name]), 0) || 0;
          const diff = currentSum - previousSum;

          return (
            <div
              onClick={() => setActiveMetricIndex(index)}
              className={`flex flex-col border-b ${
                activeMetricIndex === index
                  ? 'border-black dark:border-white'
                  : 'border-transparent'
              } justify-center cursor-pointer group`}
            >
              <label className="text-[#444] dark:text-[#BDBDBD] text-[11.5px]">
                {m.title || m.name}{' '}
                <span
                  className={`${
                    diff < 0
                      ? 'bg-[#ff47471a] text-[#ff0000] dark:bg-[#ff474733] dark:text-[#ff5656]'
                      : 'bg-[#259d4d1a] text-[#007A41] dark:bg-[#259D4D33] dark:text-[#63D489]'
                  } px-[5px] py-[3px] rounded-full`}
                >
                  {diff < 0 ? '' : '+'}
                  {formatter.format(diff)}
                </span>
              </label>
              <strong
                className={`text-[24px] font-medium ${
                  activeMetricIndex === index
                    ? 'text-black dark:text-[#F5F5F5]'
                    : 'text-[#6D6D6D] dark:text-[#A3A3A3]'
                } group-hover:text-black dark:group-hover:text-white leading-relaxed tracking-tighter`}
              >
                {formatter.format(currentSum)}
              </strong>
            </div>
          );
        })}
      </div>
      <div className="relative grow overflow-hidden mt-[-3px]">
        <Line
          height="100%"
          width="100%"
          data={{
            datasets: [
              {
                showLine: !props.current.isLoading,
                xAxisID: 'current',
                cubicInterpolationMode: 'default',
                fill: !props.current.isLoading ? 'start' : false,
                label: getLabel(props.filterValue),
                data: stats[props.metrics[activeMetricIndex]?.name || '']?.currentData || [],
                borderColor: '#146EF5',
                backgroundColor: 'rgba(20, 110, 245, 0.1)',
                spanGaps: false
              },
              {
                showLine: !props.previous.isLoading,
                xAxisID: 'previous',
                cubicInterpolationMode: 'default',
                fill: false,
                label: getLabel(props.previousFilterValue),
                data: stats[props.metrics[activeMetricIndex]?.name || '']?.previousData || [],
                borderColor: '#146EF5',
                borderDash: [3],
                spanGaps: false
              }
            ]
          }}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            elements: {
              point: {
                radius: 0
              }
            },
            scales: {
              current: {
                min: bounds.from?.toJSON(),
                max: bounds.to?.toJSON(),
                grid: {
                  display: false
                },
                ticks: {
                  align: 'start'
                },
                position: 'bottom',
                time: {
                  round: props.granularity,
                  displayFormats: {
                    month: 'MMM',
                    day: 'd MMM',
                    hour: 'HH:mm',
                    minute: 'HH:mm',
                    second: 'HH:mm:ss'
                  },
                  unit: props.granularity
                },
                type: 'time'
              },
              previous: {
                min: bounds.prevFrom?.toJSON(),
                max: bounds.prevTo?.toJSON(),
                grid: {
                  display: false
                },
                ticks: {
                  align: 'start'
                },
                position: 'bottom',
                time: {
                  round: props.granularity,
                  displayFormats: {
                    month: 'MMM',
                    day: 'd MMM',
                    hour: 'HH:mm',
                    minute: 'HH:mm',
                    second: 'HH:mm:ss'
                  },
                  unit: props.granularity
                },
                type: 'time',
                display: false
              },
              y: {
                beginAtZero: true,
                grid: {
                  color:
                    // DARK MODE
                    // window.matchMedia?.('(prefers-color-scheme: dark)').matches ? '#3B3B3B' :
                    'rgba(235, 235, 235, 1)'
                },
                position: 'right',
                border: {
                  display: false
                },
                ticks: {
                  align: 'start',
                  crossAlign: 'near',
                  labelOffset: 5,
                  stepSize: Math.pow(
                    10,
                    Math.floor(
                      Math.log10(stats[props.metrics[activeMetricIndex]?.name || '']?.max || 1)
                    )
                  ),
                  callback: (value) => {
                    if (typeof value === 'string') value = parseFloat(value);

                    if (!value) return null;

                    if (value < 1000) return value;

                    return `${value / 1000}k`;
                  }
                }
              }
            },
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                align: 'start',
                labels: {
                  boxHeight: 0,
                  padding: 10,
                  boxWidth: 16
                }
              },
              tooltip: {
                enabled: false
              }
            }
          }}
        />
      </div>
      {(props.current?.isLoading || props.previous.isLoading) &&
        (!props.current?.data?.length || !props.previous?.data?.length) && (
          <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box overflow-hidden rounded" />
        )}
      <Spinner show={props.current?.isLoading || props.previous?.isLoading} />
    </div>
  );
};

function getLabel(range: TimeRange) {
  if (!range) return '';

  if (range.relativeTimeString) return range.relativeTimeString;

  if (!range.from || !range.to) return '';

  const from = format(new Date(range.from), 'LLL d yyyy');

  const to = format(new Date(range.to), 'LLL d yyyy');

  return `${from} - ${to}`;
}
