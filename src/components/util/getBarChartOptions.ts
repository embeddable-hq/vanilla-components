import { Measure } from '@embeddable.com/core';
import { ChartOptions } from 'chart.js';

import formatValue from '../util/format';
import { Props } from './getStackedChartData';

export default function getBarChartOptions({
  displayAsPercentage = false,
  displayHorizontally = false,
  dps = undefined,
  lineMetrics,
  metric,
  metrics,
  results,
  reverseXAxis = false,
  secondAxisTitle = '',
  segment,
  showLabels = false,
  showLegend = false,
  showSecondYAxis = false,
  showTotal = false,
  stackMetrics = false,
  stacked = false,
  xAxis,
  xAxisTitle = '',
  yAxisTitle = '',
}: Partial<Props> & {
  lineMetrics?: Measure[];
  metric?: Measure;
  metrics?: Measure[];
  reverseXAxis?: boolean;
  secondAxisTitle?: string;
  showSecondYAxis?: boolean;
  stackMetrics?: boolean;
  stacked?: boolean;
  xAxisTitle?: string;
  yAxisTitle?: string;
}): ChartOptions<'bar' | 'line'> {
  let top = 0;
  let right = 0;

  // Not-stacked, display vertically, show labels (pad top 20)
  // Not-stacked, display horizontally, show labels (pad right 60)
  // Stacked, display vertically, show total (pad top 20)
  // Stacked, display horizontally, show total (pad right 60)
  if (!stacked) {
    if (displayHorizontally) {
      right = showLabels ? 60 : 0;
    } else {
      top = showLabels ? 20 : 0;
    }
  } else {
    if (displayHorizontally) {
      right = showTotal ? 60 : 0;
    } else {
      top = showTotal ? 20 : 0;
    }
  }

  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: displayHorizontally ? ('y' as const) : ('x' as const),
    layout: {
      padding: {
        left: 0,
        right, // Buffer for data labels
        top, // Buffer for data labels
        bottom: 0,
      },
    },
    scales: {
      y: {
        stacked: stacked || stackMetrics,
        grace: '0%',
        grid: {
          display: false,
        },
        max: displayAsPercentage && !displayHorizontally ? 100 : undefined,
        ticks: {
          //https://www.chartjs.org/docs/latest/axes/labelling.html
          callback: function (value) {
            if (displayAsPercentage && !displayHorizontally) {
              return `${value}%`;
            }

            if (displayHorizontally) {
              return this.getLabelForValue(parseFloat(`${value}`));
            }

            return value;
          },
        },
        title: {
          display: !!yAxisTitle,
          text: yAxisTitle,
        },
      },
      y1: {
        //optional second y-axis for optional line metrics
        display: showSecondYAxis,
        grace: '0%',
        grid: {
          display: false,
        },
        position: 'right',
        title: {
          display: !!secondAxisTitle,
          text: secondAxisTitle,
        },
      },
      x: {
        reverse: reverseXAxis && !displayHorizontally,
        stacked: stacked || stackMetrics,
        grid: {
          display: false,
        },
        max: displayAsPercentage && displayHorizontally ? 100 : undefined,
        ticks: {
          //https://www.chartjs.org/docs/latest/axes/labelling.html
          callback: function (value) {
            if (displayAsPercentage && displayHorizontally) {
              return `${value}%`;
            }

            if (!displayHorizontally) {
              return this.getLabelForValue(parseFloat(`${value}`));
            }

            return value;
          },
        },
        title: {
          display: !!xAxisTitle,
          text: xAxisTitle,
        },
      },
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
          boxHeight: 8,
        },
      },
      tooltip: {
        //https://www.chartjs.org/docs/latest/configuration/tooltip.html
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            //metric needed for formatting
            const metricIndex = context.datasetIndex;
            //a single metric is sometimes passed in (e.g. for stacked bar charts)
            const metricsList = [...(metrics || []), ...(lineMetrics || [])];
            const metricObj = metrics ? metricsList[metricIndex] : metric;
            if (context.parsed && typeof context.parsed === 'object') {
              const axis = displayHorizontally ? 'x' : 'y';
              label += `: ${formatValue(`${context.parsed[axis]}`, {
                type: 'number',
                dps: dps,
                meta: displayAsPercentage ? undefined : metricObj?.meta,
              })}`;
              if (displayAsPercentage) {
                label += '%';
              }
            }
            return label;
          },
        },
      },
      datalabels: {
        labels: {
          total: {
            anchor: displayHorizontally ? 'end' : 'end',
            align: displayHorizontally ? 'right' : 'top',
            display: showTotal ? 'true' : false,
            font: {
              weight: 'bold',
            },
            formatter: (v, context) => {
              // @ts-expect-error - xAxisName is not a property of context.dataset
              const xAxisNames = context.dataset.xAxisNames;
              const currxAxisName = xAxisNames[context.dataIndex];
              // @ts-expect-error - totals is not a property of context.dataset
              const totals = context.dataset.totals;
              const currDatasetIndex = context.datasetIndex;
              if (currDatasetIndex === totals[currxAxisName].lastSegment && v !== null) {
                return totals[currxAxisName].total;
              } else {
                return ''; // has to be here or chartjs decides we want a number on every bart part
              }
            },
          },
          value: {
            //https://chartjs-plugin-datalabels.netlify.app/guide/
            anchor: stacked || stackMetrics ? 'center' : 'end',
            align: stacked || stackMetrics ? 'center' : 'end',
            display: showLabels ? 'true' : false,
            formatter: (v, context) => {
              //metric needed for formatting
              const metricIndex = context.datasetIndex;
              //a single metric is sometimes passed in (e.g. for stacked bar charts)
              const metricsList = [...(metrics || []), ...(lineMetrics || [])];
              const metricObj = metrics ? metricsList[metricIndex] : metric;
              if (v === null) return null;
              let val = formatValue(v, {
                type: 'number',
                dps: dps,
                meta: displayAsPercentage ? undefined : metricObj?.meta,
              });
              if (displayAsPercentage) {
                val += '%';
              }
              return val;
            },
          },
        },
      },
    },
  };
}
