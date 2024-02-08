import React from 'react';

export default function Title({ title }: { title?: string }) {
  return (
    !!title && (
      <h2 className="w-full text-[#333942] text-base font-bold font-embeddable justify-start flex leading-6 mb-4">
        {title}
      </h2>
    )
  );
}
