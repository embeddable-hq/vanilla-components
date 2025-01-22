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
  TimeScale,
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
import getStackedChartData, {
  Props as GeneralStackedChartDataProps,
} from '../../../util/getStackedChartData';
import Container from '../../Container';
import { setYAxisStepSize } from '../../../util/chartjs/common';
import { useOverrideConfig } from '@embeddable.com/react';
import { setChartJSDefaults } from '../../../util/chartjs/common';
import defaultTheme from '../../../../themes/defaulttheme';
import { Theme } from '../../../../themes/theme';

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
  TimeScale,
);

type Props = GeneralStackedChartDataProps & {
  isMultiDimensionLine?: boolean;
};

type PropsWithRequiredTheme = Props & { theme: Theme };

export default (props: Props) => {
  const { isMultiDimensionLine = false } = props;

  // Get theme for use in component
  const overrides: { theme: Theme } = useOverrideConfig() as { theme: Theme };
  let { theme } = overrides;
  if (!theme) {
    theme = defaultTheme;
  }

  // Set ChartJS defaults
  setChartJSDefaults(theme, 'pie');

  // Add the theme to props
  const updatedProps: PropsWithRequiredTheme = {
    ...props,
    theme,
  };

  const { fillGaps } = useTimeseries(updatedProps, 'desc');

  const chartData = useMemo(() => {
    const data = updatedProps?.results?.data?.reduce(fillGaps, []);

    const datasetsMeta = {
      fill: !isMultiDimensionLine,
      cubicInterpolationMode: 'monotone' as const,
      pointRadius: 0,
      tension: 0.1,
      pointHoverRadius: 3,
    };

    return getStackedChartData(
      {
        ...updatedProps,
        results: {
          ...updatedProps.results,
          data,
        },
      },
      datasetsMeta,
      { chartType: 'stackedAreaChart' },
    ) as ChartData<'line', number[], unknown>;
  }, [updatedProps, fillGaps]);

  const chartOptions: ChartOptions<'line'> = useMemo(() => {
    return {
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
          stacked: !isMultiDimensionLine,
          min: updatedProps.yAxisMin,
          max: updatedProps.displayAsPercentage ? 100 : undefined,
          grace: '0%', // Add percent to add numbers on the y-axis above and below the max and min values
          grid: {
            display: false,
          },
          ticks: {
            callback: function (value) {
              return updatedProps.displayAsPercentage
                ? `${value}%`
                : formatValue(value.toString(), { type: 'number' });
            },
          },
          title: {
            display: !!updatedProps.yAxisTitle,
            text: updatedProps.yAxisTitle,
          },
          afterDataLimits: function (axis) {
            setYAxisStepSize(axis, updatedProps.results, [updatedProps.metric], updatedProps.dps);
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
        tooltip: {
          //https://www.chartjs.org/docs/latest/configuration/tooltip.html
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';
              if (context.parsed.y !== null) {
                label += `: ${formatValue(`${context.parsed['y']}`, {
                  type: 'number',
                  dps: updatedProps.dps,
                  meta: updatedProps.displayAsPercentage ? undefined : updatedProps.metric.meta,
                })}`;
                if (updatedProps.displayAsPercentage) {
                  label += '%';
                }
              }
              return label;
            },
            title: (lines: any[]) =>
              formatDateTooltips(lines, updatedProps.granularity || 'day', theme),
          },
        },
        datalabels: {
          align: 'top',
          display: updatedProps.showLabels ? 'auto' : false,
          formatter: (v) => {
            let val = v
              ? formatValue(v, {
                  type: 'number',
                  dps: updatedProps.dps,
                  meta: updatedProps.displayAsPercentage ? undefined : props.metric.meta,
                })
              : null;
            if (updatedProps.displayAsPercentage) {
              val += '%';
            }
            return val;
          },
        },
      },
    };
  }, [updatedProps, theme]);

  return (
    <Container {...updatedProps} className="overflow-y-hidden">
      <Line height="100%" options={chartOptions} data={chartData} />
    </Container>
  );
};
