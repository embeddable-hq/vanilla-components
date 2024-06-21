import { SortDirection } from '../../enums/SortDirection';

export const basicSort = (a: any, b: any, sortDirection: SortDirection) => {
  if (!a) {
    return 1;
  }
  if (!b) {
    return -1;
  }

  if (!a && !b) {
    return 0;
  }

  return (a.toString().localeCompare(b.toString(), 'en', {
    numeric: true,
    sensitivity: 'base'
  }) * (sortDirection === SortDirection.ASCENDING ? 1 : -1));
}