import { DataResponse, Measure } from '@embeddable.com/core';
import { Chart as ChartJS, Scale, CoreScaleOptions } from 'chart.js';
import { containsFractions } from '../dataUtils';
import { Theme } from '../../../defaulttheme';

export function setYAxisStepSize(
  axis: Scale<CoreScaleOptions>,
  results: DataResponse | undefined,
  metrics: Measure[],
  dps: number | undefined,
) {
  // Capture the max value for dynamic stepSize calculation
  const yAxisMax = axis.max;
  //Disable fractions unless they exist in the data.
  const yAxisContainsFractions = containsFractions(results, metrics);
  if (axis.options && 'ticks' in axis.options) {
    (axis.options.ticks as any).stepSize =
      yAxisMax <= 10 && (!yAxisContainsFractions || dps === 0) ? 1 : undefined;
  }
}

export const setChartJSDefaults = (theme: Theme) => {
  // We don't need to return Chartjs defaults as we are mutating the global object
  ChartJS.defaults.font.size = theme.chartFont.size;
  ChartJS.defaults.color = theme.chartFont.color;
  ChartJS.defaults.font.family = theme.chartFont.family;
  ChartJS.defaults.plugins.tooltip.enabled = theme.chartOptions.toolTipEnabled;
};
