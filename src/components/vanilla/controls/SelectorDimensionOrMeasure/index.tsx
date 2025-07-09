import { DimensionOrMeasure, Measure } from '@embeddable.com/core';
import React from 'react';

import Selector from '../../Selector';

export type Props = {
  allowNoValue?: boolean;
  defaultValue: DimensionOrMeasure;
  options: DimensionOrMeasure[];
  title?: string;
  onChange: (v: DimensionOrMeasure) => void;
};

export default (props: Props) => {
  const handleChange = (newValue: string) => {
    const newSelection = props.options.find((option) => option.name === newValue)!;
    props.onChange(newSelection);
  };

  return (
    <Selector
      title={props.title}
      options={props.options.map((option) => ({
        value: option.name,
        label: option.inputs?.overrideName ?? option.title,
      }))}
      defaultValue={props.defaultValue?.name}
      unclearable={!props.allowNoValue}
      onChange={handleChange}
    />
  );
};
