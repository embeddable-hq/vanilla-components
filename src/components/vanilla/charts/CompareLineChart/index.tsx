import { DataResponse } from '@embeddable.com/react';
import {
  CategoryScale,
  ChartData,
  ChartDataset,
  Chart as ChartJS,
  ChartOptions,
  DefaultDataPoint,
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
import { Inputs } from './CompareLineChart.emb';

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
  prevResults: DataResponse;
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
  const { results, prevResults, metrics, applyFill } = props;

  const lines: ChartDataset<'line', DefaultDataPoint<'line'>>[] =
    metrics?.map((yAxis, i) => ({
      xAxisID: 'period',
      label: yAxis.title,
      data: results?.data?.map((d: Record) => d[yAxis.name]),
      backgroundColor: applyFill ? hexToRgb(COLORS[i % COLORS.length]) : COLORS[i % COLORS.length],
      borderColor: COLORS[i % COLORS.length],
      fill: applyFill,
      cubicInterpolationMode: 'monotone' as const
    })) || [];

  const datasets = [
    ...lines,
    ...lines.map((_, i) => {
      const c = hexToRgb(COLORS[i % COLORS.length], 0.5);

      const update: ChartDataset<'line', DefaultDataPoint<'line'>> = {
        cubicInterpolationMode: 'monotone' as const,
        showLine: !!props.prevTimeFilter?.from,
        xAxisID: 'comparison',
        label: `Previous ${metrics[i].title}`,
        data: !!props.prevTimeFilter?.from
          ? prevResults?.data?.map((d: Record) => d[metrics[i].name])
          : [],
        backgroundColor: applyFill ? hexToRgb(COLORS[i % COLORS.length], 0.05) : c,
        borderColor: c,
        pointRadius: !!props.prevTimeFilter?.from ? undefined : 0,
        fill: applyFill && !!props.prevTimeFilter?.from,
        segment: {
          borderDash: [10, 5]
        }
      };

      return update;
    })
  ];

  return {
    datasets
  };
}

// Convert hex to rgb and add opacity. Used when a color-fill is applied beneath the chart line(s).
function hexToRgb(hex: string, alpha?: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${
        alpha || `0.3`
      })`
    : '';
}

function chartOptions(props: Props): ChartOptions<'line'> {
  const labels = props.results?.data?.map((d) =>
    format(d[props.xAxis.name], { type: 'date', meta: props.xAxis?.meta })
  );

  const prevLabels = props.prevResults?.data?.map((d) =>
    format(d[props.xAxis.name], { type: 'date', meta: props.xAxis?.meta })
  );

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
      period: {
        labels,
        grid: {
          display: false
        },
        title: {
          display: !!props.xAxisTitle,
          text: props.xAxisTitle
        }
      },
      comparison: {
        labels: prevLabels,
        display: false,
        grid: {
          display: false
        },
        title: {
          display: false
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
