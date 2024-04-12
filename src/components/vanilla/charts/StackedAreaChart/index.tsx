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
import { EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE } from '../../../constants';
import useTimeseries from '../../../hooks/useTimeseries';
import formatValue from '../../../util/format';
import getStackedChartData, { Props } from '../../../util/getStackedChartData';
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

export default (props: Props) => {
  const { fillGaps } = useTimeseries(props);

  const datasetsMeta = {
    fill: true,
    cubicInterpolationMode: 'monotone' as const
  };

  const chartData = useMemo(() => {
    const data = props?.results?.data?.reduce(fillGaps, []);

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
  }, [props]);

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
          stacked: true,
          min: props.yAxisMin,
          grace: '0%', // Add percent to add numbers on the y-axis above and below the max and min values
          grid: {
            display: false
          },
          ticks: {
            // precision: 0,
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
            displayFormats: {
              month: 'MMM yy',
              day: 'dd MMM',
              week: 'dd MMM',
              hour: 'HH:mm dd MMM',
              minute: 'HH:mm dd MMM',
              second: 'HH:mm:ss dd MMM'
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
            let val = v ? formatValue(v, { type: 'number', dps: props.dps }) : null;
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
    <Container className="overflow-y-hidden" title={props.title} results={props.results}>
      <Line height="100%" options={chartOptions} data={chartData} />
    </Container>
  );
};
