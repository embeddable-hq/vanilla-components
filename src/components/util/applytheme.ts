import { COLORS } from '../constants';

const applyTheme = () => {
  /*
  /
  /
  / This file will change when we stop using shadow DOM
  /
  /
  /
  */

  // Determine if we're in builder mode or display mode
  const isBuilderMode = document.querySelector('em-beddable') ? false : true;
  const themeObj: any = {
    // chartColors: ['#444', '#555', '#666', '#777', '#888', '#999', '#aaa', '#bbb'],
    chartColors: COLORS,
    font: {
      size: 12,
      color: '#000',
      family: 'Comic Sans',
    },
  };

  // Generate colors by theme
  const generateColors = () => {
    // Pull colors from theme
    const container = document.querySelector('em-beddable');
    const shadowRoot = container?.shadowRoot;

    if (shadowRoot) {
      const styles = window.getComputedStyle(shadowRoot.host);

      // Supports up to 1000(!) theme colors, but only sequentially
      const colors: string[] = [];
      for (let i = 1; i < 1000; i += 1) {
        const color = styles.getPropertyValue(`--chart-color-${i}`);
        if (color) {
          colors.push(color);
        } else {
          break;
        }
      }
      return colors;
    }
    return [];
  };

  // If we're in builder mode, apply the theme to the builder
  if (isBuilderMode) {
    // console.log('builder mode');
  } else {
    const colors = generateColors();
    if (colors?.length > 0) {
      themeObj.chartColors = colors;
    }
  }
  console.log('here');

  return themeObj;
};

export default applyTheme;
