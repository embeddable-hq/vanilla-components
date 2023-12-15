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
import Loading from '../../../util/Loading'
import Error from '../../../util/Error'

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

const COLORS = [
  '#A9DBB0',
  '#F59E54',
  '#F77A5F',
  '#8FCBCF',
  '#C3B0EA',
  ];

const chartOptions = (showLegend) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: showLegend
    }
  },
});

const chartData = (labels, counts) => {
  return {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: COLORS,
        borderColor: COLORS,
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
};

export default (props: Props) => {
  console.log('BasicPieComponent.props', props); 
  const { slice, metric, showLegend, results } = props;
  const { isLoading, data, error } = results;

  if(isLoading) {
    return <Loading />
  }
  if(error) {
    return <Error msg={error}/>;
  }

  // Chart.js pie expects labels like so: ['US', 'UK', 'Germany']
  const labels = data.map(d => d[slice.name]);

  // Chart.js pie expects counts like so: [23, 10, 5]
  const counts = data.map(d => d[metric.name]);

  return <Pie options={chartOptions(showLegend)} 
              data={chartData(labels, counts)} />
};
