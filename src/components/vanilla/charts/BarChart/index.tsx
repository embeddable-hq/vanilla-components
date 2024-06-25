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

import { COLORS, EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE } from '../../../constants';
import formatValue from '../../../util/format';
import getBarChartOptions from '../../../util/getBarChartOptions';
import Container from '../../Container';

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
  title: string;
  xAxis: Dimension;
  metrics: { name: string; title: string }[];
};

export default (props: Props) => {
  const { results, title } = props;

  return (
    <Container
      {...props}
      className="overflow-y-hidden"
      >
      <Bar
        height="100%"
        options={getBarChartOptions({ ...props, stacked: false })}
        data={chartData(props)}
      />
    </Container>
  );
};

function chartData(props: Props): ChartData<'bar'> {
  const { results, xAxis, metrics, metricNames } = props;

  const labels = [
    ...new Set(
      results?.data?.map((d: { [p: string]: string }) =>
        formatValue(d[xAxis?.name || ''], { meta: xAxis?.meta })
      )
    )
  ] as string[];

  return {
    labels,
    datasets:
      metrics?.map((metric, i) => ({
        barPercentage: 0.6,
        barThickness: 'flex',
        maxBarThickness: 25,
        minBarLength: 0,
        borderRadius: 6,
        label: (metricNames && metricNames[i]) || metric.title,
        data: results?.data?.map((d) => parseFloat(d[metric.name])) || [],
        backgroundColor: COLORS[i % COLORS.length]
      })) || []
  };
}
