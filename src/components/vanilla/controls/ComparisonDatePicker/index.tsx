import { Granularity, TimeRange } from '@embeddable.com/core';
import React from 'react';

import Container from '../../Container';
import DateRangeWithGranularity from '../DatePicker/components/DateRangeWithGranularity';

export type Props = {
  defaultPeriod?: TimeRange;
  defaultComparison?: string;
  defaultGranularity?: Granularity;
  showGranularity?: boolean;
  onChangePeriod: (v: TimeRange | null) => void;
  onChangeComparison: (v: TimeRange | null) => void;
  onChangeGranularity: (v: Granularity | null) => void;
};

export default (props: Props) => {
  return (
    <Container {...props}>
      <DateRangeWithGranularity {...props} />
    </Container>
  );
};
