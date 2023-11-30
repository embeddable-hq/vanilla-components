import React from 'react';
import Select from 'react-select-search';
import 'react-select-search/style.css';

import './style.css';

type Props = {
  onChange: (v: any) => void;
  value: string;
};

export default (props: Props) => {
  return (
    <div className="granularity-dropdown">
      <Select
        onChange={(o: any) => {
          props.onChange(o);
        }}
        value={props.value}
        options={[
          { value: 'second', name: 'second' },
          { value: 'minute', name: 'minute' },
          { value: 'hour', name: 'hour' },
          { value: 'day', name: 'day' },
          { value: 'week', name: 'week' },
          { value: 'month', name: 'month' },
          { value: 'quarter', name: 'quarter' },
          { value: 'year', name: 'year' }
        ]}
      />
    </div>
  );
};
