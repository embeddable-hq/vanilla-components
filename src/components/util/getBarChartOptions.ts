import { ChartOptions } from 'chart.js';

export default function getBarChartOptions({
  showLegend = false,
  showLabels = false,
  yAxisMin = 0,
  displayHorizontally = false,
  stacked = false,
  stackMetrics = false,
  displayAsPercentage = false
}): ChartOptions<'bar'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: displayHorizontally ? ('y' as const) : ('x' as const), //set to 'y' to make a horizontal barchart
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: showLabels ? 20 : 0, //Added so the highest data labels fits
        bottom: 0
      }
    },
    scales: {
      y: {
        stacked: stacked || stackMetrics,
        min: yAxisMin,
        grace: '0%',
        grid: {
          display: false
        },
        ticks: {
          precision: 0,
          //https://www.chartjs.org/docs/latest/axes/labelling.html
          callback: function (value, index, ticks) {
            if (displayAsPercentage && !displayHorizontally) {
              return `${value}%`;
            }

            if (displayHorizontally) {
              return this.getLabelForValue(parseFloat(`${value}`));
            }

            return value;
          }
        }
      },
      x: {
        stacked: stacked || stackMetrics,
        grid: {
          display: false // display grid lines
        },
        ticks: {
          //https://www.chartjs.org/docs/latest/axes/labelling.html
          callback: function (value, index, ticks) {
            if (displayAsPercentage && displayHorizontally) {
              return `${value}%`;
            } else if (!displayHorizontally) {
              return this.getLabelForValue(parseFloat(`${value}`));
            } else {
              return value;
            }
          }
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
