import { Dimension, Measure } from '@embeddable.com/core';

const DIMENSION_KEY_SEPARATOR = '-->';

export const createGeneralKey = (value: string | number | boolean) => {
  if (value === null || value === undefined) {
    return '';
  }

  return value.toString().replaceAll(' ', '_').toLowerCase();
}

export const createColumnKey = (dimensionValues: string[]) => {
  return [
    ...dimensionValues.map(dimensionValue => createGeneralKey(dimensionValue)),
  ].join(DIMENSION_KEY_SEPARATOR);
}