import { defaultTheme, Theme } from './src';

export default {
  onThemeUpdated: (config: { theme: Theme }) => {
    console.log('onThemeUpdated', config);
    const theme = config.theme ? config.theme : defaultTheme;
    const style = document.createElement('style');
    style.textContent = `:root {
        --embeddable-font-family: ${theme.font.family};
        --embeddable-font-size: ${theme.font.size};
        --embeddable-font-color: ${theme.font.color};
        --embeddable-font-weight: ${theme.font.weight};
        --embeddable-table-header-color: ${theme.font.colorDark};
        --embeddable-button-radius: ${theme.controls.buttons.radius};
        --embeddable-button-color: 'A00';
      }`;
    style.id = 'theme-config';

    if (!document.head.querySelector('#theme-config')) {
      document.head.appendChild(style);
    }
    return () => {
      style.remove();
    };
  },
};
