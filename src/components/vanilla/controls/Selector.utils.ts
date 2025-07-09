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
