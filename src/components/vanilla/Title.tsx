import React from 'react';

export default ({ title }: { title?: string }) =>
  !!title && (
    <h2 className="w-full text-[#333942] text-base font-bold font-embeddable justify-start flex leading-6 mb-4">
      {title}
    </h2>
  );
