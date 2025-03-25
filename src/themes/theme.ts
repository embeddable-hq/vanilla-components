export type ChartType = 'bar' | 'bubble' | 'kpi' | 'line' | 'pie' | 'scatter';

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
    textJustify:
      | 'start'
      | 'end'
      | 'center'
      | 'between'
      | 'around'
      | 'evenly'
      | 'stretch'
      | 'baseline'
      | 'normal';
    bar: {
      borderRadius: number;
      borderWidth: number;
      colors?: string[];
      font: {
        size: number;
      };
    };
    bubble: {
      colors?: string[];
      font: {
        size: number;
      };
    };
    kpi: {
      alignment: string;
      colors?: string[];
      font: {
        negativeColor: string;
        size: number;
      };
    };
    line: {
      colors?: string[];
      font: {
        size: number;
      };
      lineTension: number;
    };
    pie: {
      colors?: string[];
      font: {
        size: number;
      };
    };
    scatter: {
      colors?: string[];
      font: {
        size: number;
      };
    };
  };
  controls: {
    backgrounds: {
      colors: {
        lightGray: string;
        mediumGray: string;
        transparent: string;
        white: string;
      };
    };
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
        lightGray: string;
        mediumGray: string;
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
    size: string;
    weight: number;
    imports: {
      [key: string]: string;
    };
  };
  png: {
    backgroundColor: string;
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
