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
  parseJSON,
  subDays,
  subHours,
  subMinutes,
  subMonths,
  subQuarters,
  subSeconds,
  subWeeks,
  subYears,
} from 'date-fns';
import { useCallback } from 'react';

type Record = { [p: string]: string };

const addTime: { [granularity: string]: (date: Date | number, amount: number) => Date } = {
  second: addSeconds,
  minute: addMinutes,
  hour: addHours,
  day: addDays,
  week: addWeeks,
  month: addMonths,
  quarter: addQuarters,
  year: addYears,
};

const subTime: { [granularity: string]: (date: Date | number, amount: number) => Date } = {
  second: subSeconds,
  minute: subMinutes,
  hour: subHours,
  day: subDays,
  week: subWeeks,
  month: subMonths,
  quarter: subQuarters,
  year: subYears,
};

const unitsInSeconds = {
  second: 1,
  minute: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2629800, // Roughly 30.44 days
  quarter: 7889400, // Roughly 91.31 days
  year: 31557600, // Based on a typical Gregorian year
};

type Props = {
  xAxis: Dimension;
  granularity?: Granularity;
};

export default (props: Props, sortOrder: string = 'asc') => {
  const { xAxis, granularity } = props;

  const fillGaps = useCallback(
    (memo: Record[], record: Record) => {
      const prevRecord = memo[memo.length - 1];

      if (!prevRecord) {
        return [...memo, record];
      }

      const prevDate = prevRecord[xAxis?.name || ''];
      const date = record[xAxis?.name || ''];

      if (!prevDate || !date) {
        return [...memo, record];
      }

      const seqDate =
        sortOrder === 'asc'
          ? addTime[granularity || 'day'](parseJSON(prevDate), 1)
          : subTime[granularity || 'day'](parseJSON(prevDate), 1);

      const dateSince1970 = parseJSON(date).getTime();
      const seqDateSince1970 = seqDate.getTime();

      // Check if the sequence date and current date are too close, meaning no gap to fill
      if (
        (sortOrder === 'asc'
          ? dateSince1970 <= seqDateSince1970
          : dateSince1970 >= seqDateSince1970) ||
        Math.abs(seqDateSince1970 - dateSince1970) < unitsInSeconds[granularity || 'day'] * 1000
      ) {
        return [...memo, record];
      }

      // Add the sequence date
      memo.push({ [xAxis?.name || '']: seqDate.toISOString().split('Z')[0] });

      // Recursive call to continue filling gaps
      return fillGaps(memo, record);
    },
    [xAxis, granularity, sortOrder],
  );

  return { fillGaps };
};
