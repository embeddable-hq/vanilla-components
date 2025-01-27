import { useOverrideConfig } from '@embeddable.com/react';
import React from 'react';
import { Theme } from '../../themes/theme';
import defaultTheme from '../../themes/defaulttheme';

type Props = {
  title?: string;
  style?: React.CSSProperties;
};

export default function Title({ title, style }: Props) {
  const overrides: { theme: Theme } = useOverrideConfig() as { theme: Theme };
  let { theme } = overrides;
  if (!theme) {
    theme = defaultTheme;
  }

  return (
    !!title && (
      <h2
        className={`w-full text-[${theme.font.color}] text-base font-bold font-embeddable justify-start flex leading-6 mb-2`}
        style={style || {}}
      >
        {title}
      </h2>
    )
  );
}
