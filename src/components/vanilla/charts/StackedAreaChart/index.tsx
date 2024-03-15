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
  Tooltip,
  TimeScale
} from 'chart.js';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import 'chartjs-adapter-moment';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { COLORS, EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE } from '../../../constants';
import hexToRgb from '../../../util/hexToRgb';
import getStackedChartData from '../../../util/getStackedChartData';
import Container from '../../Container';
import { Inputs } from './LineChart.emb';
import format from '../../../util/format';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels,
  TimeScale
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

  const datasetsMeta = {
    fill: true,
    cubicInterpolationMode: 'monotone' as const,
  }

  return (
    <Container className="overflow-y-hidden" title={title} results={results}>
      <Line
        height="100%"
        options={chartOptions(props)}
        data={getStackedChartData(props, datasetsMeta, null)}
      />
    </Container>
  );
};


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
        stacked: true,
        min: props.yAxisMin,
        grace: '0%', // Add percent to add numbers on the y-axis above and below the max and min values
        grid: {
          display: false
        },
        ticks: {
          // precision: 0,
          callback: function (value) {
            return props.displayAsPercentage ? `${value}%` : value
          }
        },
        title: {
          display: !!props.yAxisTitle,
          text: props.yAxisTitle
        },
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
        },
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
      tooltip: {
        //https://www.chartjs.org/docs/latest/configuration/tooltip.html
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (context.parsed.y !== null) {
              label += `: ${format(context.parsed['y'], { type: 'number', dps: props.dps })}`;
              if (props.displayAsPercentage) {
                label += '%';
              }
            }
            return label;
          }
        }
      },
      datalabels: {
        align: 'top',
        display: props.showLabels ? 'auto' : false,
        formatter: (v) => {
          let val = v ? format(v, { type: 'number', dps: props.dps }) : null;
          if (props.displayAsPercentage) {
            val += '%'
          }
          return val;
        }
      }
    }
  };
}
