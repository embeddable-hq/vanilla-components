import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Dimension, Measure, Dataset } from "@embeddable.com/core";
import { DataResponse } from "@embeddable.com/react";
import ChartContainer from '../../ChartContainer'
import { COLORS, EMB_FONT, SMALL_FONT_SIZE, LIGHT_FONT } from '../../../constants';
import { truncateString } from '../../../util/utilFunctions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.defaults.font.size = parseInt(SMALL_FONT_SIZE); 
ChartJS.defaults.color = LIGHT_FONT; 
ChartJS.defaults.font.family = EMB_FONT;
ChartJS.defaults.plugins.tooltip.enabled = true;
ChartJS.defaults.plugins.tooltip.usePointStyle = true; //https://www.chartjs.org/docs/latest/configuration/tooltip.html

const chartOptions = (showLegend, showLabels) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 400,
    easing: 'linear',
  },
  cutout: "45%",
  plugins: {
    datalabels: {//great resource: https://quickchart.io/documentation/chart-js/custom-pie-doughnut-chart-labels/
      display: showLabels,
      backgroundColor: '#fff',
      borderRadius: 8,
      font: {
        weight: "normal"
      }
    },
    legend: {
      display: showLegend,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        boxHeight: 10
      }
    },
  },
});


const mergeLongTail = (data, slice, metric, maxSegments) => {
  const newData = [...data]
    .sort((a,b) => parseInt(b[metric.name]) - parseInt(a[metric.name]))
    .slice(0, maxSegments-1);
  const sumLongTail = [...data]
    .slice(maxSegments-1)
    .reduce((accumulator, record) => accumulator + parseInt(record[metric.name]), 0);
  newData.push({ [slice.name]: 'Other', [metric.name]: sumLongTail })
  return newData;
}

const chartData = (data, slice, metric, maxSegments) => {

  const labelsExceedMaxSegments = maxSegments && maxSegments < data.length;
  const newData = labelsExceedMaxSegments 
    ? mergeLongTail(data, slice, metric, maxSegments)
    : [...data];
  // Chart.js pie expects labels like so: ['US', 'UK', 'Germany']
  const labels = newData?.map(d => truncateString(d[slice.name]));
  // Chart.js pie expects counts like so: [23, 10, 5]
  const counts = newData?.map(d => d[metric.name]);

  return {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: COLORS,
        borderColor: "#fff",
        borderWeight: 5,
      }
    ]
  };
}

type Props = {
  ds: Dataset;
  slice: Dimension; // { name, title }
  metric: Measure; // [{ name, title }]
  results: DataResponse; // { isLoading, error, data: [{ <name>: <value>, ... }] }
  showLegend: boolean;
  title?: string;
  maxSegments?: number;
  showLabels?: boolean;
};

export default (props: Props) => {
  const { slice, metric, showLegend, results, title, maxSegments, showLabels } = props;
  const { data } = results;

  return (
    <ChartContainer title={title} results={results}>
      <Pie options={chartOptions(showLegend, showLabels)} 
              data={chartData(data || [], slice, metric, maxSegments)} />
    </ChartContainer>
  )
};
