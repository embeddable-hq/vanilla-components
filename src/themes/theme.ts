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

type ButtonSettings = {
  background: string;
  fontColor: string;
  border: string;
};

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
      active: ButtonSettings;
      hovered: ButtonSettings;
      pressed: ButtonSettings;
      fontSize: string;
      height: string;
      paddingY: string;
      paddingX: string;
      radius: string;
    };
    borders: {
      colors: {
        primary: string;
      };
      padding: number;
      radius: string;
    };
    inputs: {
      colors: {
        hover: string;
        selected: string;
      };
    };
    tooltips: {
      radius: string;
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
