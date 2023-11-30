import React, { useState } from 'react';

import '../index.css';

type Props = {
  title?: string;
  value: number;
  onChange: (v: any) => void;
};

export default (props: Props) => {
  const [value, setValue] = useState(`${props.value}`);

  return (
    <div className="w-full">
      {!!props.title && (
        <h2 className="text-[#333942] text-[14px] font-bold justify-start flex mb-8">
          {props.title}
        </h2>
      )}

      <div className="w-full relative rounded-xl bg-white border border-[#DADCE1] pr-8">
        <input
          type="number"
          className="rounded-xl w-full outline-none leading-10 h-10 border-0 px-3"
          onChange={(e) => {
            setValue(e.target.value);
            props.onChange(e.target.value);
          }}
          defaultValue={value}
        />
        <div
          onClick={() => {
            setValue('');
            props.onChange('');
          }}
          className="opacity-50 hover:opacity-100 absolute w-10 right-0 top-0 h-full cursor-pointer group flex items-center justify-center"
        >
          <ClearIcon />
        </div>
      </div>
    </div>
  );
};

const ClearIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.9657 5.53436C11.2782 5.84678 11.2782 6.35331 10.9657 6.66573L6.16573 11.4657C5.85331 11.7782 5.34678 11.7782 5.03436 11.4657C4.72194 11.1533 4.72194 10.6468 5.03436 10.3344L9.83436 5.53436C10.1468 5.22194 10.6533 5.22194 10.9657 5.53436Z"
      fill="#333942"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.03436 5.53436C5.34678 5.22194 5.85331 5.22194 6.16573 5.53436L10.9657 10.3344C11.2782 10.6468 11.2782 11.1533 10.9657 11.4657C10.6533 11.7782 10.1468 11.7782 9.83436 11.4657L5.03436 6.66573C4.72194 6.35331 4.72194 5.84678 5.03436 5.53436Z"
      fill="#333942"
    />
  </svg>
);
