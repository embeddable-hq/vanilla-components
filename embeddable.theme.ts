import { Theme } from './src/themes/theme';
import defaultTheme from './src/themes/defaulttheme';

const themeProvider = (clientContext: any, parentTheme: Theme): any => {
  const theme = defaultTheme;
  const test = 'test';
  console.log(test);
  return theme;
};

export default themeProvider;
