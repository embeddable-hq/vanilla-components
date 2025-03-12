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
import { Chart } from 'react-chartjs-2';

import formatValue from '../../../../util/format';
import getBarChartOptions from '../../../../util/getBarChartOptions';
import { setChartJSDefaults } from '../../../../util/chartjs/common';
import { Theme } from '../../../../../themes/theme';

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
  granularity?: Granularity;
  showSecondYAxis?: boolean;
  secondAxisTitle?: string;
  theme: Theme;
};

export default function BarChart({ ...props }: Props): React.JSX.Element {
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
  const { results, xAxis, metrics, granularity, lineMetrics, showSecondYAxis, theme } = props;
  const {
    charts: { colors },
    dateFormats,
  } = theme;
  setChartJSDefaults(theme);

  let dateFormat: string | undefined;
  if (xAxis.nativeType === 'time' && granularity) {
    dateFormat = dateFormats[granularity];
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

  const metricsDatasets =
    metrics?.map((metric, i) => ({
      backgroundColor: colors[i % colors.length],
      barPercentage: 0.8,
      barThickness: 'flex',
      borderRadius: theme.charts.bar.borderRadius,
      borderSkipped: false,
      borderWidth: theme.charts.bar.borderWidth,
      data: results?.data?.map((d) => parseFloat(d[metric.name] || 0)) || [],
      label: metric.title,
      maxBarThickness: 50,
      minBarLength: 0,
      order: 1,
    })) || [];

  //optional metrics to display as a line on the barchart
  const lineMetricsDatasets =
    lineMetrics?.map((metric, i) => ({
      backgroundColor: colors[metrics.length + (i % colors.length)],
      borderColor: colors[metrics.length + (i % colors.length)],
      cubicInterpolationMode: 'monotone' as const,
      data: results?.data?.map((d) => parseFloat(d[metric.name] || 0)) || [],
      label: metric.title,
      order: 0,
      pointHoverRadius: 3,
      pointRadius: 2,
      tension: theme.charts.line.lineTension,
      type: 'line' as const,
      yAxisID: showSecondYAxis ? 'y1' : 'y',
    })) || [];

  return {
    labels,
    datasets: [...metricsDatasets, ...lineMetricsDatasets],
  };
}
