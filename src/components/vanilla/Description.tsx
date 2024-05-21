import React from 'react';
import { SMALL_FONT_SIZE } from '../constants';

export default function Title({ description }: { title?: string }) {
  return (
    !!description && (
      <p className={`w-full text-[#333942] text-[${SMALL_FONT_SIZE}] font-embeddable justify-start flex leading-6 mb-4`}>
        {description}
      </p>
    )
  );
}
