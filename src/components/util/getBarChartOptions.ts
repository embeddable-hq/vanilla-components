import { ChartOptions } from 'chart.js';
import { Measure } from '@embeddable.com/core';
import formatValue from '../util/format';
import { Props } from './getStackedChartData';

export default function getBarChartOptions({
  showLegend = false,
  showLabels = false,
  displayHorizontally = false,
  stacked = false,
  stackMetrics = false,
  displayAsPercentage = false,
  yAxisTitle = '',
  xAxisTitle = '',
  dps = undefined,
  reverseXAxis = false,
  metrics,
  lineMetrics,
  metric,
  showSecondYAxis = false,
  secondAxisTitle = ''
}: Partial<Props> & {
  stacked?: boolean;
  stackMetrics?: boolean;
  yAxisTitle?: string;
  xAxisTitle?: string;
  reverseXAxis?: boolean;
  metrics?: Measure[];
  metric?: Measure;
  showSecondYAxis?: boolean;
  secondAxisTitle?: string;
  lineMetrics?: Measure[];
}): ChartOptions<'bar' | 'line'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: displayHorizontally ? ('y' as const) : ('x' as const),
    layout: {
      padding: {
        left: 0,
        right: showLabels && displayHorizontally && !stacked ? 60 : 0, // Buffer for data labels
        top: showLabels && !stacked && !displayHorizontally ? 20 : 0, // Buffer for data labels
        bottom: 0
      }
    },
    scales: {
      y: {
        stacked: stacked || stackMetrics,
        grace: '0%',
        grid: {
          display: false
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
          }
        },
        title: {
          display: !!yAxisTitle,
          text: yAxisTitle
        }
      },
      y1: {//optional second y-axis for optional line metrics
        display: showSecondYAxis,
        grace: '0%',
        grid: {
          display: false
        },
        position: 'right',
        title: {
          display: !!secondAxisTitle,
          text: secondAxisTitle
        },        
      },
      x: {
        reverse: reverseXAxis && !displayHorizontally,
        stacked: stacked || stackMetrics,
        grid: {
          display: false
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
          }
        },
        title: {
          display: !!xAxisTitle,
          text: xAxisTitle
        }
      }
    },
    animation: {
      duration: 400,
      easing: 'linear'
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
      tooltip: {
        //https://www.chartjs.org/docs/latest/configuration/tooltip.html
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            //metric needed for formatting
            const metricIndex = context.datasetIndex;
            //a single metric is sometimes passed in (e.g. for stacked bar charts)
            const metricsList = [...(metrics || []), ...(lineMetrics||[])];
            const metricObj = metrics ? metricsList[metricIndex] : metric;
            if (context.parsed && typeof context.parsed === 'object') {
              const axis = displayHorizontally ? 'x' : 'y';
              label += `: ${formatValue(`${context.parsed[axis]}`, { 
                type: 'number', 
                dps: dps, 
                meta: displayAsPercentage ? undefined : metricObj?.meta 
              })}`;
              if (displayAsPercentage) {
                label += '%';
              }
            }
            return label;
          }
        }
      },
      datalabels: {
        //https://chartjs-plugin-datalabels.netlify.app/guide/
        anchor: stacked || stackMetrics ? 'center' : 'end',
        align: stacked || stackMetrics ? 'center' : 'end',
        display: showLabels ? 'auto' : false,
        formatter: (v, context) => {
          //metric needed for formatting
          const metricIndex = context.datasetIndex;
          //a single metric is sometimes passed in (e.g. for stacked bar charts)
          const metricsList = [...(metrics || []), ...(lineMetrics||[])];
          const metricObj = metrics ? metricsList[metricIndex] : metric;
          if (v === null) return null;
          let val = formatValue(v, { 
            type: 'number', 
            dps: dps,
            meta: displayAsPercentage ? undefined : metricObj?.meta 
          });
          if (displayAsPercentage) {
            val += '%';
          }
          return val;
        }
      }
    }
  };
}
