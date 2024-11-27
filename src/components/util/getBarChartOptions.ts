import { Measure } from '@embeddable.com/core';
import { ChartOptions } from 'chart.js';

import formatValue from '../util/format';
import { Props } from './getStackedChartData';

type TotalsMap = {
  [axisName: string]: {
    total: number;
    datasetIndex: number;
    loopTotal?: number;
  };
};

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
  // Generate totals Map
  const totalsMap: TotalsMap = {};
  const dataMap: {
    [dataIndex: number]: number;
  } = {};
  let totalLoops = 0;
  const metricName = metric?.name || '';
  const axisName = xAxis?.name || '';
  if (metricName && axisName) {
    let i = 0;
    let dataCount = 0;
    const segmentNames = new Set<string>();
    results?.data?.forEach((d: { [key: string]: any }) => {
      console.log(d);
      const currSegmentName = d[segment?.name || ''];
      const currAxisName = d[axisName];
      const currValue = parseInt(d[metricName], 10);
      if (totalsMap[currAxisName]) {
        totalsMap[currAxisName].total += currValue;
        dataMap[dataCount] = i;
        dataCount++;
      } else {
        totalsMap[currAxisName] = { datasetIndex: i, total: currValue };
        if (!segmentNames.has(currSegmentName)) {
          segmentNames.add(currSegmentName);
        }
        dataMap[dataCount] = i;
        dataCount = 0;
        i++;
      }
    });
    totalLoops = segmentNames.size;
  }

  // NOTE TO SELF
  /*
  So here's the deal: you need to create a map between data index and dataset index, so you can tell what the LAST dataset index is that has a value, and then you can use that index number to position the total label correctly. 
  */

  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: displayHorizontally ? ('y' as const) : ('x' as const),
    layout: {
      padding: {
        left: 0,
        right: showLabels && displayHorizontally && !stacked ? 60 : 0, // Buffer for data labels
        top: showLabels && !stacked && !displayHorizontally ? 20 : 0, // Buffer for data labels
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
            anchor: 'end',
            align: 'top',
            display: showTotal ? 'true' : false,
            color: 'red',
            formatter: (v, context) => {
              // console.log(dataMap);
              const idx = context.dataIndex;
              if (context.datasetIndex !== totalLoops - 1) {
                return;
              }
              const findTotal = (i: number) => {
                const obj = Object.values(totalsMap).find((t) => t.datasetIndex === i);
                return obj?.total || 0;
              };
              const total = findTotal(idx).toString();
              let val = formatValue(total, {
                type: 'number',
                dps: dps,
                meta: displayAsPercentage ? undefined : metric?.meta,
              });
              if (displayAsPercentage) {
                val += '%';
              }
              return val;
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
