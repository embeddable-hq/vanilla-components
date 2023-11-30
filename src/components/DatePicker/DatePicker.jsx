import '../index.css';
import React from 'react';
import { DatePicker as TremorDatePicker } from '@tremor/react';

const DatePicker = ({ onChange, value }) => {
  return (
    <TremorDatePicker
      className="max-w-md mx-auto"
      value={value}
      onValueChange={onChange}
      selectPlaceholder="Select date"
      color="rose"
    />
  );
};

export default DatePicker;
