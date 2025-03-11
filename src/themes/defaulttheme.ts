import { Theme } from './theme';

export const defaultTheme: Theme = {
  isParent: true, // Do not modify this!
  brand: {
    primary: '#6778DE',
    secondary: '#FF997C',
  },
  charts: {
    colors: [
      '#6778DE',
      '#FF997C',
      '#9EA4F4',
      '#B8B8D1',
      '#FF6B6C',
      '#FFC145',
      '#9DC7FF',
      '#FF805B',
      '#CD9FFF',
      '#E6DEDE',
      '#FFA6A6',
      '#FFD98D',
    ],
    options: {
      toolTipEnabled: true,
      usePointStyle: true,
    },
    /* Custom overrides for certain charts */
    bar: {},
    bubble: {
      font: {
        size: 12,
      },
    },
    kpi: {
      font: {
        size: 32,
        negativeColor: '#FF6B6C',
      },
    },
    line: {
      font: {
        size: 12,
      },
    },
    pie: {
      font: {
        size: 12,
      },
    },
    /* End custom chart overrides */
  },
  controls: {
    backgrounds: {
      colors: {
        lightGray: '#F3F4F6',
        mediumGray: '#D1D5DB',
        transparent: 'transparent',
        white: '#FFFFFF',
      },
    },
    buttons: {
      active: {
        background: '#FFFFFF',
        border: '#D1D5DB',
        fontColor: '#000',
      },
      hovered: {
        background: '#FFFFFF',
        border: '#A1A5AA',
        fontColor: '#000',
      },
      pressed: {
        background: '#F3F3F4',
        border: '#D1D5DB',
        fontColor: '#000',
      },
      fontSize: '14px',
      height: '50px',
      paddingY: '16px',
      paddingX: '32px',
      radius: 'calc(infinity+1px)',
    },
    borders: {
      colors: {
        lightGray: '#DADCE1',
        mediumGray: 'D1D5DB',
      },
      padding: 8,
      radius: '12px',
    },
    inputs: {
      colors: {
        hover: '#F3F4F6',
        selected: '#F3F4F6',
      },
    },
    tooltips: {
      radius: '4px',
    },
  },
  dateFormats: {
    year: 'yyyy',
    quarter: 'MMM yy',
    month: 'MMM yy',
    day: 'd MMM',
    week: 'd MMM',
    hour: 'eee HH:mm',
    minute: 'eee HH:mm',
    second: 'HH:mm:ss',
  },
  font: {
    color: '#888',
    colorDark: '#333942',
    colorLight: '#e3e3e3',
    family:
      '-apple-system, "system-ui", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    size: `14px`,
    weight: 400,
    imports: {
      // eg: 'Impact': 'impact',
    },
  },
  svg: {
    fillBkg: '#FFFFFF',
    fill: '#333942',
    fillDark: '#1D1E22',
    fillLight: '#474752',
    stroke: '#959CA8',
    strokeDark: '#101010',
    strokeLight: '#474752',
  },
};

export default defaultTheme;
