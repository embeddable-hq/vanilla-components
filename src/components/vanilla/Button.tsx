import React from 'react';
import Spinner from './Spinner';
import { useOverrideConfig } from '@embeddable.com/react';
import defaultTheme, { Theme } from '../../defaulttheme';

type Props = {
  buttonLabel?: string;
  showSpinner?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
};

export default function Button({ buttonLabel, showSpinner, disabled, onClick, icon }: Props) {
  const overrides: { theme: Theme } = useOverrideConfig() as { theme: Theme };
  let { theme } = overrides;
  if (!theme) {
    theme = defaultTheme;
  }

  return (
    <button
      disabled={disabled}
      className={`text-[${theme.font.size}] border border-gray-300 h-[50px] rounded-full py-[16px] px-[32px] flex gap-[8px] items-center justify-center disabled:opacity-[0.6] disabled:background-[#F3F3F4] disabled:cursor-not-allowed hover:border-[#A1A5AA] pressed:background-[#F3F3F4]`}
      onClick={onClick}
      type="button"
    >
      {showSpinner ? <Spinner show className={'relative'} size={'20'} /> : icon}
      {buttonLabel}
    </button>
  );
}
