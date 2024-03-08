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
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { format, parseJSON } from 'date-fns';
import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';

import { COLORS, EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE } from '../../../constants';
import { timeRangeToLocal } from '../../../hooks/useTimezone';
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
  props.granularity = props.granularity || 'day';

  useEffect(() => {
    ChartJS.defaults.plugins.tooltip.callbacks.title = (lines: any[]) => {
      const definedFormat = {
        month: 'MMM',
        day: 'd MMM',
        week: 'd MMM',
        hour: 'eee HH:mm',
        minute: 'eee HH:mm',
        second: 'HH:mm:ss'
      };

      return [...new Set(lines.map((line) => line?.raw?.x?.valueOf()))]
        .map((date) => format(new Date(date), definedFormat[props.granularity]))
        .filter((v) => !!v);
    };
  }, [props.granularity]);

  return (
    <Container className="overflow-y-hidden" title={props.title} results={props.results}>
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
      data: results?.data?.map((d: Record) => ({
        y: parseFloat(d[yAxis.name] || '0'),
        x: parseJSON(d[props.xAxis?.name || ''])
      })),
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
          ? prevResults?.data?.map((d: Record) => ({
              y: parseFloat(d[metrics[i].name] || '0'),
              x: parseJSON(d[props.xAxis?.name || ''])
            }))
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
  const bounds = {
    period: timeRangeToLocal(props.timeFilter),
    comparison: timeRangeToLocal(props.prevTimeFilter)
  };

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
      period: {
        min: bounds.period?.from?.toJSON(),
        max: bounds.period?.to?.toJSON(),
        grid: {
          display: false
        },
        type: 'time',
        time: {
          round: props.granularity,
          displayFormats: {
            month: 'MMM',
            day: 'd MMM',
            week: 'd MMM',
            hour: 'eee HH:mm',
            minute: 'eee HH:mm',
            second: 'HH:mm:ss'
          },
          unit: props.granularity
        },
        title: {
          display: !!props.xAxisTitle,
          text: props.xAxisTitle
        }
      },
      comparison: {
        min: bounds.comparison?.from?.toJSON(),
        max: bounds.comparison?.to?.toJSON(),
        display: false,
        grid: {
          display: false
        },
        type: 'time',
        time: {
          round: props.granularity,
          displayFormats: {
            month: 'MMM',
            day: 'd MMM',
            week: 'd MMM',
            hour: 'eee HH:mm',
            minute: 'eee HH:mm',
            second: 'HH:mm:ss'
          },
          unit: props.granularity
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
        display: props.showLabels ? 'auto' : false,
        formatter: (v) => v?.y
      }
    }
  };
}
