import { Dimension, Granularity } from '@embeddable.com/core';
import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addQuarters,
  addSeconds,
  addWeeks,
  addYears,
  parseJSON
} from 'date-fns';
import { useCallback } from 'react';
import { parseTime } from './useTimezone'

type Record = { [p: string]: string };

const addTime: { [granularity: string]: (date: Date | number, amount: number) => Date } = {
  second: addSeconds,
  minute: addMinutes,
  hour: addHours,
  day: addDays,
  week: addWeeks,
  month: addMonths,
  quarter: addQuarters,
  year: addYears
};


const unitsInSeconds = {
  minute: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2629800,  // Roughly 30.44 days
  quarter: 7889400,  // Roughly 91.31 days
  year: 31557600  // Based on a typical Gregorian year
};

export default ({ xAxis, granularity }: { xAxis?: Dimension; granularity?: Granularity }) => {
  const fillGaps = useCallback(
    (memo: Record[], record: Record) => {
      const last = memo[memo.length - 1];

      if (!last) return [...memo, record];

      const lastDate = last[xAxis?.name || ''];

      const thisDate = record[xAxis?.name || ''];

      if (!lastDate || !thisDate) return [...memo, record];

      const seqDate = addTime[granularity || 'day'](parseJSON(lastDate), 1);
      const currDate = parseJSON(thisDate);

      const seqDateSince1970 = seqDate.getTime();
      const currDateSince1970 = currDate.getTime();


      //comparison against granularity below to account for daylight savings time changes 
      if((currDateSince1970 <= seqDateSince1970 || Math.abs(seqDateSince1970 - currDateSince1970) < unitsInSeconds[granularity || 'day'] * 1000)) return [...memo, record];

      memo.push({ [xAxis?.name || '']: seqDate.toISOString().split('Z')[0] });

      return fillGaps(memo, record);
    },
    [xAxis, granularity]
  );

  return { fillGaps };
};
