import { DataResponse, Dimension, Granularity, Measure } from '@embeddable.com/core';
import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Filler,
  Legend,
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React from 'react';
import { Chart } from 'react-chartjs-2';

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
  LineElement,
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
  lineMetrics?: Measure[];
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
  showSecondYAxis?: boolean;
  secondAxisTitle?: string;
};

export default function BarChart({ ...props }: Props) {
  return (
    <Chart
      type="bar"
      height="100%"
      options={getBarChartOptions({ ...props, stacked: false })}
      data={chartData(props)}
    />
  );
}

function chartData(props: Props): ChartData<'bar' | 'line'> {
  const { results, xAxis, metrics, lineMetrics, showSecondYAxis } = props;
  const granularity = xAxis?.inputs?.granularity;
  const isTimeDimension = xAxis?.nativeType === 'time';

  const dateFormat: string =
    isTimeDimension && granularity ? DATE_DISPLAY_FORMATS[granularity] : 'yyyy-mm-dd';

  const labels = [
    ...new Set(
      results?.data?.map((d: { [p: string]: string }) => {
        const value = d[xAxis?.name];
        return formatValue(value ?? '', {
          meta: xAxis?.meta,
          ...(isTimeDimension ? { dateFormat } : {}),
        });
      }),
    ),
  ] as string[];

  const metricsDatasets =
    metrics?.map((metric, i) => ({
      barPercentage: 0.8,
      barThickness: 'flex',
      maxBarThickness: 50,
      minBarLength: 0,
      borderRadius: 4,
      label: metric.title,
      data: results?.data?.map((d) => parseFloat(d[metric.name] || 0)) || [],
      backgroundColor: COLORS[i % COLORS.length],
      order: 1,
    })) || [];

  //optional metrics to display as a line on the barchart
  const lineMetricsDatasets =
    lineMetrics?.map((metric, i) => ({
      label: metric.title,
      data: results?.data?.map((d) => parseFloat(d[metric.name] || 0)) || [],
      backgroundColor: COLORS[metrics.length + (i % COLORS.length)],
      borderColor: COLORS[metrics.length + (i % COLORS.length)],
      cubicInterpolationMode: 'monotone' as const,
      pointRadius: 2,
      pointHoverRadius: 3,
      type: 'line' as const,
      order: 0,
      yAxisID: showSecondYAxis ? 'y1' : 'y',
    })) || [];

  return {
    labels,
    datasets: [...metricsDatasets, ...lineMetricsDatasets],
  };
}
