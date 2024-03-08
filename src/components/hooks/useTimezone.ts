import { TimeRange } from '@embeddable.com/core';
import { addMinutes, subMinutes } from 'date-fns';

const offset = new Date().getTimezoneOffset();

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

  if (date instanceof Date) return subMinutes(date, offset);

  const t = new Date(date);

  if (!t) return undefined;

  return subMinutes(t, offset);
}

export function toLocal(date: string | Date): Date | undefined {
  if (!date) return undefined;

  if (date instanceof Date) return addMinutes(date, offset);

  const t = new Date(date);

  if (!t) return undefined;

  return addMinutes(t, offset);
}
