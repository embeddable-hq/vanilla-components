import React from 'react';
import Spinner from './Spinner';

type Props = {
  buttonLabel?: string;
  showSpinner?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
};

export default function Button({ buttonLabel, showSpinner, disabled, onClick, icon }: Props) {
  return (
    <button
      disabled={disabled}
      className={`
        border
        disabled:cursor-not-allowed
        disabled:opacity-[0.6]
        flex
        gap-[8px]
        items-center
        justify-center
        bg-[color:--embeddable-controls-buttons-active-background]
        border-[color:--embeddable-controls-buttons-active-border]
        h-[--embeddable-controls-buttons-height]
        hover:bg-[color:--embeddable-controls-buttons-hovered-background]
        hover:border-[color:--embeddable-controls-buttons-hovered-border]
        hover:text-[color:--embeddable-controls-buttons-hovered-fontColor]
        pressed:bg-[color:--embeddable-controls-buttons-colors-pressed]
        pressed:border-[color:--embeddable-controls-buttons-pressed-border]
        pressed:text-[color:--embeddable-controls-buttons-pressed-fontColor]
        px-[--embeddable-controls-buttons-paddingX]
        py-[--embeddable-controls-buttons-paddingY]
        rounded-[--embeddable-controls-buttons-radius] 
        text-[color:--embeddable-controls-buttons-active-fontColor]
        text-[font-size:--embeddable-font-size]
      `}
      onClick={onClick}
      type="button"
    >
      {showSpinner ? <Spinner show className={'relative'} size={'20'} /> : icon}
      {buttonLabel}
    </button>
  );
}
