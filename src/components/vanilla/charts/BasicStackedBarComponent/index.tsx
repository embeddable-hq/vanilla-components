import React from 'react';
import Title from '../../Title';
import ChartContainer from '../../ChartContainer'
import BarChart from '../../BarChart'


type Props = {
  title?: string;
  showLegend?: boolean;
  ds?: Dataset;
  xAxis?: Dimension; // { name, title }
  metrics?: Measure; // [{ name, title }]
  results?: DataResponse; // { isLoading, error, data: [{ <name>: <value>, ... }] }
  showLabels?: boolean;
  yAxisMin?:number;
  maxSegments?: number;
  displayHorizontally?: boolean;
};

export default (props: Props) => {

  const { results, title, displayHorizontally } = props;
  // const { data } = results;

  return (

      <ChartContainer title={title} results={results}>
        <BarChart {...props} isBasicStackedComponent displayHorizontally={displayHorizontally}/>
      </ChartContainer>
  );
};
