import { Bar } from 'react-chartjs-2';
import React, { useEffect, useMemo } from 'react';
import { Dimension, Measure, Dataset } from '@embeddable.com/core';
import { Chart, Title, Legend, Tooltip, BarElement, LinearScale, CategoryScale } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Results = {
  error?: string;
  isLoading: boolean;
  data?: { [key: string]: string }[];
};

type Props = {
  ds?: Dataset;
  title?: string;
  yAxis?: Measure;
  xAxis?: Dimension;
  showLegend?: boolean;
  results: Results;
};

export default (props: Props) => {
  const { results, xAxis, yAxis, title, showLegend } = props;
  const { isLoading, data, error } = results;

  useEffect(() => {
    console.log(props); // TODO: Remove logs
  }, [props]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: !!showLegend
        },
        title: {
          text: title,
          display: true
        }
      }
    }),
    [title, showLegend]
  );

  const bars = useMemo(
    () => ({
      labels: data?.map((d) => d[xAxis?.name || '']) || [],
      datasets: [
        {
          label: yAxis?.title || '',
          backgroundColor: 'rgba(53, 162, 235, 0.7)',
          data: data?.map((d) => d[yAxis?.name || ''] || '') || []
        }
      ]
    }),
    [data, xAxis, yAxis]
  );

  if (!data || isLoading) return <div>Loading...</div>;

  if (error) return <div>Unexpected error: {error}</div>;

  return (
    <div>
      <Bar options={options} data={bars} />
    </div>
  );
};
