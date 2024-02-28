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
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { parseJSON } from 'date-fns';
import React from 'react';
import { Line } from 'react-chartjs-2';

import { COLORS, EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE } from '../../../constants';
import useTimezone from '../../../hooks/useTimezone';
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

  const fixTimezoneProps = useTimezone(props);

  return (
    <Container className="overflow-y-hidden" title={title} results={results}>
      <Line
        height="100%"
        options={chartOptions(fixTimezoneProps)}
        data={chartData(fixTimezoneProps)}
      />
    </Container>
  );
};

function chartData(props: Props): ChartData<'line'> {
  const { results, metrics, applyFill } = props;

  return {
    datasets:
      metrics?.map((yAxis, i) => ({
        label: yAxis.title,
        data: results?.data?.map((d: Record) => ({
          y: parseFloat(d[yAxis.name]),
          x: parseJSON(d[props.xAxis?.name || ''])
        })),
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
    interaction: {
      mode: 'index',
      intersect: false
    },
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
        },
        type: 'time',
        time: {
          round: props.granularity,
          displayFormats: {
            month: 'MMM',
            day: 'd MMM',
            week: 'd MMM',
            hour: 'HH:mm',
            minute: 'HH:mm',
            second: 'HH:mm:ss'
          },
          unit: props.granularity
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
        formatter: (v) => v.y
      }
    }
  };
}
