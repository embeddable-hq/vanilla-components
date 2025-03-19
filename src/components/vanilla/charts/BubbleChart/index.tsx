import Container from '../../Container';
import useTimeseries from '../../../hooks/useTimeseries';
import { DataResponse, Dataset, Dimension, Granularity, Measure } from '@embeddable.com/core';
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
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React from 'react';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { Bubble } from 'react-chartjs-2';
import formatValue from '../../../util/format';
import hexToRgb from '../../../util/hexToRgb';
import { setChartJSDefaults, setYAxisStepSize } from '../../../util/chartjs/common';
import { useTheme } from '@embeddable.com/react';
import defaultTheme from '../../../../themes/defaulttheme';
import { Theme } from '../../../../themes/theme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels,
);

type Props = {
  xAxis: Dimension;
  yAxis: Measure;
  bubbleSize: Measure;
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

type PropsWithRequiredTheme = Props & { theme: Theme };
type Record = { [p: string]: any };

export default (props: Props) => {
  const theme: Theme = useTheme() as Theme;

  // Check for chart-specific overrides in the theme
  let chartColors = theme.charts.colors;
  if (theme.charts.bubble.colors) {
    chartColors = theme.charts.bubble.colors;
  }

  //add missing dates to time-series data
  const { fillGaps } = useTimeseries(props, 'desc');
  const { results } = props;

  // Update data and props
  const updatedData = props.isTimeDimension ? results?.data?.reduce(fillGaps, []) : results?.data;
  const updatedProps: PropsWithRequiredTheme = {
    ...props,
    theme: theme,
  };
  const bubbleData = chartData(updatedProps, updatedData, chartColors);

  return (
    <Container {...props} className="overflow-y-hidden">
      <Bubble
        height="100%"
        options={chartOptions(updatedProps, updatedData, bubbleData)}
        data={bubbleData}
      />
    </Container>
  );
};

function chartOptions(
  props: PropsWithRequiredTheme,
  updatedData: Record[] | undefined,
  bubbleData: ChartData<'bubble'>,
): ChartOptions<'bubble'> {
  let { theme } = props;
  if (!theme) {
    theme = defaultTheme;
  }

  // Set ChartJS defaults
  setChartJSDefaults(theme, 'bubble');

  const data = bubbleData.datasets[0].data;

  //y-axis padding based on size of first item
  const firstItemRadius = props.reverseXAxis
    ? props.isTimeDimension
      ? data[0]?.r
      : data?.[data.length - 1]?.r
    : props.isTimeDimension
      ? data[data.length - 1]?.r
      : data?.[0]?.r;

  //top padding based on size of top vertical item
  const highestItem = data.reduce((max, current) => (current?.y > max?.y ? current : max), data[0]);
  const highestItemRadius = highestItem?.r || 0;

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 400,
      easing: 'linear',
    },
    scales: {
      y: {
        min: props.yAxisMin,
        grid: {
          display: false,
        },
        afterDataLimits: function (axis) {
          //Disable fractions unless they exist in the data.
          setYAxisStepSize(axis, props.results, [props.yAxis], props.dps);
        },
        ticks: {
          padding: firstItemRadius,
        },
        title: {
          display: !!props.yAxisTitle,
          text: props.yAxisTitle,
        },
      },
      x: {
        reverse: props.reverseXAxis,
        type: props.isTimeDimension ? 'time' : 'category',
        time: {
          round: props.granularity,
          isoWeekday: true,
          displayFormats: theme.dateFormats,
          unit: props.granularity,
        },
        grid: {
          display: false,
        },
        title: {
          display: !!props.xAxisTitle,
          text: props.xAxisTitle,
        },
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: highestItemRadius + (props.showLabels ? 30 : 0),
        bottom: 0,
      },
    },
    plugins: {
      datalabels: {
        display: props.showLabels ? 'auto' : false,
        anchor: 'end',
        align: 'end',
        font: {
          weight: 'normal',
        },
        formatter: (_, { dataIndex }) => {
          const v = updatedData?.[dataIndex][props.bubbleSize.name] || 0;
          const val =
            formatValue(v, {
              type: 'number',
              dps: props.dps || 0,
              meta: props.bubbleSize.meta,
            }) || null;
          return val;
        },
      },
      tooltip: {
        //https://www.chartjs.org/docs/latest/configuration/tooltip.html
        callbacks: {
          label: function (context) {
            //xAxis label
            const yAxisLabel = context.dataset.label || '';
            const rawData = context.raw as { y: number };
            const yAxisValue = formatValue(`${rawData.y || ''}`, {
              type: 'number',
              dps: props.dps,
              meta: props.yAxis.meta,
            });
            //Bubble size label
            const bubbleSizeLabel = props.bubbleSize.title;
            const bubbleSizeValue = updatedData?.[context.dataIndex][props.bubbleSize.name] || 0;
            const bubbleSizeValueFormatted = formatValue(bubbleSizeValue, {
              type: 'number',
              dps: props.dps,
              meta: props.bubbleSize.meta,
            });
            return [
              `${yAxisLabel}: ${yAxisValue}`,
              `${bubbleSizeLabel}: ${bubbleSizeValueFormatted}`,
            ];
          },
        },
      },
      legend: {
        display: props.showLegend,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxHeight: 10,
        },
      },
    },
  };
}

function chartData(
  props: PropsWithRequiredTheme,
  updatedData: Record[] | undefined,
  chartColors: string[],
): ChartData<'bubble'> {
  const { theme } = props;
  const bubbleRadiusValue =
    updatedData?.map((row) => {
      const value = row[props.bubbleSize.name];
      return value ? parseFloat(value) : 0;
    }) || [];

  const maxValue = Math.max(...bubbleRadiusValue); // Replace `data` with your dataset
  const scaleFactor = 30 / maxValue; // Scale factor to keep max size reasonable

  const ndata =
    updatedData?.map((row) => {
      return {
        x: row[props.xAxis.name],
        y: parseFloat(row[props.yAxis.name]) || 0,
        r: (parseFloat(row[props.bubbleSize.name]) || 0) * scaleFactor,
      };
    }) || [];

  return {
    datasets: [
      {
        label: props.yAxis.title,
        data: ndata,
        backgroundColor: hexToRgb(chartColors[0], 0.8),
      },
    ],
  };
}
