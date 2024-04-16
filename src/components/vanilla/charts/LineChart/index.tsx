import { DataResponse, Dimension, Granularity } from '@embeddable.com/core';
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
import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { parseTime } from '../../../hooks/useTimezone';
import { COLORS, EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE, DATE_DISPLAY_FORMATS } from '../../../constants';
import useTimeseries from '../../../hooks/useTimeseries';
import formatValue from '../../../util/format';
import formatDateTooltips from '../../../util/formatDateTooltips'
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
  xAxis: Dimension;
  metrics: { name: string; title: string }[];
  applyFill: boolean;
  showLabels: boolean;
  showLegend: boolean;
  yAxisMin: number;
  yAxisTitle: string;
  xAxisTitle: string;
  granularity: Granularity;
};

type Record = { [p: string]: string };

export default (props: Props) => {
  const { results, title } = props;
  const { fillGaps } = useTimeseries(props);

  const chartData: ChartData<'line'> = useMemo(() => {
    const { results, metrics, applyFill } = props;

    const data = results?.data?.reduce(fillGaps, []);

    return {
      datasets:
        metrics?.map((yAxis, i) => ({
          label: yAxis.title,
          data:
            data?.map((d: Record) => ({
              y: parseFloat(d[yAxis.name] || '0'),
              x: parseTime(d[props.xAxis?.name || '']) 
            })) || [],
          backgroundColor: applyFill
            ? hexToRgb(COLORS[i % COLORS.length], 0.2)
            : COLORS[i % COLORS.length],
          borderColor: COLORS[i % COLORS.length],
          pointRadius: 0,
          tension: 0.1,
          pointHoverRadius: 3,
          fill: applyFill,
          cubicInterpolationMode: 'monotone' as const
        })) || []
    };
  }, [props]);

  const chartOptions: ChartOptions<'line'> = useMemo(
    () => ({
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
            displayFormats: DATE_DISPLAY_FORMATS,
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
          formatter: (v) => {
            const val = v ? formatValue(v.y, { type: 'number', dps: props.dps }) : null;
            return val;
          }
        },
        tooltip: {
          //https://www.chartjs.org/docs/latest/configuration/tooltip.html
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';
              if (context.parsed.y !== null) {
                label += `: ${formatValue(`${context.parsed['y']}`, {
                  type: 'number',
                  dps: props.dps
                })}`;
              }
              return label;
            },
            title: (lines: any[]) => formatDateTooltips(lines, props.granularity)
          }
        }
      }
    }),
    [props]
  );

  return (
    <Container className="overflow-y-hidden" title={title} results={results}>
      <Line height="100%" options={chartOptions} data={chartData} />
    </Container>
  );
};
