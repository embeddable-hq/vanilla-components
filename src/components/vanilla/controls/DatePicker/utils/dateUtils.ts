import { Granularity, TimeRange, TimeRangeDeserializedValue } from '@embeddable.com/core';
import {
  differenceInCalendarDays,
  differenceInSeconds,
  endOfQuarter,
  format,
  getYear,
  startOfQuarter,
  subDays,
  subQuarters,
} from 'date-fns';

// Use this to not have to keep checking for undefined when we know it's defined
type MandatoryTimeRange = TimeRangeDeserializedValue & { from: Date; to: Date };

function toSeconds(unit: string, n: number): number {
  const unitsInSeconds: { [key: string]: number } = {
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2629800, // Roughly 30.44 days
    quarter: 7889400, // Roughly 91.31 days
    year: 31557600, // Based on a typical Gregorian year
  };
  return n * unitsInSeconds[unit];
}

export const determinePreviousMonth = (period: MandatoryTimeRange) => {
  const startMonth = period.from.getMonth();
  const startYear = period.from.getFullYear();
  const previousMonth = startMonth === 0 ? 11 : startMonth - 1;
  const previousYear = startMonth === 0 ? startYear - 1 : startYear;
  const daysInPreviousMonth = new Date(previousYear, previousMonth + 1, 0).getDate();
  const from = new Date(previousYear, previousMonth, 1);
  const to = new Date(previousYear, previousMonth, daysInPreviousMonth);
  return { from, to };
};

export const determinePreviousQuarter = (period: MandatoryTimeRange) => {
  const previousQuarter = subQuarters(period.from, 1);
  const previousQuarterStart = startOfQuarter(previousQuarter);
  const previousQuarterEnd = endOfQuarter(previousQuarter);
  return {
    from: previousQuarterStart,
    to: previousQuarterEnd,
  };
};

export const determinePreviousYear = (period: MandatoryTimeRange) => {
  const previousYear = getYear(period.from) - 1;
  const from = new Date(previousYear, 0, 1);
  const to = new Date(previousYear, 11, 31);
  return { from, to };
};

export function getComparisonOptions(period: TimeRange) {
  if (!period?.from || !period?.to) {
    return [{ value: 'No comparison' }];
  }
  const comparisonPeriod: MandatoryTimeRange = period as MandatoryTimeRange;

  const days = Math.abs(differenceInCalendarDays(comparisonPeriod.from, comparisonPeriod.to)) + 1;
  const previousMonth = determinePreviousMonth(comparisonPeriod);
  const previousQuarter = determinePreviousQuarter(comparisonPeriod);
  const previousYear = determinePreviousYear(comparisonPeriod);

  let weekNote = '';
  if (days > 7) {
    // We have to use "from" for both, here, because otherwise it produces more than 7 days
    weekNote = getNote(subDays(period.from, 7), subDays(period.from, 1));
  } else {
    // If the period is less than 7 days, we can give the exact spread from the previous week
    weekNote = getNote(subDays(period.from, 7), subDays(period.to, 7));
  }

  return [
    { value: 'No comparison' },
    {
      value: 'Previous period',
      note: getNote(subDays(period.from, days), subDays(period.to, days)),
    },
    {
      value: 'Previous week',
      note: weekNote,
    },
    {
      value: 'Previous month',
      note: getNote(previousMonth.from, previousMonth.to),
    },
    {
      value: 'Previous quarter',
      note: getNote(previousQuarter.from, previousQuarter.to),
    },
    {
      value: 'Previous year',
      note: getNote(previousYear.from, previousYear.to),
    },
  ];
}

export function getComparisonPeriod(rts: string, period: TimeRange) {
  if (!period?.from || !period?.to) {
    return {
      relativeTimeString: 'No comparison',
      from: new Date(),
      to: new Date(),
    };
  }
  const comparisonPeriod: MandatoryTimeRange = period as MandatoryTimeRange;
  if (rts === 'Previous week') {
    // Same calculation here, in order to keep the range consistent with the options
    const days = Math.abs(differenceInCalendarDays(period.from, period.to)) + 1;
    const from = subDays(period.from, 7);
    const to = days > 7 ? subDays(period.from, 1) : subDays(period.to, 7);
    return {
      relativeTimeString: 'previous week',
      from,
      to,
    };
  }
  if (rts === 'Previous month') {
    const previousMonth = determinePreviousMonth(comparisonPeriod);
    return {
      relativeTimeString: 'previous month',
      from: previousMonth.from,
      to: previousMonth.to,
    };
  } else if (rts === 'Previous quarter') {
    const previousQuarter = determinePreviousQuarter(comparisonPeriod);
    return {
      relativeTimeString: 'previous quarter',
      from: previousQuarter.from,
      to: previousQuarter.to,
    };
  } else if (rts === 'Previous year') {
    const previousYear = determinePreviousYear(comparisonPeriod);
    return {
      relativeTimeString: 'previous year',
      from: previousYear.from,
      to: previousYear.to,
    };
  } else {
    // Previous period
    const days = Math.abs(differenceInCalendarDays(period.from, period.to)) + 1;
    return {
      relativeTimeString: 'previous period',
      from: subDays(period.from, days),
      to: subDays(period.to, days),
    };
  }
}

export function getNote(from: Date, to: Date) {
  const formattedFrom = format(
    from,
    getYear(from) === getYear(new Date()) ? 'd MMM' : 'd MMM yyyy',
  );

  const formattedTo = format(to, getYear(to) === getYear(new Date()) ? 'd MMM' : 'd MMM yyyy');

  if (formattedFrom === formattedTo) {
    return formattedFrom;
  } else {
    return `${formattedFrom} - ${formattedTo}`;
  }
}

type GranularityResponse = {
  isLoading: boolean;
  data: { value: string }[];
  recommended: { value: Granularity };
};

export function getValidGranularities(period?: TimeRange): GranularityResponse {
  const data: { value: Granularity }[] = [];

  //period boundaries for valid granularity options
  const gSettings: { [key: string]: { min: number; max: number } } = {
    second: { min: 2, max: 100 },
    minute: { min: toSeconds('minute', 2), max: toSeconds('minute', 100) },
    hour: { min: toSeconds('hour', 2), max: toSeconds('hour', 100) },
    day: { min: toSeconds('day', 0.5), max: toSeconds('day', 168) },
    week: { min: toSeconds('week', 2), max: toSeconds('week', 365) },
    month: { min: toSeconds('month', 2), max: toSeconds('month', 730) },
    quarter: { min: toSeconds('quarter', 2), max: toSeconds('quarter', 36) },
    year: { min: toSeconds('year', 1.5), max: toSeconds('year', 1000) },
  };

  const granularities = Object.keys(gSettings);
  const diff = differenceInSeconds(period?.to || new Date(), period?.from || new Date());

  granularities.forEach((value) => {
    const { min, max } = gSettings[value];
    if (diff < min || diff > max) return;
    data.push({ value: value as Granularity });
  });

  let recommendedG: { value: Granularity } = { value: 'day' };
  if (data.length >= 2) recommendedG = data[data.length - 2]; //set the recommended granularity option as the penultimate valid option.

  return {
    isLoading: false,
    data,
    recommended: recommendedG,
  };
}
