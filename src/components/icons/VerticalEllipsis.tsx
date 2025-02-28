import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../themes/theme';

type Props = {
  className?: string;
};

const VerticalEllipsis: React.FC<Props> = (props) => {
  const theme: Theme = useTheme() as Theme;

  return (
    <svg width="4" height="18" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 2C4 3.10457 3.10457 4 2 4C0.89543 4 0 3.10457 0 2C0 0.89543 0.89543 0 2 0C3.10457 0 4 0.89543 4 2Z"
        fill={theme.svg.fillLight}
      />
      <path
        d="M4 9C4 10.1046 3.10457 11 2 11C0.89543 11 0 10.1046 0 9C0 7.89543 0.89543 7 2 7C3.10457 7 4 7.89543 4 9Z"
        fill={theme.svg.fillLight}
      />
      <path
        d="M4 16C4 17.1046 3.10457 18 2 18C0.89543 18 0 17.1046 0 16C0 14.8954 0.89543 14 2 14C3.10457 14 4 14.8954 4 16Z"
        fill={theme.svg.fillLight}
      />
    </svg>
  );
};

export default VerticalEllipsis;
