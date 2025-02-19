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

type RadiusSuffix = '%' | 'px' | 'em' | 'vh';
type RadiusCalc = `calc(${number | string}${RadiusSuffix})`;

export type Theme = {
  isParent: boolean;
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
  controls: {
    buttons: {
      colors: {
        disabled: string;
        hoverBorder: string;
        pressed: string;
      };
      radius: RadiusCalc | `${number | string}${RadiusSuffix}`;
    };
    borders: {
      colors: {
        primary: string;
      };
      padding: number;
      radius: RadiusCalc | `${number | string}${RadiusSuffix}`;
    };
    tooltips: {
      radius: RadiusCalc | `${number | string}${RadiusSuffix}`;
    };
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
