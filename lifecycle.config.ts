import { defaultTheme } from './src/themes/defaulttheme';
import { Theme } from './src/themes/theme';

export default {
  onThemeUpdated: (updatedTheme: Theme) => {
    console.log('Theme updated:', updatedTheme);
    // If for some reason the theme is not provided, use the default theme
    const theme = updatedTheme ? updatedTheme : defaultTheme;

    /*
     * This function generates a CSS variable for every property in the theme.
     * Note: this will generate some invalid CSS variables (eg: --embeddable-isParent: true).
     * This is fine, as we don't use them anywhere, and they won't affect the CSS.
     */
    const generateCssVariables = (obj: any, prefix = '--embeddable') => {
      let textContent = '';
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          textContent += generateCssVariables(obj[key], `${prefix}-${key}`);
        } else {
          textContent += `${prefix}-${key}: ${obj[key]};\n`;
        }
      }
      return textContent;
    };

    // Generate the variables and add them to the header if they're not already there
    const cssVariables = generateCssVariables(theme);
    const style = document.createElement('style');
    style.textContent = `:root {\n${cssVariables}}`;
    style.id = 'theme-config';

    if (!document.head.querySelector('#theme-config')) {
      document.head.appendChild(style);
    }

    // Cleanup: remove the style tag when the component is unmounted / re-rendered
    return () => {
      style.remove();
    };
  },
};
