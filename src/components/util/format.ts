import { DimensionOrMeasure } from '@embeddable.com/core';
import { format as formatDate, parseJSON } from 'date-fns';

type Type = 'number' | 'date' | 'string';

type Options = {
  type?: Type;
  truncate?: number;
  dateFormat?: string;
  meta?: DimensionOrMeasure['meta'];
};

const numberFormatter = new Intl.NumberFormat();

const dateFormatter = new Intl.DateTimeFormat();

export default function format(value: string = '', options: Type | Options = 'string') {
  const type = typeof options === 'string' ? options : options.type;

  if (type === 'number') return numberFormatter.format(parseFloat(value));

  if (type === 'date' && value.endsWith('T00:00:00.000')) {
    return dateFormatter.format(new Date(value));
  }

  if (type === 'date') return new Date(value).toLocaleString();

  if (typeof options === 'string') return value;

  if (options?.truncate) {
    return value?.length > options?.truncate
      ? `${value.substring(0, options?.truncate)}...`
      : value;
  }

  if (options?.dateFormat) return formatDate(parseJSON(value), options.dateFormat);

  return value;
}
