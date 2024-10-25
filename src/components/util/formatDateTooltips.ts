import { Granularity } from '@embeddable.com/core';
import { format } from 'date-fns';

import { DATE_DISPLAY_FORMATS } from '../constants';

export default function formatDateTooltips(lines: any[], granularity: Granularity) {
  const linesList = lines.map((line) => line?.parsed?.x?.valueOf());
  const set = [...new Set(linesList)];
  if (set.length === 1 && set[0] === undefined) {
    return;
  }
  return set
    .map((date) =>
      format(
        new Date(date),
        DATE_DISPLAY_FORMATS[granularity as keyof typeof DATE_DISPLAY_FORMATS],
      ),
    )
    .filter((v) => !!v);
}
