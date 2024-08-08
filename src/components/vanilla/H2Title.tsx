import React from 'react';
import { H2_FONT_SIZE } from '../constants';

export default function H2Title({ title }: { title?: string }) {
  return (
    !!title && (
      <h2 className={`w-full text-[#333942] text-[${H2_FONT_SIZE}] font-embeddable justify-start`}>
        {title}
      </h2>
    )
  );
}
