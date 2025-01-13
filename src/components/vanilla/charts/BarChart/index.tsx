import { DataResponse, Dimension, Granularity, Measure } from '@embeddable.com/core';
import { useOverrideConfig } from '@embeddable.com/react';

import useTimeseries from '../../../hooks/useTimeseries';
import Container from '../../Container';
import BarChart from './components/BarChart';
import defaultTheme, { Theme } from '../../../../defaulttheme';

type Props = {
  clientContext?: any;
  description?: string;
  displayHorizontally?: boolean;
  dps?: number;
  enableDownloadAsCSV?: boolean;
  granularity?: Granularity;
  isTSBarChart?: boolean;
  limit?: number;
  metrics: Measure[];
  lineMetrics?: Measure[];
  results: DataResponse;
  reverseXAxis?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  sortBy?: Dimension | Measure;
  stackMetrics?: boolean;
  title?: string;
  xAxis: Dimension;
  xAxisTitle?: string;
  yAxisTitle?: string;
  showSecondYAxis?: boolean;
  secondAxisTitle?: string;
  theme?: Theme;
};

type PropsWithRequiredtheme = Props & { theme: Theme };

export default (props: Props): React.JSX.Element => {
  // Get theme for use in component
  const overrides: { theme: Theme } = useOverrideConfig() as { theme: Theme };
  const { theme } = overrides;

  //add missing dates to time-series barcharts
  const { fillGaps } = useTimeseries(props, 'desc');
  const { results, isTSBarChart } = props;

  // Update props with theme and filled gaps
  const updatedProps: PropsWithRequiredtheme = {
    ...props,
    theme: theme || defaultTheme,
    results: isTSBarChart
      ? { ...props.results, data: results?.data?.reduce(fillGaps, []) }
      : props.results,
  };

  return (
    <Container {...props} className="overflow-y-hidden">
      <BarChart {...updatedProps} />
    </Container>
  );
};
