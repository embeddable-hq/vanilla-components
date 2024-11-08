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
  TimeScale,
  Title,
  Tooltip
} from 'chart.js';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE, DATE_DISPLAY_FORMATS } from '../../../constants';
import useTimeseries from '../../../hooks/useTimeseries';
import formatValue from '../../../util/format';
import formatDateTooltips from '../../../util/formatDateTooltips'
import getStackedChartData, { Props as GeneralStackedChartDataProps } from '../../../util/getStackedChartData';
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
  ChartDataLabels,
  TimeScale
);

ChartJS.defaults.font.size = parseInt(SMALL_FONT_SIZE);
ChartJS.defaults.color = LIGHT_FONT;
ChartJS.defaults.font.family = EMB_FONT;
ChartJS.defaults.plugins.tooltip.enabled = true;

type Props = GeneralStackedChartDataProps & {
  isMultiDimensionLine?: boolean;
}

export default (props: Props) => {

  const { isMultiDimensionLine = false } = props;

  const { fillGaps } = useTimeseries(props, 'desc');

  const chartData = useMemo(() => {
    const data = props?.results?.data?.reduce(fillGaps, []);

    const datasetsMeta = {
      fill: !isMultiDimensionLine,
      cubicInterpolationMode: 'monotone' as const,
      pointRadius: 0,
      tension: 0.1,
      pointHoverRadius: 3,
    };

    return getStackedChartData(
      {
        ...props,
        results: {
          ...props.results,
          data
        }
      },
      datasetsMeta,
      { chartType: 'stackedAreaChart' }
    ) as ChartData<'line', number[], unknown>;
  }, [props, fillGaps]);

  const chartOptions: ChartOptions<'line'> = useMemo(() => {
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
          stacked: !isMultiDimensionLine,
          min: props.yAxisMin,
          max: props.displayAsPercentage ? 100 : undefined,
          grace: '0%', // Add percent to add numbers on the y-axis above and below the max and min values
          grid: {
            display: false
          },
          ticks: {
            callback: function (value) {
              return props.displayAsPercentage ? `${value}%` : value;
            }
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
        tooltip: {
          //https://www.chartjs.org/docs/latest/configuration/tooltip.html
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';
              if (context.parsed.y !== null) {
                label += `: ${formatValue(`${context.parsed['y']}`, {
                  type: 'number',
                  dps: props.dps,
                  meta: props.displayAsPercentage ? undefined : props.metric.meta
                })}`;
                if (props.displayAsPercentage) {
                  label += '%';
                }
              }
              return label;
            },
            title: (lines: any[]) => formatDateTooltips(lines, props.granularity || 'day')
          }
        },
        datalabels: {
          align: 'top',
          display: props.showLabels ? 'auto' : false,
          formatter: (v) => {
            let val = v ? formatValue(v, { 
              type: 'number', 
              dps: props.dps,
              meta: props.displayAsPercentage ? undefined : props.metric.meta
            }) : null;
            if (props.displayAsPercentage) {
              val += '%';
            }
            return val;
          }
        }
      }
    };
  }, [props]);

  return (
    <Container
      {...props}
      className="overflow-y-hidden">
      <Line height="100%" options={chartOptions} data={chartData} />
    </Container>
  );
};
