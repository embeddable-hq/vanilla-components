import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../themes/theme';

const CheckboxEmpty: React.FC = () => {
  const theme: Theme = useTheme() as Theme;
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0.666667 2.66667C0.666667 1.5621 1.5621 0.666667 2.66667 0.666667H13.3333C14.4379 0.666667 15.3333 1.5621 15.3333 2.66667V13.3333C15.3333 14.4379 14.4379 15.3333 13.3333 15.3333H2.66667C1.5621 15.3333 0.666667 14.4379 0.666667 13.3333V2.66667Z"
        stroke={theme.svg.stroke}
        strokeWidth="1.33333"
      />
    </svg>
  );
};

export default CheckboxEmpty;
