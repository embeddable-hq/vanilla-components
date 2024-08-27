import DateRangeWithGranularity from '../DatePicker/components/DateRangeWithGranularity'
import React from 'react';
import Container from '../../Container';

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
	<Container
		{...props}
	>
		<DateRangeWithGranularity
			defaultPeriod={props.defaultPeriod}
			defaultComparison={props.defaultComparison}
			defaultGranularity={props.defaultGranularity}
			showGranularity={props.showGranularity}
			onChangePeriod={props.onChangePeriod}
			onChangeComparison={props.onChangeComparison}
			onChangeGranularity={props.onChangeGranularity}
		/>
	</Container>
)

}