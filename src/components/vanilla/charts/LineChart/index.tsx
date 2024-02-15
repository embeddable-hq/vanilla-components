import { DataResponse } from '@embeddable.com/react';
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React from 'react';
import { Line } from 'react-chartjs-2';

import { COLORS, EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE } from '../../../constants';
import format from '../../../util/format';
import Container from '../../Container';
import { Inputs } from './LineChart.emb';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

type Record = { [p: string]: string };

export default (props: Props) => {
  const { results, title } = props;

  return (
    <Container className="overflow-y-hidden" title={title} results={results}>
      <Line height="100%" options={chartOptions(props)} data={chartData(props)} />
    </Container>
  );
};

function chartData(props: Props): ChartData<'line'> {
  const { results, xAxis, metrics, applyFill } = props;
  const labels = results?.data?.map((d) =>
    format(d[xAxis.name], { type: 'date', meta: xAxis?.meta })
  );

  return {
    labels,
    datasets:
      metrics?.map((yAxis, i) => ({
        label: yAxis.title,
        data: results?.data?.map((d: Record) => d[yAxis.name]),
        backgroundColor: applyFill
          ? hexToRgb(COLORS[i % COLORS.length])
          : COLORS[i % COLORS.length],
        borderColor: COLORS[i % COLORS.length],
        fill: applyFill,
        cubicInterpolationMode: 'monotone' as const
      })) || []
  };
}

// Convert hex to rgb and add opacity. Used when a color-fill is applied beneath the chart line(s).
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}, 0.3)`
    : '';
}

function chartOptions(props: Props): ChartOptions<'line'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: props.showLabels ? 20 : 0, // Added so the highest data labels fits
        bottom: 0
      }
    },
    scales: {
      y: {
        min: props.yAxisMin,
        grace: '0%', // Add percent to add numbers on the y-axis above and below the max and min values
        grid: {
          display: false
        },
        ticks: {
          precision: 0
        },
        title: {
          display: !!props.yAxisTitle,
          text: props.yAxisTitle
        }
      },
      x: {
        grid: {
          display: false
        },
        title: {
          display: !!props.xAxisTitle,
          text: props.xAxisTitle
        }
      }
    },
    animation: {
      duration: 400,
      easing: 'linear'
    },
    plugins: {
      legend: {
        display: props.showLegend,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxHeight: 8
        }
      },
      datalabels: {
        align: 'top',
        display: props.showLabels ? 'auto' : false
      }
    }
  };
}
