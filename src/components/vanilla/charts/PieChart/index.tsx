import { DataResponse } from '@embeddable.com/core';
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React from 'react';
import { Pie } from 'react-chartjs-2';

import { COLORS, EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE } from '../../../constants';
import formatValue from '../../../util/format';
import Container from '../../Container';

ChartJS.register(
  ChartDataLabels,
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
ChartJS.defaults.plugins.tooltip.usePointStyle = true;

type Props = {
  results: DataResponse;
  title: string;
  dps?: number;
  slice: { name: string; meta: object };
  metric: { name: string; title: string };
  showLabels?: boolean;
  showLegend?: boolean;
  maxSegments?: number;
  displayAsPercentage?: boolean;
};

type Record = { [p: string]: string };

export default (props: Props) => {
  const { results, title, enableDownloadAsCSV } = props;

  return (
    <Container
      {...props}
      className="overflow-y-hidden">
      <Pie height="100%" options={chartOptions(props)} data={chartData(props)} />
    </Container>
  );
};

function chartOptions(props: Props): ChartOptions<'pie'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 400,
      easing: 'linear'
    },
    cutout: '45%',
    plugins: {
      datalabels: {
        // Great resource: https://quickchart.io/documentation/chart-js/custom-pie-doughnut-chart-labels/
        display: props.showLabels ? 'auto' : false,
        backgroundColor: '#fff',
        borderRadius: 8,
        font: {
          weight: 'normal'
        },
        formatter: (v) => {
          const val = v ? formatValue(v, { type: 'number', dps: props.dps }) : null;
          return props.displayAsPercentage ? `${val}%` : val;
        }
      },
      tooltip: {
        //https://www.chartjs.org/docs/latest/configuration/tooltip.html
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (context.parsed !== null) {
              label += `: ${formatValue(`${context.parsed || ''}`, {
                type: 'number',
                dps: props.dps
              })}`;
            }
            label = props.displayAsPercentage ? `${label}%` : label;
            return label;
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

function mergeLongTail({ results, slice, metric, maxSegments }: Props) {
  if (!maxSegments || !metric || !slice) return results?.data;

  const newData = [...(results?.data || [])]
    .sort((a, b) => parseInt(b[metric.name]) - parseInt(a[metric.name]))
    .slice(0, maxSegments - 1);

  const sumLongTail = results?.data
    ?.slice(maxSegments - 1)
    .reduce((accumulator, record: Record) => accumulator + parseInt(record[metric.name]), 0);

  newData.push({ [slice.name]: 'Other', [metric.name]: sumLongTail });

  return newData;
}

function chartData(props: Props) {
  const { maxSegments, results, metric, slice, displayAsPercentage } = props;
  const labelsExceedMaxSegments = maxSegments && maxSegments < (results?.data?.length || 0);
  const newData = labelsExceedMaxSegments ? mergeLongTail(props) : results.data;

  // Chart.js pie expects labels like so: ['US', 'UK', 'Germany']
  const labels = newData?.map((d) => formatValue(d[slice.name], { meta: slice?.meta }));


  const sum = displayAsPercentage 
    ? newData?.reduce(
        (accumulator, obj) => accumulator + parseFloat(obj[metric.name]), 0
      )
    : null;

  // Chart.js pie expects counts like so: [23, 10, 5]
  const counts = newData?.map((d: Record) => {
    const metricValue = parseFloat(d[metric.name]);
    const value = displayAsPercentage ? ((metricValue * 100) / sum) : metricValue;
    return formatValue(value, { type: 'number', dps: props.dps })
  });

  return {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: COLORS,
        borderColor: '#fff',
        borderWeight: 5
      }
    ]
  };
}
