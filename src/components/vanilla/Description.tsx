import React from 'react';
import { Theme } from '../../themes/theme';
import { useTheme } from '@embeddable.com/react';

type Props = {
  description?: string;
  style?: React.CSSProperties;
};

export default function Description({ description, style }: Props) {
  const theme: Theme = useTheme() as Theme;

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
