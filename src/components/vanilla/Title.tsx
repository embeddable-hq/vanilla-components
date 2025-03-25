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
          font-bold
          font-embeddable
          justify-start
          leading-6
          mb-2
          text-base
          text-[color:--embeddable.font.color]
        `}
        style={style || {}}
      >
        {title}
      </h2>
    )
  );
}
