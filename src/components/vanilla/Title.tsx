import React from 'react';

type Props = {
  title?: string;
  style?: React.CSSProperties;
};

export default function Title({ title, style }: Props) {
  return (
    !!title && (
      <h2
        className="w-full text-[#333942] text-base font-bold font-embeddable justify-start flex leading-6 mb-1"
        style={style || {}}
      >
        {title}
      </h2>
    )
  );
}
