import React from 'react';
import Spinner from './Spinner';
import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../themes/theme';

type Props = {
  buttonLabel?: string;
  showSpinner?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
};

export default function Button({ buttonLabel, showSpinner, disabled, onClick, icon }: Props) {
  const theme: Theme = useTheme() as Theme;

  return (
    <button
      disabled={disabled}
      className={`text-[${theme.font.size}] border border-gray-300 h-[50px] rounded-full py-[16px] px-[32px] flex gap-[8px] items-center justify-center disabled:opacity-[0.6] disabled:background-[${theme.buttons.colors.disabled}] disabled:cursor-not-allowed hover:border-[${theme.buttons.colors.hoverBorder}]] pressed:background-[${theme.buttons.colors.pressed}]`}
      onClick={onClick}
      type="button"
    >
      {showSpinner ? <Spinner show className={'relative'} size={'20'} /> : icon}
      {buttonLabel}
    </button>
  );
}
