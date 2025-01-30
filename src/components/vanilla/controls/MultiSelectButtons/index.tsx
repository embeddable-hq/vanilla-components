import React, { useState } from 'react';

import Container from '../../Container';
import { Theme } from '../../../../themes/theme';
import { useOverrideConfig } from '@embeddable.com/react';
import defaultTheme from '../../../../themes/defaulttheme';

type Props = {
  title: string;
  values: Array<string>;
  onChange: (v: Array<string>) => void;
  defaultValue?: Array<string>;
};

export default (props: Props) => {
  const { title, values, onChange, defaultValue } = props;
  const [selected, setSelected] = useState(defaultValue || []);

  // Get theme for use in component
  const overrides: { theme: Theme } = useOverrideConfig() as { theme: Theme };
  let { theme } = overrides;
  if (!theme) {
    theme = defaultTheme;
  }

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
              className={`multiselectItem text-[${theme.font.colorDark}]`}
              style={{ background: background }}
              onClick={() => handleClick(value)}
            >
              <div className="multiSelectInner" style={{ color: color }}>
                {value}
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
};
