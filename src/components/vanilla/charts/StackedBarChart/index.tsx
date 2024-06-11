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

import { EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE } from '../../../constants';
import getBarChartOptions from '../../../util/getBarChartOptions';
import getStackedChartData, { Props } from '../../../util/getStackedChartData';
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

export default (props: Props) => {
  const { results, title } = props;

  const datasetsMeta = {
    barPercentage: 0.6,
    barThickness: 'flex',
    maxBarThickness: 25,
    minBarLength: 0,
    borderRadius: 3
  };

  return (
    <Container
      {...props}
      className="overflow-y-hidden">
      <Bar
        height="100%"
        options={getBarChartOptions({ ...props, stacked: true })}
        data={getStackedChartData(props, datasetsMeta) as ChartData<'bar', number[], unknown>}
      />
    </Container>
  );
};
