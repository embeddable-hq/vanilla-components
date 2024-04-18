import { DataResponse } from '@embeddable.com/core';
import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React from 'react';
import { Bar } from 'react-chartjs-2';

import { COLORS, EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE } from '../../../constants';
import format from '../../../util/format';
import getBarChartOptions from '../../../util/getBarChartOptions';
import Container from '../../Container';

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

ChartJS.defaults.font.size = parseInt(SMALL_FONT_SIZE);
ChartJS.defaults.color = LIGHT_FONT;
ChartJS.defaults.font.family = EMB_FONT;
ChartJS.defaults.plugins.tooltip.enabled = true;

type Props = {
  results: DataResponse;
  title: string;
  xAxis: {
    name: string;
    meta?: object;
  };
  metrics: { name: string; title: string }[];
};

export default (props: Props) => {
  const { results, title } = props;

  return (
    <Container className="overflow-y-hidden" title={title} results={results}>
      <Bar
        height="100%"
        options={getBarChartOptions({ ...props, stacked: false })}
        data={chartData(props)}
      />
    </Container>
  );
};

function getLabels(data, xAxis) {
  return [
    ...new Set(
      data?.map((d: { [p: string]: string }) =>
        format(d[xAxis?.name || ''], { truncate: 15, meta: xAxis.meta })
      )
    )
  ] as string[];
}

function chartData(props: Props): ChartData<'bar'> {
  const { results, xAxis, metrics, maxSegments, defaultSortDirection, sortBy} = props;

  const newData = mergeLongTail(results?.data, xAxis, metrics, maxSegments, defaultSortDirection, sortBy);

  const labels = getLabels(newData, xAxis);

  return {
    labels,
    datasets:
      metrics?.map((metric, i) => ({
        barPercentage: 0.6,
        barThickness: 'flex',
        maxBarThickness: 15,
        minBarLength: 0,
        borderRadius: 6,
        label: metric.title,
        data: newData?.map((d) => parseInt(d[metric.name])) || [],
        backgroundColor: COLORS[i % COLORS.length]
      })) || []
  };
}

function mergeLongTail(rows, xAxis, metrics, n, defaultSortDirection, sortBy) {

  if(!rows || rows.length === 0) return;
  if (!n || n <= 0 || getLabels(rows, xAxis).length <= n) return rows;

  const newData = [...rows].slice(0, n - 1);

  const otherCategory = {
    [xAxis.name]: 'Other'
  }

  const longTail = [...rows].slice(n - 1).forEach((row) => {
    metrics.forEach((metric) => {
      otherCategory[metric.name] = (parseFloat(otherCategory[metric.name]) || 0) + parseFloat(row[metric.name])
    })
  });

  if (sortBy && defaultSortDirection) return [...insertInSortedOrder(newData, otherCategory, sortBy, defaultSortDirection)]

  newData.push(otherCategory);
  return newData

}

function insertInSortedOrder(array, item, sortBy, sortOrder) {

  function findInsertIndex(arr, item) {
      let low = 0;
      let high = arr.length;

      while (low < high) {
          let mid = Math.floor((low + high) / 2);
          // Adjust comparison based on the sort order
          if (sortOrder === 'Ascending' ? arr[mid][sortBy.name] < item[sortBy.name] : arr[mid][sortBy.name] > item[sortBy.name]) {
              low = mid + 1;
          } else {
              high = mid;
          }
      }
      return low;
  }

    // Find the index at which to insert the item
    const index = findInsertIndex(array, item);

    // Insert the item into the array at the correct index
    array.splice(index, 0, item);
    return array;
}
