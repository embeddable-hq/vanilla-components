import { DataResponse } from '@embeddable.com/react';
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import React from 'react';
import { Pie } from 'react-chartjs-2';

import { COLORS, EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE } from '../../../constants';
import useFont from '../../../hooks/useFont';
import ChartContainer from '../../ChartContainer';
import { Inputs } from './BasicPieComponent.emb';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.defaults.font.size = parseInt(SMALL_FONT_SIZE);
ChartJS.defaults.color = LIGHT_FONT;
ChartJS.defaults.font.family = EMB_FONT;
ChartJS.defaults.plugins.tooltip.enabled = true;
ChartJS.defaults.plugins.tooltip.usePointStyle = true;

type Props = Inputs & {
  results: DataResponse;
};

export default (props: Props) => {
  const { results, title } = props;

  useFont();

  return (
    <ChartContainer title={title} results={results}>
      <Pie options={chartOptions(props)} data={chartData(props)} />
    </ChartContainer>
  );
};

function chartOptions(props: Props): ChartOptions<'pie'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 400,
      easing: 'linear'
    },
    cutout: '45%',
    plugins: {
      datalabels: {
        // Great resource: https://quickchart.io/documentation/chart-js/custom-pie-doughnut-chart-labels/
        display: props.showLabels ? 'auto' : false,
        backgroundColor: '#fff',
        borderRadius: 8,
        font: {
          weight: 'normal'
        }
      },
      legend: {
        display: props.showLegend,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxHeight: 10
        }
      }
    }
  };
}

function mergeLongTail({ results, slice, metric, maxSegments }: Props) {
  if (!maxSegments || !metric || !slice) return results?.data;

  const newData = [...results?.data]
    .sort((a, b) => parseInt(b[metric.name]) - parseInt(a[metric.name]))
    .slice(0, maxSegments - 1);

  const sumLongTail = results?.data
    .slice(maxSegments - 1)
    .reduce((accumulator, record) => accumulator + parseInt(record[metric.name]), 0);

  newData.push({ [slice.name]: 'Other', [metric.name]: sumLongTail });

  return newData;
}

function chartData(props: Props) {
  const { maxSegments, results, metric, slice } = props;
  const labelsExceedMaxSegments = maxSegments && maxSegments < results?.data.length;
  const newData = labelsExceedMaxSegments ? mergeLongTail(props) : results.data;

  // Chart.js pie expects labels like so: ['US', 'UK', 'Germany']
  const labels = newData?.map((d) => {
    const l = d[slice.name] || '';

    return l?.length > 15 ? `${l.substring(0, 15)}...` : l;
  });

  // Chart.js pie expects counts like so: [23, 10, 5]
  const counts = newData?.map((d) => d[metric.name]);

  return {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: COLORS,
        borderColor: '#fff',
        borderWeight: 5
      }
    ]
  };
}
