import { Chart } from 'chart.js';

export type ChartType =
  | 'bar'
  | 'line'
  | 'pie'
  | 'doughnut'
  | 'radar'
  | 'polarArea'
  | 'bubble'
  | 'scatter';

export type Theme = {
  'brand-color-primary': string;
  'brand-color-secondary': string;
  charts: {
    colors: string[];
    font: {
      color: string;
      family: string;
      size: number;
    };
    options: {
      toolTipEnabled: boolean;
      usePointStyle: boolean;
    };
  } & {
    [key in ChartType]?: any;
  };
  dateFormats: {
    year: string;
    quarter: string;
    month: string;
    day: string;
    week: string;
    hour: string;
    minute: string;
    second: string;
  };
};

type ThemeDeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? ThemeDeepPartial<T[P]> : T[P];
};

export type ThemePartial = ThemeDeepPartial<Theme>;

/*
 * This will require changes to the typescript build process to be accessible outside of
 * the package. For now, we will just export the type.
 */
const defaultTheme: Theme = {
  'brand-color-primary': '#6778DE',
  'brand-color-secondary': '#FF997C',
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
    font: {
      color: '#888',
      family:
        '-apple-system, "system-ui", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      size: 14,
    },
    options: {
      toolTipEnabled: true,
      usePointStyle: true,
    },
    bar: {},
    bubble: {
      font: {
        size: 12,
      },
    },
    pie: {
      font: {
        size: 12,
      },
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
};

export default defaultTheme;
