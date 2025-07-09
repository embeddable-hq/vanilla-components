import { Measure } from '@embeddable.com/core';
import React from 'react';

import MultiSelector from '../MultiSelector';
import { getSelectorOptions } from '../Selector.utils';

export type Props = {
  allowNoValue?: boolean;
  defaultValue?: Measure[];
  options: Measure[];
  title?: string;
  onChange: (v: Measure[]) => void;
};

export default (props: Props) => {
  const calculatedDefaultValue = props.defaultValue?.map((v) => v.name) || [];

  const handleChange = (newValues: string[]) => {
    const newSelection = props.options.filter((option) => newValues.includes(option.name));
    props.onChange(newSelection);
  };

  return (
    <MultiSelector
      title={props.title}
      options={getSelectorOptions(props.options)}
      defaultValue={calculatedDefaultValue}
      unclearable={!props.allowNoValue}
      onChange={handleChange}
    />
  );
};
