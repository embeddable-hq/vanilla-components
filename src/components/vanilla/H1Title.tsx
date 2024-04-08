import React from 'react';

export default function H1Title({ title }: { title?: string }) {
  return (
    !!title && (
      <h1 className="w-full text-[#333942] text-4x1 font-bold">
        {title}
      </h1>
    )
  );
}
