import { DataResponse } from '@embeddable.com/react';
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React from 'react';
import { Line } from 'react-chartjs-2';

import { COLORS, EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE } from '../../../constants';
import format from '../../../util/format';
import Container from '../../Container';
import { Inputs } from './CompareLineChart.emb';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

type Props = Inputs & {
  results: DataResponse;
  prevResults: DataResponse;
};

type Record = { [p: string]: string };

export default (props: Props) => {
  const { results, title } = props;

  console.log(props.timeFilter, props.prevTimeFilter);

  return (
    <Container className="overflow-y-hidden" title={title} results={results}>
      <Line height="100%" options={chartOptions(props)} data={chartData(props)} />
    </Container>
  );
};

function chartData(props: Props): ChartData<'line'> {
  const { results, prevResults, xAxis, metrics, applyFill } = props;

  const labels = results?.data?.map((d) =>
    format(d[xAxis.name], { type: 'date', meta: xAxis?.meta })
  );

  const lines =
    metrics?.map((yAxis, i) => ({
      xAxisID: 'period',
      label: yAxis.title,
      data: results?.data?.map((d: Record) => d[yAxis.name]),
      backgroundColor: applyFill ? hexToRgb(COLORS[i % COLORS.length]) : COLORS[i % COLORS.length],
      borderColor: COLORS[i % COLORS.length],
      fill: applyFill,
      cubicInterpolationMode: 'monotone' as const
    })) || [];

  const datasets = [
    ...lines,
    ...lines.map((d, i) => {
      const c = saturate(COLORS[i % COLORS.length], 20);

      return {
        ...d,
        xAxisID: 'comparison',
        data: prevResults?.data?.map((d: Record) => d[metrics[i].name]),
        backgroundColor: applyFill ? hexToRgb(c) : c,
        borderColor: c
      };
    })
  ];

  console.log(222, results, prevResults);

  return {
    labels,
    datasets
  };
}

function saturate(hex: string, saturationPercent: number) {
  if (!/^#([0-9a-f]{6})$/i.test(hex)) {
    throw 'Unexpected color format';
  }

  if (saturationPercent < 0 || saturationPercent > 100) {
    throw 'Unexpected color format';
  }

  let saturationFloat = saturationPercent / 100,
    rgbIntensityFloat = [
      parseInt(hex.substr(1, 2), 16) / 255,
      parseInt(hex.substr(3, 2), 16) / 255,
      parseInt(hex.substr(5, 2), 16) / 255
    ];

  let rgbIntensityFloatSorted = rgbIntensityFloat.slice(0).sort(function (a, b) {
      return a - b;
    }),
    maxIntensityFloat = rgbIntensityFloatSorted[2],
    mediumIntensityFloat = rgbIntensityFloatSorted[1],
    minIntensityFloat = rgbIntensityFloatSorted[0];

  if (maxIntensityFloat == minIntensityFloat) {
    // All colors have same intensity, which means
    // the original color is gray, so we can't change saturation.
    return hex;
  }

  // New color max intensity wont change. Lets find medium and weak intensities.
  let newMediumIntensityFloat,
    newMinIntensityFloat = maxIntensityFloat * (1 - saturationFloat);

  if (mediumIntensityFloat == minIntensityFloat) {
    // Weak colors have equal intensity.
    newMediumIntensityFloat = newMinIntensityFloat;
  } else {
    // Calculate medium intensity with respect to original intensity proportion.
    let intensityProportion =
      (maxIntensityFloat - mediumIntensityFloat) / (mediumIntensityFloat - minIntensityFloat);
    newMediumIntensityFloat =
      (intensityProportion * newMinIntensityFloat + maxIntensityFloat) / (intensityProportion + 1);
  }

  let newRgbIntensityFloat: any = [],
    newRgbIntensityFloatSorted = [newMinIntensityFloat, newMediumIntensityFloat, maxIntensityFloat];

  // We've found new intensities, but we have then sorted from min to max.
  // Now we have to restore original order.
  rgbIntensityFloat.forEach(function (originalRgb) {
    let rgbSortedIndex = rgbIntensityFloatSorted.indexOf(originalRgb);
    newRgbIntensityFloat.push(newRgbIntensityFloatSorted[rgbSortedIndex]);
  });

  let floatToHex = function (val) {
      return ('0' + Math.round(val * 255).toString(16)).substr(-2);
    },
    rgb2hex = function (rgb) {
      return '#' + floatToHex(rgb[0]) + floatToHex(rgb[1]) + floatToHex(rgb[2]);
    };

  let newHex = rgb2hex(newRgbIntensityFloat);

  return newHex;
}

// Convert hex to rgb and add opacity. Used when a color-fill is applied beneath the chart line(s).
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}, 0.3)`
    : '';
}

function chartOptions(props: Props): ChartOptions<'line'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: props.showLabels ? 20 : 0, // Added so the highest data labels fits
        bottom: 0
      }
    },
    scales: {
      y: {
        min: props.yAxisMin,
        grace: '0%', // Add percent to add numbers on the y-axis above and below the max and min values
        grid: {
          display: false
        },
        ticks: {
          precision: 0
        },
        title: {
          display: !!props.yAxisTitle,
          text: props.yAxisTitle
        }
      },
      period: {
        grid: {
          display: false
        },
        title: {
          display: !!props.xAxisTitle,
          text: props.xAxisTitle
        }
      },
      comparison: {
        display: false,
        grid: {
          display: false
        },
        title: {
          display: false
        }
      }
    },
    animation: {
      duration: 400,
      easing: 'linear'
    },
    plugins: {
      legend: {
        display: props.showLegend,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxHeight: 8
        }
      },
      datalabels: {
        align: 'top',
        display: props.showLabels ? 'auto' : false
      }
    }
  };
}
