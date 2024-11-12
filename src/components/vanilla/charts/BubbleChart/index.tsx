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
  Tooltip
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React from 'react';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { Bubble } from 'react-chartjs-2';
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

type Record = { [p: string]: any };

export default (props: Props) => {

  //add missing dates to time-series data
  const { fillGaps } = useTimeseries(props, 'desc');
  const { results } = props;
  const updatedData = props.isTimeDimension 
    ? results?.data?.reduce(fillGaps, []) 
    : results?.data;

  const bubbleData = chartData(props, updatedData);

  return (
    <Container
      {...props}
      className="overflow-y-hidden"
      >
      <Bubble
        height="100%"
        options={chartOptions(props, updatedData, bubbleData)}
        data={bubbleData}
      />
    </Container>
  );
};

function chartOptions(props: Props, updatedData: Record[] | undefined, bubbleData: ChartData<'bubble'>): ChartOptions<'bubble'> {

  const data = bubbleData.datasets[0].data;

  //y-axis padding based on size of first item
  const firstItemRadius = props.reverseXAxis
  ? (props.isTimeDimension ? data[0]?.r : data?.[data.length - 1]?.r)
  : (props.isTimeDimension ? data[data.length - 1]?.r : data?.[0]?.r);

  //top padding based on size of top vertical item
  const highestItem = data.reduce((max, current) => (current?.y > max?.y ? current : max), data[0]);
  const highestItemRadius = highestItem?.r || 0;

  const yAxisContainsFractions = data?.some(row => !Number.isInteger(row.y));

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
        ticks: {
          padding: firstItemRadius          
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
        top: highestItemRadius + (props.showLabels ? 30 : 0),
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
        formatter: (_, {dataIndex}) => {
          const v = updatedData?.[dataIndex][props.bubbleSize.name] || 0;
          const val = formatValue(v, { 
            type: 'number', 
            dps: props.dps || 0, 
            meta: props.bubbleSize.meta 
          }) || null;
          return val;
        }
      },
      tooltip: {
        //https://www.chartjs.org/docs/latest/configuration/tooltip.html
        callbacks: {
          label: function (context) {
            //xAxis label
            const yAxisLabel = context.dataset.label || '';
            const rawData = context.raw as { y: number };
            const yAxisValue = formatValue((`${rawData.y || ''}`), {
                type: 'number',
                dps: props.dps,
                meta: props.yAxis.meta
              });
            //Bubble size label
            const bubbleSizeLabel = props.bubbleSize.title;
            const bubbleSizeValue = updatedData?.[context.dataIndex][props.bubbleSize.name] || 0;
            const bubbleSizeValueFormatted = formatValue((bubbleSizeValue), {
                type: 'number',
                dps: props.dps,
                meta: props.bubbleSize.meta
              });            
            return [`${yAxisLabel}: ${yAxisValue}`, `${bubbleSizeLabel}: ${bubbleSizeValueFormatted}`];
          }
        }
      },
      legend: {
        display: props.showLegend,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxHeight: 10
        }
      }
    }
  };
}

function chartData(props: Props, updatedData: Record[] | undefined): ChartData<'bubble'> {

  const bubbleRadiusValue = updatedData?.map(row => {
    const value = row[props.bubbleSize.name];
    return value ? parseFloat(value) : 0
  }) || [];

  const maxValue = Math.max(...bubbleRadiusValue); // Replace `data` with your dataset
  const scaleFactor = 30 / maxValue; // Scale factor to keep max size reasonable

  const ndata = updatedData?.map((row) => {
    return ({
      x: row[props.xAxis.name],
      y: parseFloat(row[props.yAxis.name]) || 0,
      r: (parseFloat(row[props.bubbleSize.name]) || 0) * scaleFactor
    })
  }) || [];

  return ({
    datasets: [{
      label: props.yAxis.title,
      data: ndata,
      backgroundColor: hexToRgb(COLORS[0], 0.8)
    }],
  });
}

