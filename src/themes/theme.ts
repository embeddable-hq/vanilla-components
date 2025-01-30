export type ChartType =
  | 'bar'
  | 'bubble'
  | 'doughnut'
  | 'kpi'
  | 'line'
  | 'pie'
  | 'pivotTable'
  | 'polarArea'
  | 'radar'
  | 'scatter'
  | 'table';

export type Theme = {
  brand: {
    primary: string;
    secondary: string;
  };
  buttons: {
    colors: {
      disabled: string;
      hoverBorder: string;
      pressed: string;
    };
  };
  borders: {
    colors: {
      primary: string;
    };
  };
  charts: {
    colors: string[];
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
  font: {
    color: string;
    colorDark: string;
    colorLight: string;
    family: string;
    size: number;
    weight: number;
    imports: {
      [key: string]: string;
    };
  };
  inputs: {
    colors: {
      hover: string;
      selected: string;
    };
  };
  svg: {
    fill: string;
    fillBkg: string;
    fillDark: string;
    fillLight: string;
    stroke: string;
    strokeDark: string;
    strokeLight: string;
  };
};

type ThemeDeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? ThemeDeepPartial<T[P]> : T[P];
};

export type ThemePartial = ThemeDeepPartial<Theme>;
