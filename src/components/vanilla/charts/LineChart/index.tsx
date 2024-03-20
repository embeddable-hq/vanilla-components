import { DataResponse } from '@embeddable.com/core';
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  Point,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React from 'react';
import { Line } from 'react-chartjs-2';

import { COLORS, EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE } from '../../../constants';
import format from '../../../util/format';
import hexToRgb from '../../../util/hexToRgb';
import Container from '../../Container';

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

type Props = {
  results: DataResponse;
  title: string;
  dps?: number;
  xAxis: { name: string; meta?: object };
  metrics: { name: string; title: string }[];
  applyFill: boolean;
  showLabels: boolean;
  showLegend: boolean;
  yAxisMin: number;
  yAxisTitle: string;
  xAxisTitle: string;
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
        data: results?.data?.map((d: Record) => d[yAxis.name]) as unknown as (
          | number
          | Point
          | null
        )[],
        backgroundColor: applyFill
          ? hexToRgb(COLORS[i % COLORS.length], 0.2)
          : COLORS[i % COLORS.length],
        borderColor: COLORS[i % COLORS.length],
        fill: applyFill,
        cubicInterpolationMode: 'monotone' as const
      })) || []
  };
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
        display: props.showLabels ? 'auto' : false,
        formatter: (v) => {
          let val = v ? format(v, { type: 'number', dps: props.dps }) : null;

          return val;
        }
      },
      tooltip: {
        //https://www.chartjs.org/docs/latest/configuration/tooltip.html
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (context.parsed.y !== null) {
              label += `: ${format(`${context.parsed['y'] || ''}`, {
                type: 'number',
                dps: props.dps
              })}`;
            }
            return label;
          }
        }
      }
    }
  };
}
