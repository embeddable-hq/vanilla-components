import { Theme } from './theme';

export const defaultTheme: Theme = {
  brand: {
    primary: '#6778DE',
    secondary: '#FF997C',
  },
  buttons: {
    colors: {
      disabled: '#F3F3F3',
      hoverBorder: '#A1A5AA',
      pressed: '#F3F3F3',
    },
  },
  borders: {
    colors: {
      primary: '#DADCE1',
    },
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
    size: 14,
    weight: 400,
    imports: {
      // eg: 'Impact': 'impact',
    },
  },
  inputs: {
    colors: {
      hover: '#F3F4F6',
      selected: '#F3F4F6',
    },
  },
  svg: {
    fillBkg: 'white',
    fill: '#333942',
    fillDark: '#1D1E22',
    fillLight: '#474752',
    stroke: '#959CA8',
    strokeDark: '#101010',
  },
};

export default defaultTheme;
