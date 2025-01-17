import { Granularity } from '@embeddable.com/core';
import { format } from 'date-fns';
import { Theme } from '../../defaulttheme';

// import { DATE_DISPLAY_FORMATS } from '../constants';

export default function formatDateTooltips(lines: any[], granularity: Granularity, theme: Theme) {
  const linesList = lines.map((line) => line?.parsed?.x?.valueOf());
  const set = [...new Set(linesList)];
  if (set.length === 1 && set[0] === undefined) {
    return;
  }
  return set
    .map((date) => format(new Date(date), theme.dateFormats[granularity]))
    .filter((v) => !!v);
}
