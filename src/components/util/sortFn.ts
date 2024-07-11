import { SortDirection } from '../../enums/SortDirection';

export type SortCriteria<T> = {
  key: keyof T | ((item: T) => string);
  direction: SortDirection;
}

function getValue<T>(item: T, key: keyof T | ((item: T) => any)): any {
  return typeof key === 'function' ? key(item) : item[key];
}

function isNumber(num: any): boolean {
  return !isNaN(num);
}

export const multisortFn = <T>(criteria: SortCriteria<T>[]): (a: T, b: T) => number => {
  return (a: T, b: T): number => {
    for (const { key, direction } of criteria) {
      const aValue = getValue(a, key);
      const bValue = getValue(b, key);

      const result = basicSortFn(aValue, bValue, direction);
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  };
}

export const basicSortFn = (a: any, b: any, sortDirection: SortDirection): number => {
  if (a === null) {
    return 1;
  }

  if (b === null) {
    return -1;
  }

  if (a === null && b === null) {
    return 0;
  }

  if (isNumber(a) && isNumber(b)) {
    const valA = parseInt(a, 10);
    const valB = parseInt(b, 10);

    if (valA < valB) {
      return sortDirection === SortDirection.ASCENDING ? -1 : 1;
    }
    if (valA > valB) {
      return sortDirection === SortDirection.ASCENDING ? 1 : -1;
    }

    return 0;
  } else if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b, undefined, {
      sensitivity: 'base',
      numeric: true,
    }) * (sortDirection === SortDirection.ASCENDING ? 1 : -1);
  } else if (typeof a === 'number') {
    return -1; // Numbers come before strings
  } else {
    return 1; // Strings come after numbers
  }
}