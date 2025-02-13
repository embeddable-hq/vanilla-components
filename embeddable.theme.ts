import { Theme } from './src/themes/theme';
import defaultTheme from './src/themes/defaulttheme';

const themeProvider = (clientContext: any, parentTheme: Theme): any => {
  const theme = defaultTheme;
  return theme;
};

export default themeProvider;
