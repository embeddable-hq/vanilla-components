export type Theme = {
  brandColorPrimary: string;
  brandColorSecondary: string;
  chartColors: string[];
  chartFont: {
    color: string;
    family: string;
    size: number;
  };
  chartOptions: {
    toolTipEnabled: boolean;
  };
};

const theme: Theme = {
  brandColorPrimary: '#6778DE',
  brandColorSecondary: '#FF997C',
  chartColors: [
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
  chartFont: {
    color: '#888',
    family:
      '-apple-system, "system-ui", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    size: 14,
  },
  chartOptions: {
    toolTipEnabled: true,
  },
};

export default theme;
