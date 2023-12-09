import React, { MouseEventHandler } from 'react';

export const ClearIcon = () => (
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

export const SortDown = (props: { fill: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.34837 10.7038C9.27113 10.7974 9.17828 10.8719 9.07543 10.9228C8.97258 10.9737 8.86187 11 8.75 11C8.63813 11 8.52742 10.9737 8.42457 10.9228C8.32172 10.8719 8.22887 10.7974 8.15163 10.7038L4.9518 6.53977C4.84941 6.40639 4.78253 6.24163 4.75921 6.06531C4.73588 5.889 4.75711 5.70864 4.82033 5.54595C4.88355 5.38326 4.98607 5.24518 5.11556 5.14832C5.24504 5.05146 5.39597 4.99995 5.55017 5H11.9498C12.104 4.99995 12.255 5.05146 12.3844 5.14832C12.5139 5.24518 12.6164 5.38326 12.6797 5.54595C12.7429 5.70864 12.7641 5.889 12.7408 6.06531C12.7175 6.24163 12.6506 6.40639 12.5482 6.53977L9.34837 10.7038Z"
      fill={props.fill}
    />
  </svg>
);

export const SortUp = (props: { fill: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.59837 5.2962C8.52113 5.20259 8.42828 5.12807 8.32543 5.07716C8.22258 5.02625 8.11187 5 8 5C7.88813 5 7.77742 5.02625 7.67457 5.07716C7.57172 5.12807 7.47887 5.20259 7.40163 5.2962L4.2018 9.46023C4.09941 9.59361 4.03253 9.75837 4.00921 9.93469C3.98588 10.111 4.00711 10.2914 4.07033 10.454C4.13355 10.6167 4.23607 10.7548 4.36556 10.8517C4.49504 10.9485 4.64597 11 4.80017 11H11.1998C11.354 11 11.505 10.9485 11.6344 10.8517C11.7639 10.7548 11.8664 10.6167 11.9297 10.454C11.9929 10.2914 12.0141 10.111 11.9908 9.93469C11.9675 9.75837 11.9006 9.59361 11.7982 9.46023L8.59837 5.2962Z"
      fill={props.fill}
    />
  </svg>
);

export const ChevronLeft = ({
  className,
  onClick
}: {
  className?: string;
  onClick?: MouseEventHandler<SVGSVGElement>;
}) => (
  <svg
    onClick={onClick}
    className={className || ''}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.7071 5.29289C13.0976 5.68342 13.0976 6.31658 12.7071 6.70711L9.41421 10L12.7071 13.2929C13.0976 13.6834 13.0976 14.3166 12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L7.29289 10.7071C6.90237 10.3166 6.90237 9.68342 7.29289 9.29289L11.2929 5.29289C11.6834 4.90237 12.3166 4.90237 12.7071 5.29289Z"
      fill="#444"
    />
  </svg>
);

export const ChevronRight = ({
  className,
  onClick
}: {
  className?: string;
  onClick?: MouseEventHandler<SVGSVGElement>;
}) => (
  <svg
    onClick={onClick}
    className={className || ''}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
      fill="#444"
    />
  </svg>
);

export const ChevronDown = ({
  className,
  onClick
}: {
  className?: string;
  onClick?: MouseEventHandler<SVGSVGElement>;
}) => (
  <svg
    onClick={onClick}
    className={className || ''}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.70711 7.29289L10 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.68342 13.0976 9.29289 12.7071L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289Z"
      fill="#101010"
    />
  </svg>
);

export const CalendarIcon = ({
  className,
  onClick
}: {
  className?: string;
  onClick?: MouseEventHandler<SVGSVGElement>;
}) => (
  <svg
    onClick={onClick}
    className={className || ''}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_137_1694)">
      <path
        d="M2.70446 3.36737C2.35264 3.36737 2.01523 3.50713 1.76646 3.7559C1.51769 4.00468 1.37793 4.34208 1.37793 4.6939V17.2959C1.37793 17.6477 1.51769 17.9852 1.76646 18.2339C2.01523 18.4827 2.35264 18.6225 2.70446 18.6225H17.2963C17.6481 18.6225 17.9856 18.4827 18.2343 18.2339C18.483 17.9852 18.6228 17.6477 18.6228 17.2959V4.6939C18.6228 4.34208 18.483 4.00468 18.2343 3.7559C17.9856 3.50713 17.6481 3.36737 17.2963 3.36737H14.6432"
        stroke="#101010"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.35742 1.37756V5.35716"
        stroke="#101010"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6436 1.37756V5.35716"
        stroke="#101010"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.35742 3.36737H11.9901"
        stroke="#101010"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3164 8.67349V14.6426"
        stroke="#101010"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3271 10.1658H11.8246C12.6487 10.1658 13.3168 9.49765 13.3168 8.67349"
        stroke="#101010"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.3066 14.6429H11.3271"
        stroke="#101010"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.69434 13.648C4.89921 14.2275 5.45198 14.6429 6.10177 14.6429H7.09666C7.92086 14.6429 8.589 13.9747 8.589 13.1505V12.9018C8.589 12.0776 7.92086 11.4095 7.09666 11.4095H6.59922H6.97231C7.72782 11.4095 8.34028 10.797 8.34028 10.0415C8.34028 9.28595 7.72781 8.67348 6.97229 8.67349H6.22612C5.59996 8.67351 5.07205 9.09421 4.90964 9.66839"
        stroke="#101010"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_137_1694">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
