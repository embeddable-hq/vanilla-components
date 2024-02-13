import { ChartOptions } from 'chart.js';

export default function getBarChartOptions({
  showLegend = false,
  showLabels = false,
  displayHorizontally = false,
  stacked = false,
  stackMetrics = false,
  displayAsPercentage = false,
  yAxisTitle = '',
  xAxisTitle = ''
}): ChartOptions<'bar'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: displayHorizontally ? ('y' as const) : ('x' as const),
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: showLabels ? 20 : 0, // Added so the highest data labels fits
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
        max: displayAsPercentage ? 100 : undefined,
        ticks: {
          precision: 0,
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
      x: {
        stacked: stacked || stackMetrics,
        grid: {
          display: false
        },
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
            if (context.parsed.y !== null) {
              label += `: ${context.parsed[displayHorizontally ? 'x' : 'y']}`;
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
        display: showLabels ? 'auto' : false
      }
    }
  };
}
