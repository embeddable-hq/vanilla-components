import { Dimension, DimensionOrMeasure, Measure } from '@embeddable.com/core';

export const selectorOptionIncludesSearch = (
  search: string,
  option: Measure | Dimension | DimensionOrMeasure,
) =>
  !search ||
  option.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
  option.title.toLocaleLowerCase().includes(search.toLocaleLowerCase());

export const getSelectorOptions = (options: Measure[] | Dimension[] | DimensionOrMeasure[]) =>
  options.map((option) => ({
    value: option.name,
    label: option.inputs?.overrideName ?? option.title,
  }));
