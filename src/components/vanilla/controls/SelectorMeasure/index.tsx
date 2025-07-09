import { Measure } from '@embeddable.com/core';
import React from 'react';

import Selector from '../Selector';
import { getSelectorOptions } from '../Selector.utils';

export type Props = {
  allowNoValue?: boolean;
  defaultValue?: Measure;
  options: Measure[];
  title?: string;
  onChange: (v: Measure) => void;
};

export default (props: Props) => {
  const handleChange = (newValue: string) => {
    const newSelection = props.options.find((option) => option.name === newValue)!;
    props.onChange(newSelection);
  };

  return (
    <Selector
      title={props.title}
      options={getSelectorOptions(props.options)}
      defaultValue={props.defaultValue?.name}
      unclearable={!props.allowNoValue}
      onChange={handleChange}
    />
  );
};
