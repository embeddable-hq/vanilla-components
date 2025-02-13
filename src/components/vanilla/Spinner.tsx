import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Theme } from '../../themes/theme';
import { useTheme } from '@embeddable.com/react';

type Props = {
  show?: boolean;
  className?: string;
  size?: string;
};

export default function Spinner({ show, className, size }: Props) {
  const theme: Theme = useTheme() as Theme;
  return (
    <svg
      className={twMerge(
        `absolute right-0 top-0 z-1 pointer-events-none spinner ${
          show ? 'opacity-100' : 'opacity-0'
        }`,
        className,
      )}
      width={size || '24'}
      height={size || '24'}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_400_10215)">
        <g clipPath="url(#clip1_400_10215)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.4475 2.54357C11.7603 2.28621 10.0351 2.48325 8.44944 3.11441C6.86379 3.74557 5.47506 4.78803 4.42629 6.13441C3.37753 7.4808 2.70664 9.08242 2.48274 10.7743C2.25883 12.4662 2.49001 14.1872 3.15245 15.7601C3.8149 17.3329 4.88466 18.7007 6.25155 19.7226C7.61844 20.7445 9.23304 21.3835 10.929 21.5739C11.5876 21.6478 12.0616 22.2416 11.9877 22.9002C11.9138 23.5589 11.32 24.0328 10.6614 23.9589C8.54135 23.721 6.5231 22.9222 4.81449 21.6448C3.10588 20.3675 1.76868 18.6577 0.940626 16.6916C0.112572 14.7256 -0.176398 12.5743 0.10348 10.4595C0.383359 8.34458 1.22197 6.34255 2.53293 4.65957C3.84389 2.97659 5.5798 1.67352 7.56186 0.884569C9.54393 0.0956166 11.7005 -0.150689 13.8094 0.171021C15.9183 0.492732 17.9033 1.37083 19.56 2.71486C21.2167 4.0589 22.4852 5.82028 23.2347 7.81758C23.4675 8.43807 23.1533 9.12984 22.5328 9.3627C21.9123 9.59555 21.2206 9.28131 20.9877 8.66082C20.3881 7.06298 19.3733 5.65388 18.048 4.57865C16.7226 3.50342 15.1346 2.80094 13.4475 2.54357Z"
            fill={theme.svg.fill}
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_400_10215">
          <rect width="24" height="24" fill={theme.svg.fillBkg} />
        </clipPath>
        <clipPath id="clip1_400_10215">
          <rect width="24" height="24" fill={theme.svg.fillBkg} />
        </clipPath>
      </defs>
    </svg>
  );
}
