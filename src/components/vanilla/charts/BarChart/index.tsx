import { DataResponse, Dimension, Granularity, Measure } from '@embeddable.com/core';

import useTimeseries from '../../../hooks/useTimeseries';
import Container from '../../Container';
import BarChart from './components/BarChart';

type Props = {
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
};

export default (props: Props) => {
  //add missing dates to time-series barcharts
  const { fillGaps } = useTimeseries(props, 'desc');
  const { results, isTSBarChart } = props;
  const updatedProps = {
    ...props,
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
