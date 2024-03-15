import { ChartOptions } from 'chart.js';
import format from '../util/format';
import { COLORS } from '../constants';

type DatasetsMeta = {
  [key: string]: 'boolean' | 'string' | 'number';
};


export default function getStackedChartData(props: Props, datasetsMeta: DatasetsMeta, truncateDefault: number): ChartData<'bar'> {
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
    labels: labels.map((l) => format(l, { truncate: truncateDefault, meta: xAxis?.meta })),
    datasets: segments.map((s, i) => ({
      ...datasetsMeta,
      backgroundColor: COLORS[i % COLORS.length],
      borderColor: COLORS[i % COLORS.length],
      label: s,
      data: labels.map((label) => {
        const segmentValue = resultMap[label][s];
        return displayAsPercentage && segmentValue !== null //skip null values
          ? parseFloat(
              (
                (segmentValue * 100) /
                segments.reduce(
                  (accumulator, segment) => resultMap[label][segment] + accumulator,
                  0
                )
              )
            )
          : segmentValue;
        // return displayAsPercentage && segmentValue !== null //skip null values
        //   ? format(parseFloat(
        //       (
        //         (segmentValue * 100) /
        //         segments.reduce(
        //           (accumulator, segment) => resultMap[label][segment] + accumulator,
        //           0
        //         )
        //       ), { type: 'number', dps: props.dps })
        //     )
        //   : format(segmentValue, { type: 'number', dps: props.dps });
      }),
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