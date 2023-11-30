import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';

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
  donut: Data;
  count: DimensionOrMeasure;
  groups: DimensionOrMeasure;
  showPercentages?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  maxGroups?: number;
};

export default (props: Props) => {
  const { labels, series } = useMemo(() => {
    const labels =
      props.donut.data
        ?.sort((a, b) => b[props.count.name] - a[props.count.name])
        .map((record) => record[props.groups.name]) || [];

    const series =
      props.donut.data
        ?.sort((a, b) => b[props.count.name] - a[props.count.name])
        .map((record) => record[props.count.name]) || [];

    const length = props.donut.data?.length || 0;

    const maxLength = props.maxGroups || length;

    if (length <= maxLength) return { labels, series };

    return {
      labels: labels.reduce((memo, label, i) => {
        if (i >= maxLength) return memo;

        memo.push(i < maxLength - 1 ? label : 'Other');

        return memo;
      }, []),
      series: series.reduce((memo, s, i) => {
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
    <div>
      {!!props.title && (
        <h2 className="text-[#333942] text-[14px] font-bold justify-start flex mb-8">
          {props.title}
        </h2>
      )}
      <div className="relative">
        <Chart
          className="donut-chart"
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
              type: 'donut'
            },
            tooltip: {
              custom: ({ series, seriesIndex, w }) => {
                const color = w.config.colors[seriesIndex];
                const label = props.donut.data
                  ? props.donut.data[seriesIndex][props.groups.name]
                  : '';
                const value = props.showPercentages
                  ? `${Math.round(
                      (100 * series[seriesIndex]) / series.reduce((t, n) => t + n, 0)
                    )}%`
                  : series[seriesIndex];

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
          series={series}
          type="donut"
        />
        {props.donut?.isLoading && (
          <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
        )}
      </div>
    </div>
  );
};
