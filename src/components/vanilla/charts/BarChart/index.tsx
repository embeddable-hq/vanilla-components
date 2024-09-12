import Container from '../../Container';
import BarChart from './components/BarChart';
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
};

export default (props: Props) => {

  return (
    <Container
      {...props}
      className="overflow-y-hidden"
      >
      <BarChart
        {...props}
      />
    </Container>
  );
};

