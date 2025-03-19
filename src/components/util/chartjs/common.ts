import { DataResponse, Measure } from '@embeddable.com/core';
import { Chart as ChartJS, Scale, CoreScaleOptions } from 'chart.js';
import { containsFractions } from '../dataUtils';
import { Theme, ChartType } from '../../../themes/theme';

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

export const setChartJSDefaults = (theme: Theme, chartType?: ChartType) => {
  if (!theme || !theme.charts) {
    return;
  }

  // Some charts vary, so we check for chart type and if it exists, set some values

  // remove 'px' from the font size and convert to a number
  let fontSize = parseInt(theme.font.size.replace('px', ''), 10);
  if (chartType && theme.charts[chartType]) {
    fontSize = theme.charts[chartType].font.size;
  }
  // We don't need to return Chartjs defaults as we are mutating the global object
  ChartJS.defaults.font.size = fontSize;
  ChartJS.defaults.color = theme.font.color;
  ChartJS.defaults.font.family = theme.font.family;
  ChartJS.defaults.plugins.tooltip.enabled = theme.charts.options.toolTipEnabled;
  ChartJS.defaults.plugins.tooltip.usePointStyle = true;
};
