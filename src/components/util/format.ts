import { format as formatDate, parseJSON } from 'date-fns';

type Type = 'number' | 'date' | 'string';

type Options = {
  type?: Type;
  truncate?: number;
  dateFormat?: string;
  meta?: { prefix?: string; suffix?: string };
  dps?: number;
};

function numberFormatter(dps: number | undefined) {
  return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: isNaN(dps) ? 0 : dps, // Minimum number of digits after the decimal
      maximumFractionDigits: isNaN(dps) ? 3 : dps, // Maximum number of digits after the decimal
  });
}

const dateFormatter = new Intl.DateTimeFormat();

export default function format(str: string = '', opt: Type | Options = 'string') {
  const { type, dateFormat, meta, truncate, dps }: Options =
    typeof opt === 'string' ? { type: opt } : opt;

  str = str || '';

  if (type === 'number') return wrap(numberFormatter(dps).format(parseFloat(str)));

  if (type === 'date' && str.endsWith('T00:00:00.000')) {
    return wrap(dateFormatter.format(new Date(str)));
  }

  if (type === 'date') return wrap(new Date(str).toLocaleString());

  if (truncate) {
    return str?.length > truncate
      ? `${meta?.prefix || ''}${str.substring(0, truncate)}...`
      : wrap(str);
  }

  if (dateFormat) return wrap(formatDate(parseJSON(str), dateFormat));

  return str;

  function wrap(v: string) {
    return `${meta?.prefix || ''}${v}${meta?.suffix || ''}`;
  }
}
