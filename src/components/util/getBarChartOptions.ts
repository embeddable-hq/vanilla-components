import { DataResponse, Measure } from '@embeddable.com/core';
import { ChartDataset, ChartOptions } from 'chart.js';

import formatValue from '../util/format';
import { setYAxisStepSize } from './chartjs/common';
import { Props } from './getStackedChartData';

// We're adding a few properties to use when showing totals on the chart
type ExtendedChartDataset = ChartDataset<'bar' | 'line'> & {
  totals?: { [key: string]: { total: number; lastSegment: number | null } };
  xAxisNames?: string[];
};

const getPadding = (
  showLabels: boolean,
  showTotals: boolean,
  stacked: boolean,
  displayHorizontally: boolean,
) => {
  let left = 0;
  let right = 0;
  let top = 0;
  const bottom = 0;
  if (!stacked) {
    if (displayHorizontally) {
      right = showLabels ? 60 : 0;
      left = showLabels ? 60 : 0;
    } else {
      top = showLabels ? 20 : 0;
    }
  } else {
    if (displayHorizontally) {
      right = showTotals ? 60 : 0;
      left = showTotals ? 60 : 0;
    } else {
      top = showTotals ? 20 : 0;
    }
  }
  return { left, right, top, bottom };
};

export default function getBarChartOptions({
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
  showTotals = false,
  stackMetrics = false,
  stacked = false,
  xAxis,
  xAxisTitle = '',
  yAxisTitle = '',
  displayAsPercentage = false,
  isGroupedBar,
  stackBars,  
}: Partial<Props> & {
  lineMetrics?: Measure[];
  metric?: Measure;
  metrics?: Measure[];
  results?: DataResponse;
  reverseXAxis?: boolean;
  secondAxisTitle?: string;
  showSecondYAxis?: boolean;
  stackMetrics?: boolean;
  stacked?: boolean;
  xAxisTitle?: string;
  yAxisTitle?: string;
  isGroupedBar?: boolean;
  stackBars?: boolean;
}): ChartOptions<'bar' | 'line'> {

  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: displayHorizontally ? ('y' as const) : ('x' as const),
    layout: {
      padding: getPadding(showLabels, showTotals, stacked, displayHorizontally),
    },
    scales: {
      y: {
        stacked: stacked || stackMetrics,
        grace: '0%',
        grid: {
          display: false,
        },
        max: (displayAsPercentage && !displayHorizontally) 
          ? (isGroupedBar 
              ? (stackBars ? 100 : undefined) 
              : 100)
          : undefined,
        afterDataLimits: function (axis) {
          //Disable fractions unless they exist in the data.
          const metricsGroup = [
            ...(metric !== undefined ? [metric] : []),
            ...(metrics || []),
            ...(lineMetrics && !showSecondYAxis ? lineMetrics : []),
          ];
          setYAxisStepSize(axis, results, metricsGroup, dps);
        },
        ticks: {
          //https://www.chartjs.org/docs/latest/axes/labelling.html
          callback: function (value) {
            if (displayHorizontally) {
              return this.getLabelForValue(parseFloat(`${value}`));
            }

            return displayAsPercentage
              ? `${value}%`
              : formatValue(typeof value === 'number' ? value.toString() : value, {
                  type: 'number',
                });
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
        afterDataLimits: function (axis) {
          //Disable fractions unless they exist in the data.
          const metricsGroup = [...(lineMetrics && showSecondYAxis ? lineMetrics : [])];
          setYAxisStepSize(axis, results, metricsGroup, dps);
        },
      },
      x: {
        reverse: reverseXAxis && !displayHorizontally,
        stacked: stacked || stackMetrics,
        grid: {
          display: false,
        },
        max: displayAsPercentage && displayHorizontally 
          ? (isGroupedBar 
              ? stackBars ? 100 : undefined
              : 100)
          : undefined,
        ticks: {
          //https://www.chartjs.org/docs/latest/axes/labelling.html
          callback: function (value) {
            if (!displayHorizontally) {
              return this.getLabelForValue(parseFloat(`${value}`));
            }

            return displayAsPercentage
              ? `${value}%`
              : formatValue(typeof value === 'number' ? value.toString() : value, {
                  type: 'number',
                });
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
            anchor: (context) => {
              const dataset = context.dataset as ExtendedChartDataset;
              const totals = dataset.totals;
              if (!totals) {
                return 'end';
              }
              const currXAxisName = dataset.xAxisNames?.[context.dataIndex];
              const currTotal = totals[currXAxisName || '']?.total;
              if (currTotal && currTotal < 0) {
                return 'start';
              }
              return 'end';
            },
            align: (context) => {
              const dataset = context.dataset as ExtendedChartDataset;
              const totals = dataset.totals;
              if (!totals) {
                return displayHorizontally ? 'right' : 'top';
              }
              const currXAxisName = dataset.xAxisNames?.[context.dataIndex];
              const currTotal = totals[currXAxisName || '']?.total;
              if (currTotal && currTotal < 0) {
                return displayHorizontally ? 'left' : 'bottom';
              }
              return displayHorizontally ? 'right' : 'top';
            },
            display: showTotals ? 'true' : false,
            font: {
              weight: 'bold',
            },
            formatter: (v, context) => {
              const dataset = context.dataset as ExtendedChartDataset;
              const xAxisNames = dataset.xAxisNames;
              const totals = dataset.totals;
              if (!totals || !xAxisNames) {
                return '';
              }
              const currxAxisName = xAxisNames[context.dataIndex];
              const currDatasetIndex = context.datasetIndex;
              if (currDatasetIndex === totals[currxAxisName].lastSegment && v !== null) {
                let val = formatValue(totals[currxAxisName].total.toString(), {
                  type: 'number',
                  dps: dps,
                  meta: displayAsPercentage ? undefined : metric?.meta,
                });
                if (displayAsPercentage) {
                  val += '%';
                }
                return val;
              } else {
                return ''; // has to be here or chartjs decides we want a number on every bart part
              }
            },
          },
          value: {
            //https://chartjs-plugin-datalabels.netlify.app/guide/
            anchor: stacked || stackMetrics ? 'center' : 'end',
            align: stacked || stackMetrics ? 'center' : 'end',
            display: showLabels ? 'auto' : false,
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
