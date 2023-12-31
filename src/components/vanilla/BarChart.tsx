import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { Dimension, Measure, Dataset } from "@embeddable.com/core";
import { DataResponse } from "@embeddable.com/react";
import { COLORS, EMB_FONT, SMALL_FONT_SIZE, LIGHT_FONT } from '../constants';
import { truncateString } from '../util/utilFunctions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

//global chart settings
ChartJS.defaults.font.size = parseInt(SMALL_FONT_SIZE); 
ChartJS.defaults.color = LIGHT_FONT; 
ChartJS.defaults.font.family = EMB_FONT;
ChartJS.defaults.plugins.tooltip.enabled = true;

const chartOptions = (showLegend, showLabels, yAxisMin, displayHorizontally, isBasicStackedComponent) => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: displayHorizontally ? 'y' : 'x', //set to 'y' to make a horizontal barchart
  layout: {
    padding: {
        left: 0,
        right: 0,
        top: showLabels ? 20 : 0, //Added so the highest data labels fits
        bottom: 0
    }
  },
  scale: {
    ticks: {
      precision: 0, //rounding for y-axis values
    },
  },
  scales: {
    y: {
      stacked: isBasicStackedComponent,
      min: yAxisMin, 
      grace: '0%', //add a buffer on the y-axis above and below the max and min values
      grid: {
        display: false, // display grid lines
      }
    },
    x: {
      stacked: isBasicStackedComponent,
      grid: {
        display: false, // display grid lines
      }
    }
  },
  animation: {
    duration: 400,
    easing: 'linear',
  },
  plugins: {
    legend: {
      display: showLegend,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        boxHeight: 8
      }
    },
    datalabels: { //https://chartjs-plugin-datalabels.netlify.app/guide/
      anchor: isBasicStackedComponent ? 'center' : 'end',
      align: isBasicStackedComponent ?'center' : 'end',
      display: showLabels ? 'auto' : false,
    }
  },
});

const chartStyle = {
    barPercentage: 0.6,
    barThickness: 'flex',
    maxBarThickness: 15,
    minBarLength: 0,
    borderRadius: 8
}

const stackedChartData = (data, xAxis, metrics, segment) => {
    const labels = [...new Set(data?.map(d => truncateString(d[xAxis.name])))];
    const segments = [...new Set(data?.map(d => d[segment.name]))];

    const buildResultMap = () => {
      //populate a reference object like so:
      // {
      //   label1: {
      //     segment1: metric,
      //     segment2: metric, etc
      //   }
      // }
      const resultMap = {};
      labels.forEach(label => {
        const labelRef = {};
        segments.forEach(s => labelRef[s] = null); //null by default, as each segment needs to be included even if there's no data. 
        resultMap[label] = labelRef; 
      }) 
      data?.forEach(d => resultMap[d[xAxis.name]][d[segment.name]] = parseInt(d[metrics[0].name]));
      console.log(resultMap);
      return resultMap;
    }

  const resultMap = buildResultMap();


  return {
    labels,
    datasets: segments.map((s, i) =>
      ({
        ...chartStyle,
        label: s,
        data: labels.map(label => resultMap[label][s]),
        backgroundColor: COLORS[i % COLORS.length],
      })
    ),
  };
}

const chartData = (data, xAxis, metrics) => {
  const labels = data?.map(d => truncateString(d[xAxis.name]));
  return {
    labels,
    datasets: metrics.map((metric, i) =>
      ({
        ...chartStyle,
        label: metric.title,
        data: data?.map(d => parseInt(d[metric.name])),
        backgroundColor: COLORS[i % COLORS.length],
      })
    ),
  };
}

type Props = {
  title?: string;
  showLegend?: boolean;
  ds?: Dataset;
  xAxis?: Dimension; // { name, title }
  metrics?: Measure; // [{ name, title }]
  results?: DataResponse; // { isLoading, error, data: [{ <name>: <value>, ... }] }
  showLabels?: boolean;
  yAxisMin?:number;
  isBasicStackedComponent?: boolean;
  segment?: Dimension;
};

export default (props: Props) => {

  const { results, xAxis, metrics, showLegend, showLabels, yAxisMin, displayHorizontally, isBasicStackedComponent, segment } = props;
  const { data } = results;

  return (
    <Bar
      options={chartOptions(showLegend || false, showLabels || false, yAxisMin, displayHorizontally || false, isBasicStackedComponent || false)} 
      data={isBasicStackedComponent && segment 
        ? stackedChartData(data, xAxis, metrics, segment)
        : chartData(data, xAxis, metrics)} 
    />
  );
};
