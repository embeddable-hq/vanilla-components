import { DataResponse, Dimension, Granularity, Measure } from '@embeddable.com/core';
import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React from 'react';
import { Bar } from 'react-chartjs-2';

import {
  COLORS,
  DATE_DISPLAY_FORMATS,
  EMB_FONT,
  LIGHT_FONT,
  SMALL_FONT_SIZE,
} from '../../../../constants';
import formatValue from '../../../../util/format';
import getBarChartOptions from '../../../../util/getBarChartOptions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels,
);

ChartJS.defaults.font.size = parseInt(SMALL_FONT_SIZE);
ChartJS.defaults.color = LIGHT_FONT;
ChartJS.defaults.font.family = EMB_FONT;
ChartJS.defaults.plugins.tooltip.enabled = true;

type Props = {
  description?: string;
  displayHorizontally?: boolean;
  dps?: number;
  enableDownloadAsCSV?: boolean;
  metrics: Measure[];
  results?: DataResponse;
  reverseXAxis?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  sortBy?: Dimension | Measure;
  stackMetrics?: boolean;
  title?: string;
  xAxis: Dimension;
  xAxisTitle?: string;
  yAxisTitle?: string;
  granularity?: Granularity;
};

export default function BarChart({ ...props }: Props) {
  return (
    <Bar
      height="100%"
      options={getBarChartOptions({ ...props, stacked: false })}
      data={chartData(props)}
    />
  );
}

function chartData(props: Props): ChartData<'bar'> {
  const { results, xAxis, metrics, granularity } = props;

  let dateFormat: string | undefined;
  if (xAxis.nativeType === 'time' && granularity) {
    dateFormat = DATE_DISPLAY_FORMATS[granularity];
  }

  const labels = [
    ...new Set(
      results?.data?.map((d: { [p: string]: string }) => {
        const value = d[xAxis?.name];
        return formatValue(value === null ? '' : value, {
          meta: xAxis?.meta,
          dateFormat: dateFormat,
        });
      }),
    ),
  ] as string[];

  return {
    labels,
    datasets:
      metrics?.map((metric, i) => ({
        barPercentage: 0.8,
        barThickness: 'flex',
        maxBarThickness: 50,
        minBarLength: 0,
        borderRadius: 4,
        label: metric.title,
        data: results?.data?.map((d) => parseFloat(d[metric.name])) || [],
        backgroundColor: COLORS[i % COLORS.length],
      })) || [],
  };
}
