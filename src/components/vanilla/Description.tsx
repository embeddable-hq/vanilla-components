import React from 'react';
import { SMALL_FONT_SIZE } from '../constants';

type Props = {
  description?: string;
}

export default function Description({ description }: Props) {

  if(!description) return null;

  return (
    <p className={`w-full text-[#333942] text-[${SMALL_FONT_SIZE}] font-embeddable justify-start flex leading-6 mb-4`}>
      {description}
    </p>
  );
}
