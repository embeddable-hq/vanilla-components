import React from 'react';
import { SMALL_FONT_SIZE } from '../constants';

type Props = {
  description?: string;
  style?: React.CSSProperties;
}

export default function Description({ description, style }: Props) {

  return !!description && (
    <p
      className={`w-full text-[#333942] text-[${SMALL_FONT_SIZE}] font-embeddable justify-start flex mb-1`}
      style={style || {}}
    >
      {description}
    </p>
  );
}
