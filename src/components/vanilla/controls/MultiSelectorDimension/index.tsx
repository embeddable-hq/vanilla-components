import { Dimension } from '@embeddable.com/core';
import React from 'react';

import MultiSelector from '../MultiSelector';
import { getMultiSelectorDefaultValue, getSelectorOptions } from '../Selector.utils';

export type Props = {
  allowNoValue?: boolean;
  defaultValue?: Dimension[];
  options: Dimension[];
  title?: string;
  onChange: (v: Dimension[]) => void;
};

export default (props: Props) => {
  const handleChange = (newValues: string[]) => {
    const newSelection = props.options.filter((option) => newValues.includes(option.name));
    props.onChange(newSelection);
  };

  return (
    <MultiSelector
      title={props.title}
      options={getSelectorOptions(props.options)}
      defaultValue={getMultiSelectorDefaultValue(props.defaultValue, props.options)}
      unclearable={!props.allowNoValue}
      onChange={handleChange}
    />
  );
};
