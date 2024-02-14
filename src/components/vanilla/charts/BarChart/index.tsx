import { DataResponse } from '@embeddable.com/react';
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
import format from '../../../util/format';
import getBarChartOptions from '../../../util/getBarChartOptions';
import Container from '../../Container';
import { Inputs } from './BarChart.emb';

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

type Props = Inputs & {
  results: DataResponse;
};

export default (props: Props) => {
  const { results, title } = props;

  return (
    <Container title={title} results={results}>
      <Bar options={getBarChartOptions({ ...props, stacked: false })} data={chartData(props)} />
    </Container>
  );
};

function chartData(props: Props): ChartData<'bar'> {
  const { results, xAxis, metrics } = props;

  const labels = [
    ...new Set(
      results?.data?.map((d: { [p: string]: string }) =>
        format(d[xAxis?.name || ''], { truncate: 15, meta: xAxis.meta })
      )
    )
  ] as string[];

  return {
    labels,
    datasets:
      metrics?.map((metric, i) => ({
        barPercentage: 0.6,
        barThickness: 'flex',
        maxBarThickness: 15,
        minBarLength: 0,
        borderRadius: 6,
        label: metric.title,
        data: results?.data?.map((d) => parseInt(d[metric.name])),
        backgroundColor: COLORS[i % COLORS.length]
      })) || []
  };
}
