import { format as formatDate } from 'date-fns';

import { parseTime } from '../util/timezone';

type Type = 'number' | 'date' | 'string';

type Options = {
  type?: Type;
  truncate?: number;
  dateFormat?: string;
  meta?: { pretext?: string; posttext?: string };
  dps?: number;
};

function numberFormatter(dps: number | undefined | null) {
  const fallback = dps == null || dps < 0;
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: fallback ? 0 : dps, // Minimum number of digits after the decimal
    maximumFractionDigits: fallback ? 2 : dps, // Maximum number of digits after the decimal
  });
}

const dateFormatter = new Intl.DateTimeFormat();

export default function formatValue(str: string = '', opt: Type | Options = 'string') {
  if (str === null) return null;

  const { type, dateFormat, meta, truncate, dps }: Options =
    typeof opt === 'string' ? { type: opt } : opt;

  if (type === 'number') return wrap(numberFormatter(dps).format(parseFloat(str)));

  if (type === 'date' && str.endsWith('T00:00:00.000')) {
    return wrap(dateFormatter.format(new Date(str)));
  }

  if (type === 'date') return wrap(new Date(str).toLocaleString());

  if (truncate) {
    return str?.length > truncate
      ? `${meta?.pretext || ''}${str.substring(0, truncate)}...`
      : wrap(str);
  }

  if (dateFormat && str) return wrap(formatDate(parseTime(str), dateFormat));

  return str;

  function wrap(v: string) {
    return `${meta?.pretext || ''}${v}${meta?.posttext || ''}`;
  }
}

export const detectAndReturnLinks = (text: string) => {
  if (!text) {
    return { linkText: null, linkUrl: null };
  }
  const linkData = /\[(.*)\]\((.*)\)/.exec(text);
  return { linkText: linkData?.[1], linkUrl: encodeURI(linkData?.[2] || '') };
};
