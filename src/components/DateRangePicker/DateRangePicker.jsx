import '../index.css';
import React from 'react';
import { DateRangePicker as TremorDateRangePicker, DateRangePickerItem } from '@tremor/react';
import {
  startOfMonth,
  startOfToday,
  subDays,
  startOfQuarter,
  endOfQuarter,
  endOfMonth,
  startOfYear,
  endOfYear
} from 'date-fns';

const dateRanges = [
  {
    name: 'Today',
    from: startOfToday()
  },
  {
    name: 'Last 7 days',
    from: subDays(startOfToday(), 7)
  },
  {
    name: 'Last 30 days',
    from: subDays(startOfToday(), 30)
  },
  {
    name: 'This month',
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  },
  {
    name: 'This quarter',
    from: startOfQuarter(new Date()),
    to: endOfQuarter(new Date())
  },
  {
    name: 'This year',
    from: startOfYear(new Date()),
    to: endOfYear(new Date())
  }
];

const DateRangePicker = ({ onChange, value }) => {
  const parsedValue = {
    from: value?.from ? new Date(value?.from) : null,
    to: value?.to ? new Date(value?.to) : null,
    selectValue: value?.selectValue
  };

  return (
    <TremorDateRangePicker
      className="max-w-md mx-auto"
      value={parsedValue}
      onValueChange={onChange}
      selectPlaceholder="Select date range here"
      color="rose"
    >
      {dateRanges.map((range) => (
        <DateRangePickerItem key={range.name} value={range.name} from={range.from} to={range.to}>
          {range.name}
        </DateRangePickerItem>
      ))}
    </TremorDateRangePicker>
  );
};

export default DateRangePicker;
