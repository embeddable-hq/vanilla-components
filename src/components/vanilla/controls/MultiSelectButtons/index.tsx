import React, { useState } from 'react';

import Container from '../../Container';

type Props = {
  title: string;
  values: Array<string>;
  onChange: (v: Array<string>) => void;
  defaultValue?: Array<string>;
};

export default (props: Props) => {
  const { title, values, onChange, defaultValue } = props;
  const [selected, setSelected] = useState(defaultValue || []);

  const handleClick = (value: string) => {
    const updated = selected.includes(value)
      ? selected.filter((el) => el !== value)
      : [...selected, value];
    setSelected(updated);
    onChange(updated);
  };

  return (
    <Container title={title}>
      <div className="multiSelectContainer font-embeddable text-[14px]">
        {values?.map((value, i) => {
          const background = selected.includes(value) ? '#6778DE' : '#f1f1f1';
          const color = selected.includes(value) ? 'white' : 'inherit';

          return (
            <div
              key={i}
              className="multiselectItem text-[#333942]"
              style={{ background: background }}
              onClick={() => handleClick(value)}
            >
              <div className="multiSelectInner" style={{ color: color }}>{value}</div>
            </div>
          );
        })}
      </div>
    </Container>
  );
};
