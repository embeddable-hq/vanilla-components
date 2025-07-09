import { Dimension } from '@embeddable.com/core';
import React from 'react';

import MultiSelector from '../../MultiSelector';

export type Props = {
  allowNoValue?: boolean;
  defaultValue: Dimension[];
  options: Dimension[];
  title?: string;
  onChange: (v: Dimension[]) => void;
};

export default (props: Props) => {
  const calculatedDefaultValue = (props.defaultValue || []).map((v) => v.name);

  const handleChange = (newValues: string[]) => {
    const newSelection = props.options.filter((option) => newValues.includes(option.name))!;
    props.onChange(newSelection);
  };

  return (
    <MultiSelector
      title={props.title}
      options={props.options.map((option) => ({
        value: option.name,
        label: option.inputs?.overrideName ?? option.title,
      }))}
      defaultValue={calculatedDefaultValue}
      unclearable={!props.allowNoValue}
      onChange={handleChange}
    />
  );
};
