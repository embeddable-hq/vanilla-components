import Container from '../../Container';
import BarChart from './components/BarChart';
import useTimeseries from '../../../hooks/useTimeseries';
import { DataResponse, Dataset, Dimension, Granularity, Measure } from '@embeddable.com/core';


type Props = {
  description?: string;
  displayHorizontally?: boolean;
  dps?: number;
  enableDownloadAsCSV?: boolean;
  metrics: Array<Measure>;
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
  metrics: Measure[];
  granularity?: Granularity;
  limit?: number;
};

export default (props: Props) => {

  //add missing dates to time-series barcharts
  const { fillGaps } = useTimeseries(props, 'desc');
  const { results, isTSBarChart } = props;
  const updatedProps = {
    ...props,
    results: isTSBarChart
      ? { ...props.results, data: results?.data?.reduce(fillGaps, []) }
      : props.results
  };

  return (
    <Container
      {...props}
      className="overflow-y-hidden"
      >
      <BarChart
        {...updatedProps}
      />
    </Container>
  );
};

