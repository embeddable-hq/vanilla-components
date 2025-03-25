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
        className={`
          flex
          font-embeddable
          justify-start
          leading-6
          mb-2
          text-base
          font-[--embeddable-font-weight-bold]
          text-[color:--embeddable-font-color]
        `}
        style={style || {}}
      >
        {title}
      </h2>
    )
  );
}
