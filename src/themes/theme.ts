export type ChartType =
  | 'bar'
  | 'line'
  | 'pie'
  | 'doughnut'
  | 'radar'
  | 'polarArea'
  | 'bubble'
  | 'scatter'
  | 'kpi';

export type Theme = {
  brand: {
    primary: string;
    secondary: string;
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
    family: string;
    size: number;
    imports: {
      [key: string]: string;
    };
  };
};

type ThemeDeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? ThemeDeepPartial<T[P]> : T[P];
};

export type ThemePartial = ThemeDeepPartial<Theme>;
