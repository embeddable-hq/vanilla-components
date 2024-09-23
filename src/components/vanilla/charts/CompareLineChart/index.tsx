import {
  DataResponse,
  Dataset,
  Dimension,
  Granularity,
  Measure,
  TimeRange
} from '@embeddable.com/core';
import {
  CategoryScale,
  ChartData,
  ChartDataset,
  Chart as ChartJS,
  ChartOptions,
  DefaultDataPoint,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';

import {
  COLORS,
  DATE_DISPLAY_FORMATS,
  EMB_FONT,
  LIGHT_FONT,
  SMALL_FONT_SIZE
} from '../../../constants';
import useTimeseries from '../../../hooks/useTimeseries';
import { parseTime, timeRangeToLocal } from '../../../hooks/useTimezone';
import formatValue from '../../../util/format';
import formatDateTooltips from '../../../util/formatDateTooltips';
import hexToRgb from '../../../util/hexToRgb';
import Container from '../../Container';

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

type Props = {
  title?: string;
  ds: Dataset;
  xAxis: Dimension;
  granularity: Granularity;
  metrics: Measure[];
  timeFilter?: TimeRange;
  prevTimeFilter?: TimeRange;
  yAxisMin?: number;
  xAxisTitle?: string;
  yAxisTitle?: string;
  applyFill?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  results: DataResponse;
  prevResults: DataResponse;
  dps?: number;
};

type Record = { [p: string]: string };

export default (propsInitial: Props) => {
  const props = useMemo(
    () => ({ ...propsInitial, granularity: propsInitial.granularity || 'day' }),
    [propsInitial]
  );

  const { fillGaps } = useTimeseries(props);

  const chartData: ChartData<'line'> = useMemo(() => {
    const { results, prevResults, metrics, applyFill } = props;

    const data = results?.data?.reduce(fillGaps, []);

    const prevData = prevResults?.data?.reduce(fillGaps, []);

    const lines: ChartDataset<'line', DefaultDataPoint<'line'>>[] =
      metrics?.map((yAxis, i) => ({
        xAxisID: 'period',
        label: yAxis.title,
        data:
          data?.map((d: Record) => ({
            y: parseFloat(d[yAxis.name] || '0'),
            x: parseTime(d[props.xAxis?.name || ''])
          })) || [],
        backgroundColor: applyFill
          ? hexToRgb(COLORS[i % COLORS.length], 0.2)
          : COLORS[i % COLORS.length],
        borderColor: COLORS[i % COLORS.length],
        pointRadius: 0,
        tension: 0.1,
        pointHoverRadius: 3,
        fill: applyFill,
        cubicInterpolationMode: 'monotone' as const
      })) || [];

    const datasets = [
      ...lines,
      ...lines.map((_, i) => {
        const c = hexToRgb(COLORS[i % COLORS.length], 0.5);

        const update: ChartDataset<'line', DefaultDataPoint<'line'>> = {
          cubicInterpolationMode: 'monotone' as const,
          showLine: !!props.prevTimeFilter,
          xAxisID: 'comparison',
          label: `Previous ${metrics[i].title}`,
          data: props.prevTimeFilter
            ? prevData?.map((d: Record) => ({
                y: parseFloat(d[metrics[i].name] || '0'),
                x: parseTime(d[props.xAxis?.name || ''])
              })) || []
            : [],
          backgroundColor: applyFill ? hexToRgb(COLORS[i % COLORS.length], 0.05) : c,
          borderColor: c,
          pointRadius: 0,
          tension: 0.1,
          pointHoverRadius: 3,
          fill: applyFill && !!props.prevTimeFilter,
          segment: {
            borderDash: [10, 5]
          }
        };

        return update;
      })
    ];

    return {
      datasets
    };
  }, [props, fillGaps]);

  const chartOptions: ChartOptions<'line'> = useMemo(() => {
    const bounds = {
      period: timeRangeToLocal(props.timeFilter),
      comparison: timeRangeToLocal(props.prevTimeFilter)
    };

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
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
          min: bounds.period?.from?.toJSON(),
          max: bounds.period?.to?.toJSON(),
          grid: {
            display: false
          },
          type: 'time',
          time: {
            round: props.granularity,
            isoWeekday: true,
            displayFormats: DATE_DISPLAY_FORMATS,
            unit: props.granularity
          },
          title: {
            display: !!props.xAxisTitle,
            text: props.xAxisTitle
          }
        },
        comparison: {
          min: bounds.comparison?.from?.toJSON(),
          max: bounds.comparison?.to?.toJSON(),
          display: false,
          grid: {
            display: false
          },
          type: 'time',
          time: {
            round: props.granularity,
            isoWeekday: true,
            displayFormats: DATE_DISPLAY_FORMATS,
            unit: props.granularity
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
        tooltip: {
          callbacks: {
            title: (lines: any[]) => formatDateTooltips(lines, props.granularity)
          }
        },
        datalabels: {
          align: 'top',
          display: props.showLabels ? 'auto' : false,
          formatter: (v) => {
            const val = v ? formatValue(v.y, { type: 'number', dps: props.dps }) : null;
            return val;
          }
        }
      }
    };
  }, [props]);

  return (
    <Container {...props} className="overflow-y-hidden">
      <Line height="100%" options={chartOptions} data={chartData} />
    </Container>
  );
};
