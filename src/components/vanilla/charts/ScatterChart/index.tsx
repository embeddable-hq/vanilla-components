import Container from '../../Container';
import useTimeseries from '../../../hooks/useTimeseries';
import { DataResponse, Dimension, Granularity, Measure } from '@embeddable.com/core';
import {
  CategoryScale,
  ChartData,
  ChartOptions,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  TimeScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React from 'react';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { Scatter } from 'react-chartjs-2';
import { COLORS, EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE, DATE_DISPLAY_FORMATS } from '../../../constants';
import formatValue from '../../../util/format';
import hexToRgb from '../../../util/hexToRgb';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
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
  xAxis: Dimension
  metrics: Measure[];
  results: DataResponse;
  granularity?: Granularity;
  xAxisTitle?: string;
  yAxisTitle?: string;
  title?: string;
  description?: string;
  showLegend?: boolean;
  showLabels?: boolean;
  reverseXAxis?: boolean;
  yAxisMin?: number;
  dps?: number;
  enableDownloadAsCSV?: boolean;
  isTimeDimension: boolean;
};

type Record = { [p: string]: any };

export default (props: Props) => {

  //add missing dates to time-series data
  const { fillGaps } = useTimeseries(props, 'desc');
  const { results } = props;
  const updatedData = props.isTimeDimension 
    ? results?.data?.reduce(fillGaps, []) 
    : results?.data;

  const scatterData = chartData(props, updatedData);

  return (
    <Container
      {...props}
      className="overflow-y-hidden"
      >
      <Scatter
        height="100%"
        options={chartOptions(props, scatterData)}
        data={scatterData}
      />
    </Container>
  );
};

function chartOptions(props: Props, scatterData: ChartData<'scatter'>): ChartOptions<'scatter'> {

    const datasets = scatterData.datasets;
    const yAxisContainsFractions = datasets?.some((dataset) => dataset.data.some(row => row && typeof row === 'object' && 'y' in row && !Number.isInteger(row.y)));

    return {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
        duration: 400,
        easing: 'linear'
        },
        scales: {
            y: {
                min: props.yAxisMin,
                grid: {
                    display: false
                },
                afterDataLimits: function(axis) {
                    // Capture the max value for dynamic stepSize calculation
                    const yAxisMax = axis.max;
                    // Prevent chartJS from showing fractions on the y-axis when there aren't any.
                    (axis.options as any).ticks.stepSize =  
                    !yAxisContainsFractions && yAxisMax < 10 ? 1 : undefined
                },
                title: {
                    display: !!props.yAxisTitle,
                    text: props.yAxisTitle
                }
            },
            x: {
                reverse: props.reverseXAxis,
                type: props.isTimeDimension ? 'time' : 'category',
                time: {
                    round: props.granularity,
                    isoWeekday: true,
                    displayFormats: DATE_DISPLAY_FORMATS,
                    unit: props.granularity
                },
                grid: {
                display: false
                },
                title: {
                    display: !!props.xAxisTitle,
                    text: props.xAxisTitle
                }
            }
        },
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: props.showLabels ? 30 : 0,
                bottom: 0
            }
        },
        plugins: {
            datalabels: {
                display: props.showLabels ? 'auto' : false,
                anchor: 'end',
                align: 'end',
                font: {
                weight: 'normal'
                },
                formatter: (v, context) => {
                    const metricIndex = context.datasetIndex;
                    const metric = props.metrics[metricIndex];
                    const val = v ? formatValue(v.y, { 
                        type: 'number', 
                        dps: props.dps,
                        meta: metric?.meta
                    }) : null;
                    return val;
                },
            },
            tooltip: {
                //https://www.chartjs.org/docs/latest/configuration/tooltip.html
                callbacks: {
                    label: function (context) {
                    let label = context.dataset.label || '';
                    const metricIndex = context.datasetIndex;
                    const metric = props.metrics[metricIndex];
                    if (context.parsed.y !== null) {
                        label += `: ${formatValue(`${context.parsed['y']}`, {
                            type: 'number',
                            dps: props.dps,
                            meta: metric?.meta
                        })}`;
                    }
                    return label;
                    },
                },
            },
            legend: {
                display: props.showLegend,
                position: 'bottom',
                labels: {
                usePointStyle: true,
                boxHeight: 10
                }
            },
        }
    };
}

function chartData(props: Props, updatedData: Record[] | undefined): ChartData<'scatter'> {

    return ({
        datasets: props.metrics.map((metric, i) => {
            return {
                label: metric.title,
                data: updatedData?.map((row) => {
                    return ({
                        x: row[props.xAxis.name],
                        y: parseFloat(row[metric.name]) || 0,
                    })
                }) || [],
                backgroundColor: hexToRgb(COLORS[i], 0.8)
            }
        })
    });
}

