import { defaultTheme } from './src/themes/defaulttheme';
import { Theme } from './src/themes/theme';

export default {
  onThemeUpdated: (updatedTheme: Theme) => {
    // If for some reason the theme is not provided, use the default theme
    const theme = updatedTheme ? updatedTheme : defaultTheme;

    // Generate the variables and add them to the header if they're not already there
    const cssVariables = generateCssVariables(theme);
    const style = document.createElement('style');
    style.textContent = `:root {\n${cssVariables}}`;
    style.id = 'theme-config';

    if (!document.head.querySelector('#theme-config')) {
      document.head.appendChild(style);
    }

    // Load Google Fonts
    const fontFamily = theme.font.family;
    const fontLink = loadGoogleFonts(fontFamily, theme);
    if (fontLink) {
      const existingLink = document.head.querySelector('#google-fonts');
      if (existingLink) {
        existingLink.remove();
      }

      document.head.appendChild(fontLink);
    }

    // Also check for custom fonts in chart components
    const chartFontFamily = (theme.charts?.bar as any)?.font?.family;
    if (chartFontFamily) {
      const chartFontLink = loadGoogleFonts(chartFontFamily, theme);
      if (chartFontLink) {
        chartFontLink.id = 'google-fonts-chart';
        const existingChartLink = document.head.querySelector('#google-fonts-chart');
        if (existingChartLink) {
          existingChartLink.remove();
        }
        document.head.appendChild(chartFontLink);
      }
    }

    // Cleanup: remove the styles/fonts when the component is unmounted / re-rendered
    return () => {
      style.remove();
      const fontLink = document.head.querySelector('#google-fonts');
      if (fontLink) {
        fontLink.remove();
      }

      const chartFontLink = document.head.querySelector('#google-fonts-chart');
      if (chartFontLink) {
        chartFontLink.remove();
      }
    };
  },
};

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

/*
 * This function allows us to work with Google Fonts by parsing the font family string
 * and then loading the individual fonts.
 */
const loadGoogleFonts = (fontName: string, theme: Theme) => {
  // Skip system fonts that don't need to be loaded
  const systemFonts = [
    '-apple-system',
    'system-ui',
    'Segoe UI',
    'Roboto',
    'Helvetica',
    'Arial',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
  ];
  // Extract actual font names from the font-family string
  const fontNames = fontName
    .split(',')
    .map((font) => font.trim().replace(/"/g, '').replace(/'/g, ''));

  // Filter out system fonts
  const customFonts = fontNames.filter(
    (font) => !systemFonts.some((sysFont) => font.toLowerCase() === sysFont.toLowerCase()),
  );

  if (customFonts.length === 0) return null;

  // Create link for Google Fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.id = 'google-fonts';

  // Format the font name for Google Fonts URL (replace spaces with +)
  const formattedFontNames = customFonts.map((font) => font.replace(/\s+/g, '+')).join('|');
  fontLink.href = `https://fonts.googleapis.com/css2?family=${formattedFontNames}&display=swap`;

  return fontLink;
};
