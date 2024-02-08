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
import useFont from '../../../hooks/useFont';
import getBarChartOptions from '../../../util/getBarChartOptions';
import ChartContainer from '../../ChartContainer';
import { Inputs } from './BasicBarComponent.emb';

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

  useFont();

  return (
    <ChartContainer title={title} results={results}>
      <Bar options={getBarChartOptions({ ...props, stacked: false })} data={chartData(props)} />
    </ChartContainer>
  );
};

function chartData(props: Props): ChartData<'bar'> {
  const { results, xAxis, metrics } = props;

  const labels = [
    ...new Set(
      results?.data?.map((d: { [p: string]: string }) => {
        const l = d[xAxis?.name || ''] || '';
        return l?.length > 15 ? `${l.substring(0, 15)}...` : l;
      })
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
