import { Dataset, Dimension, Measure } from '@embeddable.com/core';
import { DataResponse } from '@embeddable.com/react';
import React from 'react';

import BarChart from '../../BarChart';
import ChartContainer from '../../ChartContainer';
import { Inputs } from './BasicBarComponent.emb';

type Props = Inputs & {
  results: DataResponse;
};

export default (props: Props) => {
  const { results, title } = props;

  return (
    <ChartContainer title={title} results={results}>
      <BarChart {...props} />
    </ChartContainer>
  );
};
