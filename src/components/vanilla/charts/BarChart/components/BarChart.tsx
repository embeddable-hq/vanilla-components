import { DataResponse, Dimension } from '@embeddable.com/core';
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
  Tooltip
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React from 'react';
import { Bar } from 'react-chartjs-2';

import { COLORS, EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE, DATE_DISPLAY_FORMATS } from '../../../../constants';
import formatValue from '../../../../util/format';
import getBarChartOptions from '../../../../util/getBarChartOptions';
import Container from '../../../Container';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

ChartJS.defaults.font.size = parseInt(SMALL_FONT_SIZE);
ChartJS.defaults.color = LIGHT_FONT;
ChartJS.defaults.font.family = EMB_FONT;
ChartJS.defaults.plugins.tooltip.enabled = true;

type Props = {
  results: DataResponse;
  xAxis: Dimension;
  metrics: { name: string; title: string }[];
  granularity: string;
};

export default function BarChart({...props}: Props) {

  return (
      <Bar
        height="100%"
        options={getBarChartOptions({ ...props, stacked: false })}
        data={chartData(props)}
      />
  );
}

function chartData(props: Props, value): ChartData<'bar'> {
  const { results, xAxis, metrics, granularity, xAxisOptions } = props;

  const dateFormat = xAxis.nativeType === 'time' && granularity && DATE_DISPLAY_FORMATS[granularity];

  const labels = [
    ...new Set(
      results?.data?.map((d: { [p: string]: string }) => {
        const value = d[xAxis?.name];
        return formatValue(value === null ? '' : value, { meta: xAxis?.meta, dateFormat: dateFormat })
      })
    )
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
        backgroundColor: COLORS[i % COLORS.length]
      })) || []
  };
}
