import React from 'react';

export default ({ title, absolute }: { title?: string; absolute?: boolean }) =>
  !!title && (
    <h2
      className={`${
        absolute ? 'absolute left-0 top-0' : ''
      } w-full text-[#333942] text-base font-bold font-embeddable justify-start flex leading-6`}
    >
      {title}
    </h2>
  );
