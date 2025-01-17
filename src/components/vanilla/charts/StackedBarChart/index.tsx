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
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React from 'react';
import { Bar } from 'react-chartjs-2';

import useTimeseries from '../../../hooks/useTimeseries';
import getBarChartOptions from '../../../util/getBarChartOptions';
import getStackedChartData, {
  Props,
  PropsWithRequiredTheme,
} from '../../../util/getStackedChartData';
import Container from '../../Container';
import { Theme } from '../../../../defaulttheme';
import { useOverrideConfig } from '@embeddable.com/react';
import { setChartJSDefaults } from '../../../util/chartjs/common';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels,
);

type Totals = {
  [xAxis: string]: {
    total: number;
    lastSegment: number | null;
  };
};

export default (props: Props) => {
  // Get theme for use in component
  const overrides: { theme: Theme } = useOverrideConfig() as { theme: Theme };
  const { theme } = overrides;

  setChartJSDefaults(theme);

  const datasetsMeta = {
    barPercentage: 0.6,
    barThickness: 'flex',
    maxBarThickness: 25,
    minBarLength: 0,
    borderRadius: 3,
  };

  //add missing dates to time-series stacked barcharts
  const { fillGaps } = useTimeseries(props, 'desc');
  const { results, isTSGroupedBarChart } = props;
  const updatedProps: PropsWithRequiredTheme = {
    ...props,
    results: isTSGroupedBarChart
      ? { ...props.results, data: results?.data?.reduce(fillGaps, []) }
      : props.results,
    theme,
  };

  if (props.showTotals) {
    const totals: Totals = {};
    const { data } = props.results;
    const { metric, xAxis, segment } = props;
    if (data && data.length > 0) {
      data?.forEach((d: { [key: string]: any }) => {
        const x = d[xAxis.name];
        const y = parseFloat(d[metric.name]);
        if (totals[x]) {
          totals[x].total += y;
          totals[x].lastSegment = null;
        } else {
          totals[x] = {
            total: y,
            lastSegment: null, // we'll fill this in later
          };
        }
      });
      updatedProps.totals = totals;
    }
  }

  return (
    <Container {...props} className="overflow-y-hidden">
      <Bar
        height="100%"
        options={getBarChartOptions({ ...updatedProps, stacked: props.stackBars })}
        data={
          getStackedChartData(updatedProps, datasetsMeta) as ChartData<'bar', number[], unknown>
        }
      />
    </Container>
  );
};
