import { useTheme } from '@embeddable.com/react';
import React from 'react';
import { Theme } from '../../themes/theme';

type Props = {
  title?: string;
  style?: React.CSSProperties;
};

export default function Title({ title, style }: Props) {
  const theme: Theme = useTheme() as Theme;

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
