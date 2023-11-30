import React from 'react';
import Select, { components } from 'react-select';

import '../index.css';

export default ({ onChange, value }) => {
  return (
    <Select
      onChange={onChange}
      // value={value}
      components={{
        DropdownIndicator,
        IndicatorSeparator
      }}
      options={[
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ]}
    />
  );
};

const IndicatorSeparator = (props) => (
  <components.IndicatorSeparator {...props}>{null}</components.IndicatorSeparator>
);

const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5717 11.884C10.4893 11.9839 10.3902 12.0633 10.2805 12.1176C10.1708 12.172 10.0527 12.2 9.93342 12.2C9.81409 12.2 9.696 12.172 9.58629 12.1176C9.47659 12.0633 9.37754 11.9839 9.29516 11.884L5.88201 7.44237C5.77279 7.3001 5.70145 7.12436 5.67657 6.93629C5.65169 6.74821 5.67433 6.55583 5.74176 6.3823C5.8092 6.20876 5.91856 6.06147 6.05668 5.95816C6.1948 5.85484 6.35578 5.7999 6.52026 5.79995H13.3466C13.511 5.7999 13.672 5.85484 13.8102 5.95816C13.9483 6.06147 14.0576 6.20876 14.1251 6.3823C14.1925 6.55583 14.2151 6.74821 14.1903 6.93629C14.1654 7.12436 14.094 7.3001 13.9848 7.44237L10.5717 11.884Z"
        fill="#333942"
      />
    </svg>
  </components.DropdownIndicator>
);
