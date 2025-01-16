import { DataResponse, Dimension, Granularity, Measure } from '@embeddable.com/core';
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
  Tooltip,
} from 'chart.js';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';

import useTimeseries from '../../../hooks/useTimeseries';
import formatValue from '../../../util/format';
import formatDateTooltips from '../../../util/formatDateTooltips';
import hexToRgb from '../../../util/hexToRgb';
import { parseTime } from '../../../util/timezone';
import { setYAxisStepSize } from '../../../util/chartjs/common';
import Container from '../../Container';
import { useOverrideConfig } from '@embeddable.com/react';
import { setChartJSDefaults } from '../../../util/chartjs/common';
import defaultTheme, { Theme } from '../../../../defaulttheme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels,
);

type Props = {
  results: DataResponse;
  title?: string;
  dps?: number;
  xAxis: Dimension;
  metrics: Measure[];
  applyFill?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  yAxisMin?: number;
  yAxisTitle?: string;
  xAxisTitle?: string;
  granularity: Granularity;
  limit?: number;
};

type PropsWithRequiredTheme = Props & { theme: Theme };
type Record = { [p: string]: string };

export default (props: Props) => {
  const { results, title } = props;
  const { fillGaps } = useTimeseries(props, 'desc');

  // Get theme for use in component
  const overrides: { theme: Theme } = useOverrideConfig() as { theme: Theme };
  let { theme } = overrides;
  if (!theme) {
    theme = defaultTheme;
  }

  // Set ChartJS defaults
  setChartJSDefaults(theme, 'line');

  // Add the theme to props
  const updatedProps: PropsWithRequiredTheme = {
    ...props,
    theme,
  };

  const chartData: ChartData<'line'> = useMemo(() => {
    const { results, metrics, applyFill, theme } = updatedProps;

    const data = results?.data?.reduce(fillGaps, []);

    return {
      datasets:
        metrics?.map((yAxis, i) => ({
          label: yAxis.title,
          data:
            data?.map((d: Record) => ({
              y: parseFloat(d[yAxis.name] || '0'),
              x: parseTime(d[props.xAxis?.name || '']),
            })) || [],
          backgroundColor: applyFill
            ? hexToRgb(theme.charts.colors[i % theme.charts.colors.length], 0.2)
            : theme.charts.colors[i % theme.charts.colors.length],
          borderColor: theme.charts.colors[i % theme.charts.colors.length],
          pointRadius: 0,
          tension: 0.1,
          pointHoverRadius: 3,
          fill: applyFill,
          cubicInterpolationMode: 'monotone' as const,
        })) || [],
    };
  }, [updatedProps, fillGaps]);

  const chartOptions: ChartOptions<'line'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: updatedProps.showLabels ? 20 : 0, // Added so the highest data labels fits
          bottom: 0,
        },
      },
      scales: {
        y: {
          min: updatedProps.yAxisMin,
          grace: '0%', // Add percent to add numbers on the y-axis above and below the max and min values
          grid: {
            display: false,
          },
          title: {
            display: !!updatedProps.yAxisTitle,
            text: updatedProps.yAxisTitle,
          },
          callback: function (value: number) {
            return formatValue(value.toString(), { type: 'number' });
          },
          afterDataLimits: function (axis) {
            //Disable fractions unless they exist in the data.
            setYAxisStepSize(
              axis,
              updatedProps.results,
              [...updatedProps.metrics],
              updatedProps.dps,
            );
          },
        },
        x: {
          grid: {
            display: false,
          },
          title: {
            display: !!updatedProps.xAxisTitle,
            text: updatedProps.xAxisTitle,
          },
          type: 'time',
          time: {
            round: updatedProps.granularity,
            displayFormats: theme.dateFormats,
            unit: updatedProps.granularity,
          },
        },
      },
      animation: {
        duration: 400,
        easing: 'linear',
      },
      plugins: {
        legend: {
          display: updatedProps.showLegend,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxHeight: 8,
          },
        },
        datalabels: {
          align: 'top',
          display: updatedProps.showLabels ? 'auto' : false,
          formatter: (v, context) => {
            //metric needed for formatting
            const metricIndex = context.datasetIndex;
            const metricObj = updatedProps.metrics[metricIndex];
            const val = v
              ? formatValue(v.y, {
                  type: 'number',
                  dps: updatedProps.dps,
                  meta: metricObj?.meta,
                })
              : null;
            return val;
          },
        },
        tooltip: {
          //https://www.chartjs.org/docs/latest/configuration/tooltip.html
          callbacks: {
            label: function (context) {
              //metric needed for formatting
              const metricIndex = context.datasetIndex;
              const metricObj = updatedProps.metrics[metricIndex];
              let label = context.dataset.label || '';
              if (context.parsed.y !== null) {
                label += `: ${formatValue(`${context.parsed['y']}`, {
                  type: 'number',
                  dps: updatedProps.dps,
                  meta: metricObj?.meta,
                })}`;
              }
              return label;
            },
            title: (lines: any[]) => formatDateTooltips(lines, updatedProps.granularity),
          },
        },
      },
    }),
    [updatedProps, theme.dateFormats],
  );

  return (
    <Container {...updatedProps} className="overflow-y-hidden">
      <Line height="100%" options={chartOptions} data={chartData} />
    </Container>
  );
};
