import { DataResponse, Dataset, Dimension, Granularity, Measure } from '@embeddable.com/core';
import { ChartData } from 'chart.js';

import { COLORS, DATE_DISPLAY_FORMATS } from '../constants';
import formatValue from '../util/format';

type DatasetsMeta = {
  [key: string]: boolean | string | number;
};

export type Props = {
  displayAsPercentage?: boolean;
  displayHorizontally?: boolean;
  dps?: number;
  ds?: Dataset;
  granularity?: Granularity;
  isTSGroupedBarChart?: boolean;
  maxSegments?: number;
  metric: Measure;
  results: DataResponse;
  segment: Dimension;
  showLabels?: boolean;
  showLegend?: boolean;
  showTotals?: boolean;
  title?: string;
  totals?: { [key: string]: { total: number; lastSegment: number | null } };
  useCustomDateFormat?: boolean;
  xAxis: Dimension;
  xAxisTitle?: string;
  yAxisMin?: number;
  yAxisTitle?: string;
  isGroupedBar?: boolean;
  stackBars?: boolean;
};

type Options = {
  chartType?: string;
};

type LabelRef = {
  [key: string]: number | null;
};

export default function getStackedChartData(
  props: Props,
  datasetsMeta: DatasetsMeta,
  options?: Options,
): ChartData<'line' | 'bar', (number | null)[], unknown> {
  const {
    displayAsPercentage,
    granularity,
    maxSegments,
    metric,
    results,
    segment,
    showTotals,
    totals,
    useCustomDateFormat,
    xAxis
  } = props;
  const labels = [...new Set(results?.data?.map((d: Record) => d[xAxis?.name || '']))] as string[];
  const segments = segmentsToInclude();
  const resultMap: { [key: string]: LabelRef } = {};

  // Populate a reference object like so:
  // {
  //   label1: {
  //     segment1: metric,
  //     segment2: metric, etc
  //   }
  // }

  const defaultSegmentValue = options?.chartType === 'stackedAreaChart' ? 0 : null; // Default is null not 0, to avoid unwanted chart elements

  labels.forEach((label) => {
    const labelRef: LabelRef = {};

    segments.forEach((s) => (labelRef[s] = defaultSegmentValue));

    resultMap[label] = labelRef;
  });

  results?.data?.forEach((d) => {
    const seg = d[segment?.name || ''];
    const axis = d[xAxis?.name || ''];
    const met = d[metric?.name || ''];

    if (segments.includes(seg)) {
      resultMap[axis][seg] = parseFloat(met);
    } else {
      resultMap[axis]['Other'] = (resultMap[axis]['Other'] || 0) + parseFloat(met);
    }
  });

  const dateFormat =
    useCustomDateFormat && granularity ? DATE_DISPLAY_FORMATS[granularity] : undefined;

  return {
    labels: labels.map((l) => formatValue(l, { meta: xAxis?.meta, dateFormat: dateFormat })),
    datasets: segments.map((s, i) => {
      const dataset = {
        ...datasetsMeta,
        backgroundColor: COLORS[i % COLORS.length],
        borderColor: COLORS[i % COLORS.length],
        label: s, // this is actually segment name, not label, but chart.js wants "label" here
        data: labels.map((label) => {
          const segmentValue = resultMap[label][s];
          if (showTotals && totals && segmentValue !== null) {
            totals[label].lastSegment = i;
          }
          return displayAsPercentage && segmentValue !== null //skip null values
            ? parseFloat(
                `${
                  (segmentValue * 100) /
                  segments.reduce((accumulator, segment) => {
                    if (resultMap[label][segment] === null) {
                      return accumulator;
                    }
                    return resultMap[label][segment] + accumulator;
                  }, 0)
                }`,
              )
            : segmentValue;
        }),
        xAxisNames: labels,
        totals,
      };
      return dataset;
    }),
  };

  type Record = { [p: string]: string };

  function segmentsToInclude(): string[] {
    const uniqueSegments = [
      ...new Set(results?.data?.map((d: Record) => d[segment?.name || ''] || 'No value')),
    ] as string[];

    if (!maxSegments || uniqueSegments.length <= maxSegments || maxSegments < 1) {
      return uniqueSegments;
    }

    // Reduce to maxSegments, comprising the segments with the highest total and an 'Other' segment merging the longtail segments.
    const segmentTotals: { [key: string]: number } = {};

    results?.data?.forEach(
      (d) =>
        (segmentTotals[d[segment?.name || '']] =
          (segmentTotals[d[segment?.name || '']] || 0) + parseInt(d[metric?.name || ''])),
    );

    const summedSegments = Object.keys(segmentTotals)
      .map((item) => {
        return {
          name: item,
          value: segmentTotals[item],
        };
      })
      .sort((a, b) => b.value - a.value);

    const segmentsToInclude = summedSegments.slice(0, maxSegments).map((s) => s.name);

    segmentsToInclude.push('Other');

    return segmentsToInclude;
  }
}
