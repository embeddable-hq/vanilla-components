import { Dimension, DimensionOrMeasure, Measure } from '@embeddable.com/core';
import { SelectorOption } from './Selector.types';

export const selectorOptionIncludesSearch = (search: string, option: SelectorOption) =>
  !search ||
  option.value.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
  option.label.toLocaleLowerCase().includes(search.toLocaleLowerCase());

export const getSelectorOptions = (options: Measure[] | Dimension[] | DimensionOrMeasure[]) =>
  options.map((option) => ({
    value: option.name,
    label: option.inputs?.overrideName ?? option.title,
  }));

export const getSelectorDefaultValue = (
  defaultValue: Measure | Dimension | DimensionOrMeasure | undefined,
  options: Measure[] | Dimension[] | DimensionOrMeasure[],
) => {
  if (!defaultValue) return undefined;

  return options.find((option) => option.name === defaultValue.name)?.name || undefined;
};

export const getMultiSelectorDefaultValue = (
  defaultValue: Measure[] | Dimension[] | DimensionOrMeasure[] | undefined,
  options: Measure[] | Dimension[] | DimensionOrMeasure[],
) => {
  if (!defaultValue) return undefined;

  return options
    .filter((option) => defaultValue.some((value) => value.name === option.name))
    .map((option) => option.name);
};
