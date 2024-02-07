import { Dataset, Dimension, Measure } from '@embeddable.com/core';
import { DataResponse } from '@embeddable.com/react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
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

import { COLORS, EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE } from '../constants';
import { truncateString } from '../util/utilFunctions';

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

const chartOptions = ({
  showLegend = false,
  showLabels = false,
  yAxisMin = 0,
  displayHorizontally = false,
  isBasicStackedComponent = false,
  stackMetrics = false,
  displayAsPercentage = false
}): ChartOptions<'bar'> => ({
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
      stacked: isBasicStackedComponent || stackMetrics,
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
      stacked: isBasicStackedComponent || stackMetrics,
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
      anchor: isBasicStackedComponent || stackMetrics ? 'center' : 'end',
      align: isBasicStackedComponent || stackMetrics ? 'center' : 'end',
      display: showLabels ? 'auto' : false
    }
  }
});

const chartStyle = (isStacked) => {
  return {
    barPercentage: 0.6,
    barThickness: 'flex',
    maxBarThickness: 15,
    minBarLength: 0,
    borderRadius: isStacked ? 3 : 6
  };
};

const stackedChartData = (data, xAxis, metrics, segment, maxSegments, displayAsPercentage) => {
  const labels = [...new Set(data?.map((d) => d[xAxis.name]))] as string[];
  const segments = segmentsToInclude();

  const buildResultMap = () => {
    //populate a reference object like so:
    // {
    //   label1: {
    //     segment1: metric,
    //     segment2: metric, etc
    //   }
    // }

    const resultMap = {};

    labels.forEach((label) => {
      const labelRef = {};
      segments.forEach((s) => (labelRef[s] = null)); // null by default (not 0, to avoid unwanted chart elements)
      resultMap[label] = labelRef;
    });

    data?.forEach((d) => {
      if (segments.includes(d[segment.name])) {
        resultMap[d[xAxis.name]][d[segment.name]] = parseInt(d[metrics.name]);
      } else {
        resultMap[d[xAxis.name]]['Other'] =
          (resultMap[d[xAxis.name]]['Other'] || 0) + parseInt(d[metrics.name]);
      }
    });

    return resultMap;
  };

  const resultMap = buildResultMap();

  return {
    labels: labels.map((l) => truncateString(l)),
    datasets: segments.map((s, i) => ({
      ...chartStyle(true),
      label: s,
      data: labels.map((label) => {
        const segmentValue = resultMap[label][s];
        return displayAsPercentage && segmentValue !== null //skip null values
          ? Math.round(
              (segmentValue * 100) /
                segments.reduce(
                  (accumulator, segment) => resultMap[label][segment] + accumulator,
                  0
                )
            )
          : segmentValue;
      }),
      backgroundColor: COLORS[i % COLORS.length]
    }))
  };

  function segmentsToInclude(): string[] {
    const uniqueSegments = [...new Set(data?.map((d) => d[segment.name]))] as string[];

    if (uniqueSegments.length <= maxSegments || !maxSegments || maxSegments < 1) {
      return uniqueSegments;
    }

    // Reduce to maxSegments, comprising the segments with the highest total and an 'Other' segment merging the longtail segments.
    const segmentTotals = {};

    data?.forEach(
      (d) =>
        (segmentTotals[d[segment.name]] =
          (segmentTotals[d[segment.name]] || 0) + parseInt(d[metrics.name]))
    );

    const summedSegments = Object.keys(segmentTotals)
      .map((item) => {
        return {
          name: item,
          value: segmentTotals[item]
        };
      })
      .sort((a, b) => b.value - a.value);

    const segmentsToInclude = summedSegments.slice(0, maxSegments).map((s) => s.name);

    segmentsToInclude.push('Other');

    return segmentsToInclude;
  }
};

const chartData = (data, xAxis, metrics) => {
  const labels = data?.map((d) => truncateString(d[xAxis.name]));
  return {
    labels,
    datasets: metrics.map((metric, i) => ({
      ...chartStyle(false),
      label: metric.title,
      data: data?.map((d) => parseInt(d[metric.name])),
      backgroundColor: COLORS[i % COLORS.length]
    }))
  };
};

type Props = {
  title?: string;
  showLegend?: boolean;
  ds?: Dataset;
  xAxis?: Dimension;
  metrics?: Measure[];
  results: DataResponse;
  showLabels?: boolean;
  yAxisMin?: number;
  isBasicStackedComponent?: boolean;
  segment?: Dimension;
  stackMetrics?: boolean;
  displayAsPercentage?: boolean;
  displayHorizontally?: boolean;
  maxSegments?: number;
};

export default (props: Props) => {
  const {
    results,
    xAxis,
    metrics,
    showLegend,
    showLabels,
    yAxisMin,
    displayHorizontally,
    isBasicStackedComponent,
    segment,
    maxSegments,
    stackMetrics,
    displayAsPercentage
  } = props;
  const { data } = results;

  return (
    <Bar
      options={chartOptions({
        showLegend,
        showLabels,
        yAxisMin,
        displayHorizontally,
        isBasicStackedComponent,
        stackMetrics,
        displayAsPercentage
      })}
      data={
        isBasicStackedComponent && segment
          ? stackedChartData(data, xAxis, metrics, segment, maxSegments, displayAsPercentage)
          : chartData(data, xAxis, metrics)
      }
    />
  );
};
