import { DataResponse } from '@embeddable.com/react';
import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
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

import { COLORS, EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE } from '../../../constants';
import getBarChartOptions from '../../../util/getBarChartOptions';
import Container from '../../Container';
import { Inputs } from './StackedBarChart.emb';

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

type Props = Inputs & {
  results: DataResponse;
};

export default (props: Props) => {
  const { results, title } = props;

  return (
    <Container title={title} results={results}>
      <Bar options={getBarChartOptions({ ...props, stacked: true })} data={chartData(props)} />
    </Container>
  );
};

function chartData(props: Props): ChartData<'bar'> {
  const { results, xAxis, metric, segment, maxSegments, displayAsPercentage } = props;
  const labels = [...new Set(results?.data?.map((d: Record) => d[xAxis?.name || '']))] as string[];
  const segments = segmentsToInclude();
  const resultMap = {};

  // Populate a reference object like so:
  // {
  //   label1: {
  //     segment1: metric,
  //     segment2: metric, etc
  //   }
  // }

  labels.forEach((label) => {
    const labelRef = {};

    segments.forEach((s) => (labelRef[s] = null)); // Default is null not 0, to avoid unwanted chart elements

    resultMap[label] = labelRef;
  });

  results?.data?.forEach((d) => {
    const seg = d[segment?.name || ''];
    const axis = d[xAxis?.name || ''];
    const met = d[metric?.name || ''];

    if (segments.includes(seg)) {
      resultMap[axis][seg] = parseInt(met);
    } else {
      resultMap[axis]['Other'] = (resultMap[axis]['Other'] || 0) + parseInt(met);
    }
  });

  return {
    labels: labels.map((l) => (l?.length > 15 ? `${l.substring(0, 15)}...` : l)),
    datasets: segments.map((s, i) => ({
      barPercentage: 0.6,
      barThickness: 'flex',
      maxBarThickness: 15,
      minBarLength: 0,
      borderRadius: 3,
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

  type Record = { [p: string]: string };

  function segmentsToInclude(): string[] {
    const uniqueSegments = [
      ...new Set(results?.data?.map((d: Record) => d[segment?.name || ''] || 'No value'))
    ] as string[];

    if (!maxSegments || uniqueSegments.length <= maxSegments || maxSegments < 1) {
      return uniqueSegments;
    }

    // Reduce to maxSegments, comprising the segments with the highest total and an 'Other' segment merging the longtail segments.
    const segmentTotals = {};

    results?.data?.forEach(
      (d) =>
        (segmentTotals[d[segment?.name || '']] =
          (segmentTotals[d[segment?.name || '']] || 0) + parseInt(d[metric?.name || '']))
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
}
