import Container from '../../Container';
import useTimeseries from '../../../hooks/useTimeseries';
import { DataResponse, Dataset, Dimension, Granularity, Measure } from '@embeddable.com/core';
import {
  CategoryScale,
  ChartData,
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

};

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

function chartOptions(props: Props, updatedData, bubbleData) {

  const data = bubbleData.datasets[0].data;

  //base y-axis padding on size of first item
  const firstItemRadius = props.reverseXAxis
  ? (props.isTimeDimension ? data?.[0]?.r : data?.[data.length - 1]?.r)
  : (props.isTimeDimension ? data?.[data.length - 1]?.r : data?.[0]?.r);

  //base top padding on size of top vertical item
    const highestItem = data?.reduce((max, current) => (current.y > max.y ? current : max), data[0]);
    const highestItemRadius = highestItem?.r;

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 400,
      easing: 'linear'
    },
    cutout: '45%',
    scales: {
      y: {
        grid: {
          display: false
        },
        ticks: {
          stepSize: 1,
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
        top: highestItemRadius + (props.showLabels ? 30 : 0), // TODO - Buffer for data labels
        bottom: 0
      }
    },
    plugins: {
      datalabels: {
        display: props.showLabels ? 'auto' : false, //TODO
        anchor: 'end',
        align: 'end',
        font: {
          weight: 'normal'
        },
        formatter: (_, {dataIndex}) => {
          const v = updatedData[dataIndex][props.bubbleSize.name] || 0;
          const val = formatValue(v, { type: 'number', dps: props.dps || 0 }) || null;
          return val;
        }
      },
      tooltip: {
        //https://www.chartjs.org/docs/latest/configuration/tooltip.html
        callbacks: {
          label: function (context) {
            //xAxis label
            const yAxisLabel = context.dataset.label || '';
            const yAxisValue = formatValue((context.raw.y || ''), {
                type: 'number',
                dps: props.dps
              });
            //Bubble size label
            const bubbleSizeLabel = props.bubbleSize.title;
            const bubbleSizeValue = updatedData[context.dataIndex][props.bubbleSize.name] || 0;
            const bubbleSizeValueFormatted = formatValue((bubbleSizeValue), {
                type: 'number',
                dps: props.dps
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

function chartData(props: Props, updatedData) {

  const bubbleRadiusValue = updatedData?.map(row => {
    const value = row[props.bubbleSize.name];
    return value ? parseInt(value) : 0
  }) || [];

  const maxValue = Math.max(...bubbleRadiusValue); // Replace `data` with your dataset
  const scaleFactor = 30 / maxValue; // Scale factor to keep max size reasonable

  const ndata = updatedData?.map((row) => {
    return ({
      x: row[props.xAxis.name],
      y: parseInt(row[props.yAxis.name]) || 0,
      r: (parseInt(row[props.bubbleSize.name]) || 0) * scaleFactor
    })
  })

  return ({
    datasets: [{
      label: props.yAxis.title,
      data: ndata,
      backgroundColor: hexToRgb(COLORS[0], 0.8)
    }],
  });
}


