import React from 'react';

export default ({ title }: { title?: string }) =>
  !!title && (
    <h2 className="text-[#333942] text-[14px] font-bold justify-start flex mb-8">{title}</h2>
  );
