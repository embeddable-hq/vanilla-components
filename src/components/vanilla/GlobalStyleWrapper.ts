import { createGlobalStyle } from 'styled-components';
import { Theme } from '../../themes/theme';

const GlobalStyleWrapper = (theme: Theme) => {
  const GlobalStyle = createGlobalStyle`
    .font-embeddable {
      font-family: ${theme.font.family};
    }
  `;
  return GlobalStyle;
};

export default GlobalStyleWrapper;
