import React from 'react';
import defaultTheme from '../../themes/defaulttheme';
import { Theme } from '../../themes/theme';
import { useOverrideConfig } from '@embeddable.com/react';

type Props = {
  description?: string;
  style?: React.CSSProperties;
};

export default function Description({ description, style }: Props) {
  const overrides: { theme: Theme } = useOverrideConfig() as { theme: Theme };
  let { theme } = overrides;
  if (!theme) {
    theme = defaultTheme;
  }

  return (
    !!description && (
      <p
        className={`w-full text-[${theme.font.color}] text-[${theme.font.size}] font-embeddable justify-start flex mb-2`}
        style={style || {}}
      >
        {description}
      </p>
    )
  );
}
