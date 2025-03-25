export type ChartType = 'bar' | 'bubble' | 'kpi' | 'line' | 'pie' | 'scatter';

type ButtonSettings = {
  background: string;
  fontColor: string;
  border: string;
};

type BarChartBorderRadius = {
  topRight: number;
  topLeft: number;
  bottomRight: number;
  bottomLeft: number;
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
    fontWeights: {
      description: number;
      kpiNumber: number;
      pagination: number;
      title: number;
    };
    bar: {
      borderRadius: number | BarChartBorderRadius;
      borderSkipped:
        | 'start'
        | 'end'
        | 'middle'
        | 'bottom'
        | 'left'
        | 'top'
        | 'right'
        | false
        | true;
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
  container: {
    boxShadow: string;
    borderRadius: string;
    padding: string;
    border: string;
  };
  controls: {
    backgrounds: {
      colors: {
        heavy: string;
        normal: string;
        soft: string;
        transparent: string;
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
        normal: string;
        heavy: string;
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
    colorNormal: string;
    colorSoft: string;
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
    fillBkg: string;
    fillStrong: string;
    fillNormal: string;
    strokeNormal: string;
    strokeStrong: string;
    strokeSoft: string;
  };
};

type ThemeDeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? ThemeDeepPartial<T[P]> : T[P];
};

export type ThemePartial = ThemeDeepPartial<Theme>;
