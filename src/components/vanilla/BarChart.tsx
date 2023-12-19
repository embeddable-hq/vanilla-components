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

const chartOptions = (showLegend, showLabels, yAxisMin, displayHorizontally) => ({
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
      min: yAxisMin, 
      grace: '0%', //add percent to add numbers on the y-axis above and below the max and min values
      grid: {
        display: false, // display grid lines
      }
    },
    x: {
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
    datalabels: {
      anchor: 'end',
      align: 'end',
      display: showLabels ? 'auto' : false,
    }
  },
});

const chartData = (data, xAxis, metrics) => {
  const labels = data?.map(d => truncateString(d[xAxis.name]));
  return {
    labels,
    datasets: metrics.map((yAxis, i) =>
      ({
        label: yAxis.title,
        data: data?.map(d => parseInt(d[yAxis.name])),
        backgroundColor: COLORS[i % COLORS.length],
        barPercentage: 0.6,
        barThickness: 'flex',
        maxBarThickness: 15,
        minBarLength: 0,
        borderRadius: 8
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
};

export default (props: Props) => {

  const { results, xAxis, metrics, showLegend, showLabels, yAxisMin, displayHorizontally } = props;
  const { data } = results;

  return (
    <Bar
      options={chartOptions(showLegend, showLabels, yAxisMin, displayHorizontally)} 
      data={chartData(data, xAxis, metrics)} 
    />
  );
};
