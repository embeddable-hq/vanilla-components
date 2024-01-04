import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { Dimension, Measure, Dataset } from "@embeddable.com/core";
import { DataResponse } from "@embeddable.com/react";
import { COLORS, EMB_FONT, SMALL_FONT_SIZE, LIGHT_FONT } from '../constants';
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

//global chart settings
ChartJS.defaults.font.size = parseInt(SMALL_FONT_SIZE); 
ChartJS.defaults.color = LIGHT_FONT; 
ChartJS.defaults.font.family = EMB_FONT;
ChartJS.defaults.plugins.tooltip.enabled = true;

const chartOptions = (showLegend, showLabels, yAxisMin, displayHorizontally, isBasicStackedComponent, stackMetrics, displayAsPercentage) => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: displayHorizontally ? 'y' : 'x', //set to 'y' to make a horizontal barchart
  layout: {
    padding: {
        left: 0,
        right: 0,
        top: showLabels ? 20 : 0, //Added so the highest data labels fits
        bottom: 0
    }
  },
  scale: {
    ticks: {
      precision: 0, //rounding for y-axis values
    },
  },
  scales: {
    y: {
      stacked: isBasicStackedComponent || stackMetrics,
      min: yAxisMin, 
      grace: '0%',
      grid: {
        display: false, 
      },
      ticks: { //https://www.chartjs.org/docs/latest/axes/labelling.html
        callback: function(value, index, ticks) {
           if(displayAsPercentage && !displayHorizontally) {
            return `${value}%`;
          } else if (displayHorizontally) {
            return this.getLabelForValue(value);
          } else {
            return value;
          }
        },
      }
    },
    x: {
      stacked: isBasicStackedComponent || stackMetrics,
      grid: {
        display: false, // display grid lines
      }
    }
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
        boxHeight: 8
      }
    },
    tooltip: {//https://www.chartjs.org/docs/latest/configuration/tooltip.html
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (context.parsed.y !== null) {
            label += `: ${context.parsed[displayHorizontally ? 'x' : 'y']}`;
            if (displayAsPercentage) {
              label += "%";
            }
          }
          return label;
        },
      },
    },
    datalabels: { //https://chartjs-plugin-datalabels.netlify.app/guide/
      anchor: isBasicStackedComponent || stackMetrics ? 'center' : 'end',
      align: isBasicStackedComponent || stackMetrics ?'center' : 'end',
      display: showLabels ? 'auto' : false,
    }
  },
});

const chartStyle = (isStacked) => {
  return {
    barPercentage: 0.6,
    barThickness: 'flex',
    maxBarThickness: 15,
    minBarLength: 0,
    borderRadius: isStacked ? 3 : 6
  }
}

const stackedChartData = (data, xAxis, metrics, segment, maxSegments, displayAsPercentage) => {

    const segmentsToInclude = () => {

      const uniqueSegments = [...new Set(data?.map(d => d[segment.name]))];
      if ((uniqueSegments.length <= maxSegments) || !maxSegments || maxSegments < 1) {
        return uniqueSegments;
      } else {
        //reduce to maxSegments, comprising the segments with the highest total and an 'Other' segment merging the longtail segments.
        const segmentTotals = {};
        data?.forEach(d => segmentTotals[d[segment.name]] = ((segmentTotals[d[segment.name]] || 0) + parseInt(d[metrics.name])));
        const summedSegments = Object.keys(segmentTotals).map(item => { 
          return {
            name: item, 
            value: segmentTotals[item] 
          }
        }).sort((a, b) => b.value - a.value);
        const segmentsToInclude = summedSegments.slice(0, maxSegments).map(s => s.name);
        segmentsToInclude.push('Other');
        return segmentsToInclude;
      }      
    }


    const labels = [...new Set(data?.map(d => d[xAxis.name]))];
    const segments = segmentsToInclude();//[...new Set(data?.map(d => d[segment.name]))];

    
    const buildResultMap = () => {
      //populate a reference object like so:
      // {
      //   label1: {
      //     segment1: metric,
      //     segment2: metric, etc
      //   }
      // }
      const resultMap = {};
      labels.forEach(label => {
        const labelRef = {};
        segments.forEach(s => labelRef[s] = null); //null by default (not 0, to avoid unwanted chart elements)
        resultMap[label] = labelRef; 
      }) 
      data?.forEach(d => {
        if (segments.includes(d[segment.name])) {
          resultMap[d[xAxis.name]][d[segment.name]] = parseInt(d[metrics.name]);
        } else {
          resultMap[d[xAxis.name]]['Other'] = (resultMap[d[xAxis.name]]['Other'] || 0) + parseInt(d[metrics.name]);
        }
      });

      console.log(resultMap);
      return resultMap;
    }

  const resultMap = buildResultMap();

  return {
    labels: labels.map(l => truncateString(l)),
    datasets: segments.map((s, i) =>
      ({
        ...chartStyle(true),
        label: s,
        data: labels.map(label => {
          const segmentValue = resultMap[label][s];
          return displayAsPercentage && segmentValue !== null //skip null values
            ? Math.round(((segmentValue * 100) / segments.reduce((accumulator, segment) => resultMap[label][segment] + accumulator,0)))
            : segmentValue
        }),
        backgroundColor: COLORS[i % COLORS.length],
      })
    ),
  };
}

const chartData = (data, xAxis, metrics) => {
  const labels = data?.map(d => truncateString(d[xAxis.name]));
  return {
    labels,
    datasets: metrics.map((metric, i) =>
      ({
        ...chartStyle(false),
        label: metric.title,
        data: data?.map(d => parseInt(d[metric.name])),
        backgroundColor: COLORS[i % COLORS.length],
      })
    ),
  };
}

type Props = {
  title?: string;
  showLegend?: boolean;
  ds?: Dataset;
  xAxis?: Dimension; // { name, title }
  metrics?: Measure; // [{ name, title }]
  results?: DataResponse; // { isLoading, error, data: [{ <name>: <value>, ... }] }
  showLabels?: boolean;
  yAxisMin?:number;
  isBasicStackedComponent?: boolean;
  segment?: Dimension;
  stackMetrics?: boolean;
  displayAsPercentage?: boolean;
};

export default (props: Props) => {

  const { results, xAxis, metrics, showLegend, showLabels, yAxisMin, displayHorizontally, isBasicStackedComponent, segment, maxSegments, stackMetrics, displayAsPercentage } = props;
  const { data } = results;

  return (
    <Bar
      options={chartOptions(showLegend || false, showLabels || false, yAxisMin, displayHorizontally || false, isBasicStackedComponent || false, stackMetrics, displayAsPercentage)} 
      data={isBasicStackedComponent && segment 
        ? stackedChartData(data, xAxis, metrics, segment, maxSegments, displayAsPercentage)
        : chartData(data, xAxis, metrics)} 
    />
  );
};
