import { TimeRange, TimeRangeDeserializedValue } from '@embeddable.com/core';
import { DataResponse } from '@embeddable.com/react';
import { addMinutes, subMinutes } from 'date-fns';
import { useMemo } from 'react';

export default (props: any) => {
  const update = useMemo(() => {
    return {
      ...props,
      results: fix(props.results),
      prevResults: fix(props.prevResults)
    };

    function fix(results: DataResponse): DataResponse | void {
      if (!results) return;

      return {
        ...results,
        data: results?.data?.map((r) => {
          if (!r[props.xAxis?.name]) return r;

          return {
            ...r,
            [props.xAxis?.name]: toLocal(r[props.xAxis?.name])
          };
        })
      };
    }
  }, [props]);

  return update;
};

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
