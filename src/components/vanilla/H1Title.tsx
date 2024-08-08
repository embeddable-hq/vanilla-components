import React from 'react';
import { H1_FONT_SIZE } from '../constants';

export default function H1Title({ title }: { title?: string }) {
  return (
    !!title && (
      <h1 className={`w-full text-[#333942] text-[${H1_FONT_SIZE}] font-embeddable justify-start`}>
        {title}
      </h1>
    )
  );
}
