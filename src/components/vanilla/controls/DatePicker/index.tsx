import DateRangeWithGranularity from './components/DateRangeWithGranularity'
import React from 'react';
import Container from '../../Container';

export type Props = {
  defaultPeriod?: TimeRange;
  defaultGranularity?: Granularity;
  showGranularity?: boolean;
  onChangePeriod: (v: TimeRange | null) => void;
  onChangeGranularity: (v: Granularity | null) => void;
};

export default (props: Props) => {

return (
  <Container 
    {...props}
  >
    <DateRangeWithGranularity
      defaultPeriod={props.value}
      defaultGranularity={props.defaultGranularity}
      showGranularity={props.showGranularity}
      onChangePeriod={props.onChange}
      onChangeGranularity={props.onChangeGranularity}
    />
  </Container>
)

}