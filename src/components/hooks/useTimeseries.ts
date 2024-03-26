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

export default ({ xAxis, granularity }: { xAxis?: Dimension; granularity?: Granularity }) => {
  const fillGaps = useCallback(
    (memo: Record[], record: Record) => {
      const last = memo[memo.length - 1];

      if (!last) return [...memo, record];

      const lastDate = last[xAxis?.name || ''];

      const thisDate = record[xAxis?.name || ''];

      if (!lastDate || !thisDate) return [...memo, record];

      const seqDate = addTime[granularity || 'day'](parseJSON(lastDate), 1);

      if (parseJSON(thisDate).valueOf() <= seqDate.valueOf()) return [...memo, record];

      memo.push({ [xAxis?.name || '']: seqDate.toJSON() });

      return fillGaps(memo, record);
    },
    [xAxis, granularity]
  );

  return { fillGaps };
};
