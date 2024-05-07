import { TimeRange } from '@embeddable.com/core';
import { addMinutes, subMinutes } from 'date-fns';
import {
  parseJSON
} from 'date-fns';

export function parseTime(dateStr: string): number {
  const d: Date = parseJSON(dateStr);
  return d.valueOf() + d.getTimezoneOffset() * 60000;
}


export function timeRangeToUTC(range?: TimeRange) {
  if (!range?.to || !range?.from) return range;

  return {
    ...range,
    to: toUTC(range.to),
    from: toUTC(range.from)
  };
}

export function timeRangeToLocal(range?: TimeRange) {
  if (!range?.to || !range?.from) return range;

  return {
    ...range,
    to: toLocal(range.to),
    from: toLocal(range.from)
  };
}

export function toUTC(date: string | Date): Date | undefined {
  if (!date) return undefined;

  if (date instanceof Date) return subMinutes(date, date.getTimezoneOffset());

  const t = new Date(date);

  if (!t) return undefined;

  return subMinutes(t, date.getTimezoneOffset());
}

export function toLocal(date: string | Date): Date | undefined {
  if (!date) return undefined;

  if (date instanceof Date) return addMinutes(date, date.getTimezoneOffset());

  const t = new Date(date);

  if (!t) return undefined;

  return addMinutes(t, date.getTimezoneOffset());
}
